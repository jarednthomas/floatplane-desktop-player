/*jshint esversion: 6 */
const path = require('path');
const electron = require('electron');
const c = require('./app/constants');
const Helper = require('./app/helper');
const AppTray = require('./app/app_tray');
const setAppMenu = require('./app/app_menu');
const MainWindow = require('./app/main_window');
const ElectronPrefs = require('electron-prefs');

const { app, Menu, ipcMain, Notification } = electron;

let mainWindow;
let spinnerWindow;
let offlineWindow;
let tray;
let isQuitting;
let appIconPath;

// User and Window Preferences
const prefs = new ElectronPrefs({
  fileName: 'config.js',
  defaults: {
    window: {
      x: 0,
      width: 800,
      height: 600
    }
  }
});

// before-quit listener
app.on('before-quit', function() {
  isQuitting = true;
});

// Initialization
app.on('ready', () => {

  // Setup icons
  let appIcon = 'app-win.ico';
  let trayIcon = 'tray-win.ico';

  // Determine OS
  if (Helper.isLinux()) {
    appIcon = 'app-linux512x512.png';
    trayIcon = 'tray-linux32x32.png';
  }

  if (Helper.isMacOS()) {
    appIcon = 'app-mac.png';
    trayIcon = 'tray-mac.png';
  }

  // Set Paths
  const trayIconPath = path.join(__dirname, 'src', 'assets', trayIcon);
  appIconPath = path.join(__dirname, 'src', 'assets', appIcon);

  // Load Animation
  loadAppWindows(c.settings.showLoader);

  // create MainWindow and tray
  setAppMenu(mainWindow);
  tray = new AppTray(trayIconPath, mainWindow);

  /* create TouchBar for macOS
  if (Helper.useTouchBar()) {
    const setTouchBar = require('./app/touch_bar');
    setTouchBar(mainWindow);
  } */

});


// Load and Create MainWindow
function loadAppWindows(showLoader) {

  // Set path for main URL
  let appPath = c.settings.appUrl;

  // check shell
  if (Helper.usePhotonKitShell()) {
    appPath = `file://${__dirname}/src/shellMacOS.html`;
  } else if (Helper.useWindowsShell()) {
    appPath = `file://${__dirname}/src/shellWindows.html`;
  } else if (Helper.useLinuxShell()) {
    appPath = `file://${__dirname}/src/shellLinux.html`;
  }

  // create mainWindow
  mainWindow = new MainWindow(appPath, appIconPath, !showLoader);

  // minimize Listener
  mainWindow.on('minimize', function(event) {
      mainWindow.minimize();
  });

  // close to tray listener
  mainWindow.on('close', function (event) {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      event.returnValue = false;
    }
  });

  // show loader window only on first start
  if (showLoader) {
    spinnerWindow = new MainWindow(`file://${__dirname}/src/loader.html`, appIconPath);
    // hide loader when app is ready
    mainWindow.once('ready-to-show', function() {
      spinnerWindow.hide();
      spinnerWindow = null;
      mainWindow.show();
    });
  }

  // show offline-page if no connectivity
  mainWindow.webContents.on('did-fail-load', function(ev, errorCode, errorDesc, url) {
    offlineWindow = new MainWindow(`file://${__dirname}/src/offline.html`, appIconPath);
    mainWindow.hide();
  });
}


// Listen for events fired in the mainWindow UI
ipcMain.on('app:refresh', function(event) {

  // hide offline window if applicable
  if (offlineWindow && offlineWindow.isVisible()) {
    offlineWindow.hide();
  }

  offlineWindow = null;

  if (mainWindow) {
    // mainWindow is hidden, refresh and show it directly
    mainWindow.loadHome();
    mainWindow.show();
  } else {
    // instantiate mainWindow additionally
    mainWindow.loadHome();
    loadAppWindows(false);
  }

});

/* Sample Notification
if (Notification.isSupported()) {
  ipcMain.on('webview:notification', (event) => {
    const notification = new Notification({
      title: 'Message Title',
      // subtitle: 'Subtitle', // macOS only
      body: 'Body Of Message',
    });
    notification.show();
  });
} */

// Shell listeners
if (Helper.isUsingShell()) {
  const resize = function(width, height) {
    let bounds = mainWindow.getBounds();

    const diffWidth = (width - bounds.width);
    let newX = bounds.x - (diffWidth / 2);
    if (newX < 0) {
      newX = 0;
    }
    bounds.x = newX;
    bounds.height = height;
    bounds.width = width;

    mainWindow.setBounds(bounds, true);
  };

  ipcMain.on('titlebar:small_view', function(event) {
    resize(c.mainWindow.width, c.mainWindow.height);
  });
  ipcMain.on('titlebar:large_view', function(event) {
    resize(c.mainWindow.largeWidth, c.mainWindow.largeHeight);
  });
}

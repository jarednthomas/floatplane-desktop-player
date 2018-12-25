/*jshint esversion: 6 */
const path = require('path');
const electron = require('electron');
const { BrowserWindow, session, shell } = electron;
const Helper = require('./helper');
const c = require('./constants');

class MainWindow extends BrowserWindow {

  constructor(mainUrl, iconPath, show) {

    // create options object
    const options = {
      width: 1200,
      height: 800,
      title: c.settings.appName,
      icon: iconPath,
      titleBarStyle: c.settings.titleBarStyle,
      frame: c.settings.frame,
      show: (show === false ? false : true),
      center: true,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: c.settings.nodeIntegrationEnabled,
        preload: path.resolve(__dirname, '../src', 'ipcPreloader.js'),
      },
    };
    if (c.settings.windowBackgroundColor) {
      options.backgroundColor = c.settings.windowBackgroundColor;
    }

    // initalize BrowserWindow
    super(options);
    this.mainUrl = mainUrl;

    // Open new windows in default Browser
    this.webContents.on('new-window', function(e, url) {
      e.preventDefault();
      shell.openExternal(url);
    });

    // CSS Customization
    this.webContents.on('dom-ready', function() {

      // hide vertical scrollbar
      this.webContents.insertCSS('::-webkit-scrollbar { display: none !important;}');

      // make sidebar a draggable element and retain icon functionality
      this.webContents.insertCSS('div.sidebar { -webkit-app-region: drag !important;}');
      this.webContents.insertCSS('a.subscription-item { -webkit-app-region: no-drag !important;}');
      this.webContents.insertCSS('div.sidebar-header { -webkit-app-region: no-drag !important;}');

      // make topbars draggable and retain icon functionality
      this.webContents.insertCSS('div.topbar { -webkit-app-region: drag !important;}');
      this.webContents.insertCSS('div.nav-burger { -webkit-app-region: no-drag !important;}');
      this.webContents.insertCSS('div.logo-container { -webkit-app-region: no-drag !important;}');
      this.webContents.insertCSS('div.user-container { -webkit-app-region: no-drag !important;}');

    });

    // Load Floatplane Homepage url
    this.loadHome();
  }

  // add custom user agent postifx (e.g. for google analytics)
  loadCustomUrl(url) {
    var userAgentPostfix = c.settings.userAgentPostfixOSX;
    if (Helper.isWindows()) {
      userAgentPostfix = c.settings.userAgentPostfixWindows;
    } else if (Helper.isLinux()) {
      userAgentPostfix = c.settings.userAgentPostfixLinux;
    }

    this.loadURL(url, {
      userAgent: (session.defaultSession.getUserAgent()
        + ' ' + userAgentPostfix),
    });
  }

  loadRelativeUrl(url) {
    this.loadCustomUrl(this.mainUrl + url);
  }

  loadHome() {
    this.loadRelativeUrl('');
  }
}

module.exports = MainWindow;

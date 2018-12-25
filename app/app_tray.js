/*jshint esversion: 6 */
const electron = require('electron');
const { Tray, app, Menu } = electron;
const c = require('./constants');
const MainWindow = require('./main_window');

let sidebarCollapsed = false;

// Tray Icon
class AppTray extends Tray {

  constructor(iconPath, mainWindow) {
    super(iconPath);
    this.mainWindow = mainWindow;
    this.setToolTip(c.settings.appName);
    this.on('click', this.onClick.bind(this));
    this.on('right-click', this.onRightClick.bind(this));
  }

  // LeftClick
  onClick(event, bounds) {
    if (process.platform === 'darwin') {
      this.onRightClick();
    } else {
      this.restoreWindow();
    }
  }

  /// RightClick
  onRightClick() {
    
    //ContextMenu
    const menuConfig =[
      // Exit
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => app.quit()
      },
    ]

    // Show/Hide
    if (this.mainWindow.isMinimized() || this.mainWindow.isDestroyed() || !this.mainWindow.isVisible()) {
      menuConfig.unshift({
        label: 'Show',
        click: () => this.restoreWindow()
      });
    } else {
      menuConfig.unshift({
        label: 'Hide',
        accelerator: 'CmdOrCtrl+W',
        click: () => this.mainWindow.hide()
      });
    }

    // build/update ContextMenu
    this.popUpContextMenu(
      Menu.buildFromTemplate(menuConfig)
    );
  }

  // Restore from tray
  restoreWindow() {
    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore();
      this.mainWindow.show();
    } else if (!this.mainWindow.isVisible()) {
      this.mainWindow.show();
    }

    // bring it to the top
    this.mainWindow.focus();
  }

}

module.exports = AppTray;

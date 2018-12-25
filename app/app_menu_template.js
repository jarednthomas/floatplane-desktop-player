/*jshint esversion: 6 */
const electron = require('electron');
const { app } = electron;
const c = require('./constants');
const Helper = require('./helper');

// create menu template
const menuTemplate = function(mainWindow) {
  // Helper function for loading URLs
  const loadRelativeUrl = function(url) {
    if (Helper.isUsingShell()) {
      mainWindow.webContents.send(
          'shell:loadUrl',
          url
      );
    } else {
      mainWindow.loadRelativeUrl(url);
    }
  };

const template = [
  // View MenuEntry
  {
    label: 'View',
    submenu: [
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'},
      {type: 'separator'},
      {
        label:'Reload',
        accelerator: 'F5',
        role:'reload'
      },
    ]

  },
  // Window MenuEntry
  {
    label: c.menu.window.label,
    role: 'window',
    submenu: [

      // MinimizeButton
      {
        label: c.menu.window.minimize,
        role: 'minimize'
      },

      // Show/Hide
      {
        label: 'Hide',
        accelerator: 'CmdOrCtrl+H',
        role: 'close'
      }
    ]
  }
];


  template.push({


  });

  if (process.platform === 'darwin') {
    const name = c.settings.appName;
    template.unshift({
      label: name,
      submenu: [
        {
          label: c.menu.app.about + ' ' + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: name + ' ' + c.menu.app.hide,
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: c.menu.app.hideothers,
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        },
        {
          label: c.menu.app.unhide,
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: c.menu.app.quit,
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        },
      ]
    });

    const windowMenu = template.find(function(menu) {return menu.role === 'window'});

    if (windowMenu) {
      windowMenu.submenu.push(
        {
          type: 'separator'
        },
        {
          label: c.menu.window.front,
          role: 'front'
        }
      );
    }
  } else {
    // not OSX
    template.unshift({
      label: c.menu.file.label,
      submenu: [
        {
          // Settings MenuEntry
          label: "My Account",
          accelerator: 'CmdOrCtrl+A',
          click: function() { mainWindow.loadCustomUrl(c.settings.appUrlAccount); }

        },
        {
          // File MenuEntry
          label: c.menu.app.quit,
          accelerator: 'CmdOrCtrl+Q',
          click: function() { app.quit();}
        },
      ]
    });
  }

  // additional menu items for development
  if (c.settings.enableDevMenu) {
    template.push({
      label: 'Development',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'},
        {type: 'separator'},
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'},
      ]
    });
  }
  return template;
}

module.exports = menuTemplate;

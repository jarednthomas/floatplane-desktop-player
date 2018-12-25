/*jshint esversion: 6 */
const electron = require('electron');
const { Menu } = electron;
const menuTemplate = require('./app_menu_template');

function createMenu(mainWindow) {
  return Menu.buildFromTemplate(menuTemplate(mainWindow));
}

const setAppMenu = function (mainWindow) {
  Menu.setApplicationMenu(createMenu(mainWindow));
};

module.exports = setAppMenu;

/*jshint esversion: 6 */
const path = require('path');
const electron = require('electron');
const { TouchBar, nativeImage } = electron;
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;
const c = require('./constants');

// This feature will be implimented when I can get my hands on Mac for testing

// create TouchBar
const setTouchBar = function(mainWindow) {

    // create template
    const touchBarTemplate = [

        // macOS TouchBar Back Button
        new TouchBarButton({
            icon: nativeImage.createFromPath(path.join(__dirname, '../src', 'assets', 'touchbar_left.png')),
            click: () => {
                mainWindow.webContents.send(
                    'shell:navigate',
                    'back'
                );
            },
        }),

        // macOS TouchBar Forward Button
        new TouchBarButton({
            icon: nativeImage.createFromPath(path.join(__dirname, '../src', 'assets', 'touchbar_right.png')),
            click: () => {
                mainWindow.webContents.send(
                    'shell:navigate',
                    'forward'
                );
            },
        }),

        new TouchBarButton({
            icon: nativeImage.createFromPath(path.join(__dirname, '../src', 'assets', 'touchbar_send.png')),
            click: () => {
                mainWindow.webContents.send(
                    'shell:loadUrl',
                    '/kontakt'
                );
            },
        }),

        new TouchBarSpacer({size: 'flexible'}),

        new TouchBarButton({
            label: c.touchBar.car,
            backgroundColor: c.settings.themeColor,
            click: () => {
                mainWindow.webContents.send(
                    'shell:loadUrl',
                    '/'
                );
            },
        }),

        new TouchBarButton({
            label: c.touchBar.movables,
            backgroundColor: c.settings.themeColor,
            click: () => {
                mainWindow.webContents.send(
                    'shell:loadUrl',
                    '/mobilien-rechner'
                );
            },
        }),

        new TouchBarButton({
            label: c.touchBar.inquiry,
            backgroundColor: c.settings.themeColor,
            click: () => {
                mainWindow.webContents.send(
                    'shell:loadUrl',
                    '/angebot'
                );
            },
        }),
    ];

    // build touchbar from template
    const touchBar = new TouchBar(touchBarTemplate);

    // set touchbar on window
    mainWindow.setTouchBar(touchBar);
}

module.exports = setTouchBar;

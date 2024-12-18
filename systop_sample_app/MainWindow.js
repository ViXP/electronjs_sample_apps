const { BrowserWindow } = require("electron");

class MainWindow extends BrowserWindow {
  constructor(developer = false) {
    super({
      title: 'SysTop',
      width: developer ? 700 : 355,
      height: 500,
      icon: './assets/icons/icon.png',
      resizable: developer ? true : false,
      show: false,
      opacity: 0.8,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    if (developer) this.webContents.openDevTools();

    this.loadFile('./app/index.html');
  }
}

module.exports = MainWindow;

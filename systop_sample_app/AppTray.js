const { app, Menu, Tray } = require("electron");
const path = require("path");

class AppTray extends Tray {
  constructor(window) {
    super(path.join(__dirname, 'assets', 'icons', 'tray_icon.png'));
    this.setToolTip('SysTop');
    this.window = window;
    this._setEventListeners();
  }

  onClick() {
    if(this.window.isVisible()) {
      this.window.hide();
    } else {
      this.window.show();
    }
  }

  onRightClick() {
    const contextMenu = Menu.buildFromTemplate([{
      label: 'Quit',
      click: () => {
        app.isQuitting = true
        app.quit()
      }
    }])
    this.popUpContextMenu(contextMenu);
  }

  _setEventListeners() {
    this.on("click", this.onClick.bind(this));
    this.on("right-click", this.onRightClick.bind(this));
  }
}

module.exports = AppTray;

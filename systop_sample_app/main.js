const { app, Menu, ipcMain } = require('electron')
const log = require('electron-log')
const path = require('path');
const Store = require("./Store");
const MainWindow = require("./MainWindow");
const AppTray = require("./AppTray");

// Set env
process.env.NODE_ENV = 'production'

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin'

let mainWindow
let tray

const store = new Store({
  configName: "user_settings",
  defaults: {
    settings: {
      cpuOverload: 80,
      alertFrequency: 5
    }
  }
});


function createMainWindow() {
  mainWindow = new MainWindow(isDev);
}

const sendSettingsUpdates = () => {
  mainWindow.webContents.send("settings:get", store.get('settings'));
}

app.on('ready', () => {
  createMainWindow()

  mainWindow.webContents.on("dom-ready", sendSettingsUpdates);

  const mainMenu = Menu.buildFromTemplate(menu)

  mainWindow.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    } else {
      return true
    }
  });

  tray = new AppTray(mainWindow);
  Menu.setApplicationMenu(mainMenu)
})

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  {
    label: "View",
    submenu: [{
      label: "Toggle navigation",
      click: () => mainWindow.webContents.send("nav:toggle")
    }]
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
]

ipcMain.on("settings:send", (event, settings) => {
  store.set('settings', settings);
  sendSettingsUpdates();
});


app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.allowRendererProcessReuse = true

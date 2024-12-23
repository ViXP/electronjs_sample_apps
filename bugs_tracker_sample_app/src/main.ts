import { app, BrowserWindow, ipcMain, Menu } from 'electron';
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
import {
  REACT_DEVELOPER_TOOLS,
  default as installExtension
} from 'electron-devtools-installer';

import { connectDb } from "./db";
import Log from './models/Log';
import { LogItemType } from './types/LogItemType';

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

connectDb();

let mainWindow: BrowserWindow;
let isDev = true;
const isMac = process.platform === "darwin"

if (
	process.env.NODE_ENV === 'production'
) {
	isDev = false
}

const menu = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  {
    role: "fileMenu"
  },
  {
    role: "editMenu"
  },
  {
    label: "Logs",
    submenu: [
      {
        label: "Clear logs",
        click: logsClear
      }
    ]
  },
  ...(isDev ? [{
    label: "Developer",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { type: "separator" },
      { role: "toggleDevTools"}
    ]
  }] : [])
] as Array<Electron.MenuItemConstructorOptions>;


function createMainWindow(): void {
  mainWindow = new BrowserWindow({
		width: isDev ? 1300 : 1000,
		height: 800,
		show: false,
		icon: 'assets/icons/icon.png',
    resizable: isDev,
		webPreferences: {
			nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	})

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  
    // Open devtools if dev
    if (isDev) {
      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log('Error loading React DevTools: ', err)
      )
      mainWindow.webContents.openDevTools();
    }
  });
  mainWindow.on('closed', () => (mainWindow = null))
}


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
async function loadLogs() {
  try {
    console.log("Log fetching triggered");
    const logs = await Log.find().sort({ created: 1 });
    mainWindow.webContents.send("logs:loaded", JSON.stringify(logs))
  } catch (error) {
    console.error(error);
  }
}

async function logAdd(_event: unknown, item: LogItemType) {
  try {
    console.log("Log item adding triggered");
    await Log.create(item);
    loadLogs();
  } catch (error) {
    console.error(error);
  }
}

async function logRemove(_event: unknown, itemId: LogItemType["_id"]) {
  try {
    console.log("Log item removal triggered");
    await Log.findOneAndDelete({ _id: itemId });
    loadLogs();
  } catch (error) {
    console.error(error);
  }
}

async function logsClear() {
  try {
    console.log("All logs removal triggered");
    await Log.deleteMany();
    loadLogs();
  } catch (error) {
    console.error(error);
  }
}

app.on('ready', () => {
  app.applicationMenu = Menu.buildFromTemplate(menu);
  createMainWindow();
  ipcMain.on("logs:load", loadLogs);
  ipcMain.on("logs:add", logAdd);
  ipcMain.on("logs:remove", logRemove);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => { return });

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

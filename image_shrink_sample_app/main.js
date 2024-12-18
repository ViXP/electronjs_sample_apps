const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require("path");
const os = require("os");
const imagemin = require("imagemin");
const imageminMozJpeg = require("imagemin-mozjpeg");
const imageminPngQuant = require("imagemin-pngquant");
const slash = require("slash");
const log = require("electron-log/main");

let mainWindow;
let aboutWindow;

process.env.NODE_ENV = 'production';//process.env.NODE_ENV || 'development';

const isDev = process.env.NODE_ENV == 'development';
const isMac = process.platform == 'darwin';

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'ImageShrink',
    width: isDev ? 1000 : 600,
    height: 600,
    resizable: isDev,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    backgroundColor: '#dddddd',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(`${__dirname}/app/index.html`);
};

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: 'ImageShrink',
    width: 300,
    height: 300,
    resizable: false,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    backgroundColor: '#eeeeee'
  });

  aboutWindow.loadFile(`${__dirname}/app/about.html`);
}

const menuTemplate = [
  ...(isMac ? [{ label: app.name, submenu: [{ label: 'About', click: createAboutWindow }] }] : []),
  {
    label: 'File',
    submenu: [
      {
        role: 'close'
      }, {
        role: 'quit',
        label: 'Quit'
      }
    ]
  },
  ...(isDev ? [{
    label: 'Developer', submenu: [{
      role: 'reload'
    },
    { role: 'forcereload' },
    { type: 'separator' },
    {
      role: 'toggledevtools'
    }
    ]
  }] : [])
];

app.on('ready', () => {
  createMainWindow();

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
  mainWindow.on('close', () => mainWindow = null);
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.on('image:minimize', (event, { imgPath, quality }) => {
  const dest = path.join(os.homedir(), 'imageshrink');
  console.log(imgPath, quality, dest);
  shrinkImage({ imgPath, quality, dest });
});

async function shrinkImage({ imgPath, quality, dest }) {
  try {
    const pngQuality = quality / 100.0;
    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminMozJpeg({ quality }),
        imageminPngQuant({ quality: [pngQuality, pngQuality] })
      ]
    })
    log.info(files[0]);
    shell.openPath(dest);
    mainWindow.webContents.send('image:done');
  } catch (error) {
    log.error(error);
  }
}

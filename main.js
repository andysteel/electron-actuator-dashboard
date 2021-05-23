const { app, BrowserWindow, screen, Tray } = require('electron');
const path = require('path');
const url = require('url');
const { addAppEvent, disableAppEvent, enableAppEvent, findAllAppEvent,
  findAllInactiveAppEvent, updateAppEvent } = require('./backend/services/ApplicationService');
const unhandled = require('electron/common/');

let window = null

// Initialize remote module
require('@electron/remote/main').initialize()

const args = process.argv.slice(1)
const serve = args.some(val => val === '--serve')

const createWindow = () => {

  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  window = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    icon: path.resolve(__dirname, './dist/assets/icons', 'business-report-128.png'),
    darkTheme: false,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule : true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  if (serve) {

    window.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    window.loadURL('http://localhost:4200');

  } else {
    window.webContents.closeDevTools();
    window.webContents.disableDeviceEmulation();
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

    // Emitted when the window is closed.
    window.on('closed', () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      window = null;
    });

    //Application Events
    addAppEvent(serve);
    disableAppEvent(serve);
    enableAppEvent(serve);
    findAllAppEvent(serve);
    findAllInactiveAppEvent(serve);
    updateAppEvent(serve);

  return window;
}

const createTray = () => {
  const icon = path.resolve(__dirname, './dist/assets/icons', 'business-report-64.png');
  const tray = new Tray(icon);
  tray.setToolTip('Actuator Dashboard');
  return tray;
}

const App = () => {
  createWindow();
  createTray();
}

app.on('ready', App)

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit()
  }
  window = null
})

app.on('activate', () => {
  if(window === null) {
    createWindow()
  }
})

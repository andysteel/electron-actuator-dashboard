const { ipcMain } = require('electron');
const { addApplication, findAllActiveApplication, disableApplication,
  findAllInactiveApplication, enableApplication, updateApplication } = require('../models/Application');

module.exports = {
  //Application event operations
  addAppEvent(env) {
    ipcMain.on('add-app',async (event, app) => {
      try {
        await addApplication(app, env)
        event.returnValue = app
      } catch (err) {
        console.log(err);
        event.returnValue = err;
      }
    });
  },

  findAllAppEvent(env) {
    ipcMain.on('find-all-app', async (event) => {
      try {
        event.returnValue = await findAllActiveApplication(env);
      } catch(err) {
        console.log(err);
        event.returnValue = err;
      }
    });
  },

  disableAppEvent(env) {
    ipcMain.on('disable-app', async (event, app) => {
      try {
        await disableApplication(app.id, env);
        app.isActive = false;
        event.returnValue = app;
      } catch(err) {
        console.log(err);
        event.returnValue = err;
      }
    });
  },

  findAllInactiveAppEvent(env) {
    ipcMain.on('find-all-inactive-app', async (event) => {
      try {
        event.returnValue = await findAllInactiveApplication(env);
      } catch(err) {
        console.log(err);
        event.returnValue = err;
      }
    });
  },

  enableAppEvent(env) {
    ipcMain.on('enable-apps', async (event, apps) => {
      try {
        apps.forEach(async app => {
          await enableApplication(app.id, env);
        });

        event.returnValue = apps;
      } catch(err) {
        console.log(err);
        event.returnValue = err;
      }
    });
  },

  updateAppEvent(env) {
    ipcMain.on('update-app', async (event, app) => {
      try {
        await updateApplication(app, env);
        event.returnValue = app;
      } catch(err) {
        console.log(err);
        event.returnValue = err;
      }
    });
  }

}

'use strict'
import {
  app,
  protocol,
} from 'electron';
import srv from './api/server/';

const isDevelopment = process.env.NODE_ENV !== 'production';

async function quit() {
  await srv.close();
  app.quit();
}

app.on('window-all-closed', quit)

app.on('ready', async () => {
  srv.setup().then(() => {
    srv.project_open(null);
  });
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log('should quit');
  app.quit();
}

protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}]);
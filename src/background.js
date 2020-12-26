'use strict'
import {
  app,
} from 'electron';
import srv from './api/server/';
import  createProtocol from './api/server/protocol';

const isDevelopment = process.env.NODE_ENV !== 'production';

async function quit() {
  await srv.close();
  app.quit();
}

app.on('window-all-closed', quit)

app.on('ready', async () => {
  createProtocol('app');
  srv.setup(isDevelopment).then(() => {
    srv.project_open(0);
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
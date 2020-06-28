
import checker from './check'

const { ipcRenderer } = window.require('electron')

ipcRenderer.on('check', (_, proj_id, reason) => {
    checker.check(proj_id, reason);
});
ipcRenderer.on('build', (_, proj_id) => {
    console.log('build', proj_id)
});

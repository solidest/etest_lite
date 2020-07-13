
import check from './check'

const { ipcRenderer } = window.require('electron')

ipcRenderer.on('check', (_, proj_id, reason) => {
    check(proj_id, reason, true).then(res => {
        if(res) {
            return ipcRenderer.send('check-result', res.proj_id, res.version, res.results);
        }
    });
});
ipcRenderer.on('build', (_, proj_id) => {
    console.log('build', proj_id)
});


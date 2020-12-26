
const wins = require('./wins');


let _is_dev

function start_tick(is_dev)
{
    _is_dev = is_dev;
    setInterval(() => {
        let ws = wins.allwins();
        if(ws) {
            let keys = ws.keys();
            for (let k of keys) {
                if (k.win.webContents) {
                    k.win.webContents.send('tick_state', {
                        is_dev: _is_dev,
                    });
                }
            }
        }
    }, 1000);
}

module.exports = {
    start_tick,
}
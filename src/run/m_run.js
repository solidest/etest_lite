
import wins from '../feature/m_wins';
import load_proj from './wrapper/loader';
import db from './run_db';
import driver from './driver';

let player;
let db_path;

function setup_db(db_path) {
    db_path = db_path;
}

function setup_player(player) {
    player = player;
}

function _post_msg(catalog, kind, proj_id, case_id, value) {
    let win = wins.find(proj_id);
    if(win) {
        win.webContents.send('run-info', {catalog: catalog, kind: kind, proj_id: proj_id, case_id: case_id, value: value });
    }
    player.webContents.send('run-info', {catalog: catalog, kind: kind, proj_id: proj_id, case_id: case_id, value: value });
}

function proj_make(proj_id) {
    let proj = load_proj(proj_id);
    db.save_proj(db_path, proj);
    return proj;
}

async function run_case(info) {
    try {
        if(info.remake) {
            let proj = proj_make(info.proj_id);
            driver.setup(proj);
        }
        let token = await driver.run_case(info);
        _post_msg('system', 'run_begin', info.proj_id, info.id, {token: token});
    } catch (error) {
        _post_msg('system', 'error', info.proj_id, info.id, {message: error.message} );
    }
}

// driver.setup(_post_msg);

export default {
    setup_db,
    setup_player,
    proj_make,
    run_case,
    run_stop: driver.run_stop,
    run_reply: driver.reply,
    run_cmd: driver.run_cmd,
}
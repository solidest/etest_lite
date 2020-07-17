import wins from '../feature/m_wins';
import load_proj from './wrapper/loader';
import db from './run_db';
import runner from './runner';

let _player;

function setup_db(db_path) {
    db.setup(db_path);
}

function setup_player(player) {
    _player = player;
    runner.setup(_post_sys_msg, _post_out_msgs);
}

function _post_sys_msg(info, proj_id) {
    let win = wins.find(proj_id);
    if (win) {
        win.webContents.send('sys-info', info, proj_id);
    }
    _player.webContents.send('sys-info', info, proj_id);
}

function _post_out_msgs(msglist, proj_id, case_id) {
    let win = wins.find(proj_id);
    if (win) {
        win.webContents.send('run-info', msglist, proj_id, case_id);
    }
    _player.webContents.send('run-info', msglist, proj_id, case_id);
}

async function run_case(info) {
    try {
        if (info.remake) {
            let proj = load_proj(info.proj_id);
            db.save_proj(proj);
            runner.set_proj(proj);
        }
        return await runner.run_case(info.id, info.remake);
    } catch (error) {
        return {
            result: 'error',
            value: error.message
        }
    }
}

async function run_stop() {
    return await runner.run_stop();
}

function run_reply() {

}

function run_cmd() {

}

function save_db(cb) {
    db.save(cb);
}

export default {
    setup_db,
    save_db,
    setup_player,
    run_case,
    run_stop,
    run_reply,
    run_cmd,
}
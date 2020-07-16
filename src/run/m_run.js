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
    runner.setup(_post_msg);
}

function _post_msg(catalog, kind, proj_id, case_id, value) {
    let info = {
            catalog: catalog,
            kind: kind,
            proj_id: proj_id,
            case_id: case_id,
            value: value
        };
    let win = wins.find(proj_id);
    if (win) {
        win.webContents.send('run-info', info);
    }
    _player.webContents.send('run-info', info);
    console.log('post msg', info);
}


async function run_case(info) {
    // try {
        if (info.remake) {
            let proj = load_proj(info.proj_id);
            db.save_proj(proj);
            runner.set_proj(proj);
        } else {

        }
        runner.run_case(info.id, info.remake);
            // } catch (error) {
    //     console.log('error', error.message);
    //     _post_msg('system', 'error', info.proj_id, info.id, {
    //         message: error.message
    //     });
    // }
}

async function run_stop() {

}

async function run_reply() {

}

async function run_cmd() {

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
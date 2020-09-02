
const wins = require('../feature/m_wins');

function project_active(_, proj_id) {
    let win = wins.find(proj_id);
    if (win) {
        if (win.isMinimized()) {
            win.restore();
        }
        win.show();
        win.focus();
        return {
            result: 'ok',
            value: win.id,
        }
    }
    return {
        result: 'nil',
    };
}

function project_export(_, proj_id) {
    console.log('TODO EXPORT', proj_id);
    return {
        result: 'ok',
    };
}

function project_open_inwin(_, proj_id) {
    console.log('TODO OPEN_INWIN', proj_id);
    return {
        result: 'ok',
    };
}

module.exports = {
    project_active,
    project_export,
    project_open_inwin
}
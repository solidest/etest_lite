
import proj_db from './workerdb';
const VERSION = 1;

const _upgrade = {
    upgrade_1_2: function () {
        return;
    }
}

async function check_proj() {
    let ver = await proj_db.get('config', 'version');
    if(!ver) {
        proj_db.insert('config', {id: 'version', value: VERSION});
        return 'ok';
    }
    if(ver.value === VERSION) {
        return 'ok';
    }
    if(ver.value>VERSION) {
        return 'ETestDev版本过低，请升级';
    }
    let up_handle = _upgrade[`upgrade_${ver.value}_${VERSION}`];
    if(up_handle) {
        up_handle();
    } else {
        console.error('TODO upgrade');
    }
    return 'ok';
}

export default {
    VERSION,
    check_proj
}


import {
    sdk
} from '../../sdk/sdk';
import db from '../doc/workerdb';

async function _get_etlcode(id, name, memo) {
    let doc = await db.get('src', id);
    if (!doc || !doc.content) {
        return null;
    } else {
        if(doc.coding) {
            let asts = sdk.parser.parse_etl(doc.code);
            let content;
            switch (doc.kind) {
                case 'device':
                    content = sdk.converter.device_etl2dev(asts[0]).content;
                    break;
                case 'topology':
                    content = sdk.converter.topology_etl2dev(asts[0]).content;
                    break;
                case 'protocol':
                    content = sdk.converter.protocol_etl2dev(asts[0]).content;
                    break;
            }
            return (asts[0].kind === doc.kind && content) ? doc.code : null;
        } else {
            switch (doc.kind) {
                case 'device':
                    return sdk.converter.device_dev2etl(doc.content, name, memo);
                case 'topology':
                    return sdk.converter.topology_dev2etl(doc.content, name, memo);
            }
        }

    }
    return null;
}

function get_devobj(kind, code) {
    let ast = sdk.parser.parse_etl(code)[0];
    switch (kind) {
        case 'device':
            return sdk.converter.device_etl2dev(ast);
        case 'topology':
            return sdk.converter.topology_etl2dev(ast);
        case 'protocol':
            return sdk.converter.protocol_etl2dev(ast);
    }
    return null;
}

async function get_reused(id, kind, name, memo) {
    try {
        let code = await _get_etlcode(id, name, memo);
        if(!code) {
            throw new Error('复用失败');
        }
        let obj = get_devobj(kind, code);
        return obj ? {
            kind,
            name,
            memo,
            code,
        } : null;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

function valid_code(code, kind) {
    if(!code || !kind) {
        return false;
    }
    let ast = sdk.parser.parse_etl(code)[0];
    return ast.kind === kind;
}


export default {
    get_reused,
    get_devobj,
    valid_code,
}
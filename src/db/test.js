
const db01 = require('./db01');
const { assert } = require('console');

async function test_open_db01() {
    let db = await db01.open('d:/demo/');
    assert(db);
}

test_open_db01();

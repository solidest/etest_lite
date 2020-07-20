
let now;
let oneDay = 24 * 3600 * 1000;
let value;

function randomData1() {
    now = new Date(+now + oneDay);
    value = value + Math.random() * 21 - 10;
    return {
        name: now.toString(),
        value: [
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
            Math.round(value)
        ]
    };
}

function randomData2() {
    let data = [];
    let value1 = Math.floor(Math.random() *100);
    let value2 = Math.floor(Math.random() *100);
    for (var i = 0; i < 100; i++) {
        data.push([value1 + Math.random() * 21 - 10, value2 + Math.random() * 21 - 10]);
    }
    return data;
}

function create_data(se) {
    if(se.type === 'scatter') {
        return randomData2();
    }
    value = Math.random() * 1000;
    now = 875808000000;
    var data = [];
    for (var i = 0; i < 100; i++) {
        data.push(randomData1());
    }
    // console.log('data', data)
    return data;
}

export default { create_data };
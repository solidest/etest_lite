

const net = window.require('net');

function test_tcpsrv(ip, port, cb) {
    var client = new net.Socket();
    client.setTimeout(500);
    client.connect(port, ip, function() {
        cb('ok');
        client.destroy();
    });

    client.on('error', function() {
        cb('error');
    });

    client.on('end', function() {
        cb('end');
    });

    client.on('timeout', function() {
        cb('timeout');
    });
}


export default test_tcpsrv;
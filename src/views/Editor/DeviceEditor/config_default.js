const default_dio = {
    maxu: 5
};
const default_aio = {
    ratio: 16

};
const default_serial = {
    baudrate: 115200,
    bytesize: 8,
    parity: 'none',
    stopbits: 1,
    flowcontrol: 'none'
}

export default {
    di: default_dio,
    do: default_dio,
    ai: default_aio,
    da: default_aio,
    udp: {
        ip: '0.0.0.0',
        port: 0,
        ttl: 0,
        reuseaddr: true
    },
    tcp_client: {
        ip: '0.0.0.0',
        port: 0,
        keepalive: true,
        nodelay: true,
        autoconnect: true
    },
    tcp_server: {
        ip: '0.0.0.0',
        port: 8080,
        keepalive: true,
        nodelay: true,
        acceptany: false
    },
    serial_232: default_serial,
    serial_422: default_serial,
    serial_485: default_serial,
    serial_ttl: default_serial,
    can: {
        
    }
}
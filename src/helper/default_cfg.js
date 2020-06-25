const cfg = { 
    ad: {ratio: 16},
    da: {ratio: 16},
    udp: { ip: '0.0.0.0', reuseaddr: true },
    tcp_client: { ip: '0.0.0.0', keepalive: true, nodelay: false, autoconnect: true },
    tcp_server: { ip: '0.0.0.0', port: 8080, keepalive: true, nodelay: true, acceptany: false},
    serial_232: { baudrate: 115200, bytesize: 8, parity: 'none', stopbits: 1, flowcontrol: 'none' },
    serial_422: { baudrate: 115200, bytesize: 8, parity: 'none', stopbits: 1, flowcontrol: 'none' },
    serial_485: { baudrate: 115200, bytesize: 8, parity: 'none', stopbits: 1, flowcontrol: 'none' },
    serial_ttl: { baudrate: 115200, bytesize: 8, parity: 'none', stopbits: 1, flowcontrol: 'none' },
}
export default cfg
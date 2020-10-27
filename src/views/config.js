
let intf_alias = {
  di: 'DI',
  do: 'DO',
  ai: 'AI',
  ao: 'AO',
  serial_232: '232',
  serial_422: '422',
  serial_485: '485',
  serial_ttl: 'UART',
  can: 'CAN',
  udp: 'UDP',
  tcp_client: 'TCPC',
  tcp_server: 'TCPS',
}

const cfg = {
    version_map: {
      '0.1.13': '2020.07',
      '1.0.1': '2020.12'
    },
    proj_colls: ['src', 'panel', 'config'],
    intf_alias,
}
export default cfg
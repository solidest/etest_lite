const checker = {
    ai: {
        allow_links: ['ao'],
        should_source: 'ao',
    },
    ao: {
        allow_links: ['ai'],
        should_target: 'ai',
    },
    di: {
        allow_links: ['do'],
        should_source: 'do',
    },
    do: {
        allow_links: ['di'],
        should_target: 'di',
    },
    udp: {
        allow_links: ['udp'],
        allow_bus(conns) {
            if(!conns) {
                return true;
            }
            for (const c of conns) {
                if(c!=='udp') {
                    return false;
                }
            }
            return true;
        }
    },
    tcp_client: {
        allow_links: ['tcp_server'],
        allow_bus(conns) {
            if(!conns) {
                return true;
            }
            for (const c of conns) {
                if(!(['tcp_client', 'tcp_server'].includes(c))) {
                    return false;
                }
            }
            return true;
        }
    },
    tcp_server: {
        allow_links: ['tcp_client'],
        allow_bus(conns) {
            if(!conns) {
                return true;
            }
            for (const c of conns) {
                if(!(['tcp_client', 'tcp_server'].includes(c))) {
                    return false;
                }
            }
            return true;
        }
    },
    serial_232: {
        allow_links: ['serial_232']
    },
    serial_422: {
        allow_links: ['serial_422'],
        allow_bus(conns) {
            if(!conns) {
                return true;
            }
            for (const c of conns) {
                if(!['serial_422'].includes(c)) {
                    return false;
                }
            }
            return true;
        }
    },
    serial_485: {
        allow_links: ['serial_485'],
        allow_bus(conns) {
            if(!conns) {
                return true;
            }
            for (const c of conns) {
                if(!['serial_485'].includes(c)) {
                    return false;
                }
            }
            return true;
        }
    },
    serial_ttl: {
        allow_links: ['serial_ttl']
    },
    can: {
        allow_links: ['can'],
        allow_bus(conns) {
            if(!conns) {
                return true;
            }
            for (const c of conns) {
                if(!['can'].includes(c)) {
                    return false;
                }
            }
            return true;
        }
    },
}

export default {
    allow_link(from, to) {
        return checker[from].allow_links.includes(to);
    },
    allow_bus(from, tos) {
        let allow_bus = checker[from].allow_bus;
        if(allow_bus) {
            return allow_bus(tos);
        }
        return false;
    },
    calc_arrow(from, to) {
        if(checker[from].should_source) {
            return to === checker[from].should_source ? -1 : 0;
        }
        if(checker[from].should_target) {
            return to === checker[from].should_target ? 1 : 0;
        }
        return 0;
    }
}
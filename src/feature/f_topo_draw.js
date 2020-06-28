
let draw_line_style = {
    type: 'quadratic',
    style: {
        stroke: '#757575',
    },
    labelCfg: {
        autoRotate: true,
        style: {
            fill: "#FAFAFA",
            fontSize: 18,
        }
    }
}

// 需绘制的设备节点
function _get_draw_nodes(devs, mapping) {
    if (!mapping) {
        return [];
    }
    let nodes = [];
    for (let map of mapping) {
        if (map.used === 'uut') {
            nodes.push({
                id: map.dev_id,
                label: devs.find(it => it.id === map.dev_id).name,
                size: 100,
                style: {
                    fill: '#757575',
                    stroke: '#E0E0E0',
                    lineWidth: 3,
                },
                labelCfg: {
                    style: {
                        fill: '#FAFAFA',
                        fontSize: 20,
                    },
                },
            });
        } else if (map.used === 'etest') {
            nodes.push({
                id: map.dev_id,
                label: devs.find(it => it.id === map.dev_id).name,
                size: 100,
                style: {
                    fill: "#81D4FA",
                    lineWidth: 3
                },
                labelCfg: {
                    style: {
                        fill: "#000000",
                        fontSize: 20,
                    }
                }
            });
        }
    }
    return nodes;
}

// 需绘制的接口对象
function _find_draw_connector(conns, nodes, conn_id) {
    let index = conns.findIndex(it => it.id === conn_id);
    if (isNaN(index)||index<0) {
        return null;
    }
    let find = conns[index];
    let node = nodes.find(it => it.id === find.dev_obj.id);
    if (!node) {
        return null;
    }
    return {
        index: index,
        dev_id: node.id,
        conn_id: conn_id,
        conn_name: find.conn_obj.name,
        full_name: `${find.dev_obj.name}.${find.conn_obj.name}`
    }
}

// 点到点连线
function _get_peer_line(conns, nodes, twoconns) {
    let source = _find_draw_connector(conns, nodes, twoconns[0]);
    let target = _find_draw_connector(conns, nodes, twoconns[1]);
    if (source && target) {
        if(source.index>target.index) {
            let _ = source;
            source = target;
            target = _;
        }
        let name = source.conn_name;
        if (target.conn_name !== name) {
            name = name + ' :: ' + target.conn_name;
        }
        let res = {
            source: source.dev_id,
            target: target.dev_id,
            label: name,
        };
        if(res.source === res.target) {
            res.type = 'loop';
        }
        return res;
    }
    return null;
}

// 总线连线
function _get_bus_lines(bus_id, conns, nodes, multiconns) {
    let draw_conns = [];
    for(let cid of multiconns) {
        let c = _find_draw_connector(conns, nodes, cid);
        if(!c) {
            continue;
        }
        draw_conns.push(c);
    }
    if(draw_conns.length<2) {
        return null;
    }
    if(draw_conns.length==2) {
        return _get_peer_line(conns, nodes, draw_conns.map(it=>it.conn_id))
    }
    nodes.push({
        id: bus_id,
        size: 30,
        style: {
            fill: '#1E1E1E',
            stroke: '#757575',
            lineWidth: 2,
        },
    });
    let res = [];
    draw_conns.forEach(conn => {
        res.push({
            source: conn.dev_id,
            target: bus_id,
            label: conn.conn_name,
        })
    });
    return res;
}

// 所有需绘制的边
function _get_draw_lines(conns, linking, nodes) {
    if (!linking || !nodes || nodes.length === 0) {
        return;
    }
    let res = [];
    for (let link of linking) {
        if (!link.conns || link.conns.length <= 1) {
            continue;
        }
        if (link.conns.length === 2) {
            let e = _get_peer_line(conns, nodes, link.conns);
            if (e) {
                res.push(e);
            }
        } else if (link.conns.length > 2) {
            let es = _get_bus_lines(link.id, conns, nodes, link.conns);
            if (es && es.length > 0) {
                res.push(...es);
            }
        }
    }
    return res;
}

function _set_multi_lines(edges, offsetDiff = 50) {
    const edgeMap = {};
    edges.forEach(edge => {
        const {
            source,
            target
        } = edge;
        let sourceTarget = `${source}-${target}`;
        if (source > target) sourceTarget = `${source}-${target}`;

        if (!edgeMap[sourceTarget]) {
            edgeMap[sourceTarget] = []
        }
        edgeMap[sourceTarget].push(edge);
    });


    for (const key in edgeMap) {
        const arcEdges = edgeMap[key];
        const {
            length
        } = arcEdges;
        for (let k = 0; k < length; k++) {
            const current = arcEdges[k];
            const sign = k % 2 === 0 ? 1 : -1;
            if (length % 2 === 1) {
                current.curveOffset = sign * Math.ceil(k / 2) * offsetDiff;
            } else {
                current.curveOffset = sign * (Math.floor((k) / 2) * offsetDiff + offsetDiff / 2);
            }
            delete current.groupById;
        }
    }
    return edges;
}

function get_draw_data(devs, conns, mapping, linking) {
    // console.log(binding ? binding.length : 'null');
    let nodes = _get_draw_nodes(devs, mapping);
    let lines = _get_draw_lines(conns, linking, nodes);
    if(lines) {
        lines = _set_multi_lines(lines);
    }
    // console.log('nodes', nodes)
    // console.log('lines', lines)
    return {
        nodes: nodes,
        edges: lines,
    }
}

export default {
    get_draw_data,
    draw_line_style,
}
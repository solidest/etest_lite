let cfg = {
    device: {
        default: {
            content: [],
            code: '',
            coding: false
        },
        code_editor: 'e-etl-editor',
        visual_editor: 'e-device-editor',
    },
    topology: {
        default: {
            content: {
                devs: [],
                buses: [],
                bus_links: [],
                pp_links: [],
                binds: []
            },
            code: '',
            coding: false
        },
        code_editor: 'e-etl-editor',
        visual_editor: 'e-topology-editor',
    },
    protocol: {
        default: {
            content: {
               
            },
            code: "// 此代码由ETestDev自动生成\n// 请勿修改协议名称\n\nprotocol %name%\n{\n\
    segment header { parser: 'uint8', autovalue: 0x55AA }\n\
    segment data { parser: 'uint64', autovalue: 0 }\n\
    segment tail { parser: 'uint8', autovalue: 0 }\n}",
            coding: true
        },
        code_editor: 'e-etl-editor',
        visual_editor: 'e-protocol-editor',
    }
}

export default cfg;
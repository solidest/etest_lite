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
    }
}

export default cfg;
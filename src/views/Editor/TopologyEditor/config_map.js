

import mcfg from '../../config';
const intf_alias = mcfg.intf_alias;

const dev_kinds = {
    none: {
        css: 'grey--text text--darken-2',
        color: 'grey darken-2',
        icon: 'mdi-checkbox-blank-circle-outline',
        css_title: '',
    },
    etest: {
        css: 'blue--text text--lighten-3',
        color: 'blue lighten-3',
        icon: 'mdi-checkbox-marked-circle',
        css_title: 'blue darken-3 white--text py-2',
    },
    uut: {
        css: 'brown--text text--lighten-3',
        color: 'brown lighten-3',
        icon: 'mdi-checkbox-blank-circle',
        css_title: 'grey darken-3 white--text py-2',
    },
    simu: {
        css: 'orange--text text--darken-4',
        color: 'orange darken-4',
        icon: 'mdi-checkbox-marked-circle',
        css_title: 'orange darken-4 white--text py-2',
    },
}

export default {
    map_default: {
        DEFAULT_ITEM_HEIGHT: 48,
        DEFAULT_BUS_SIZE: 160,
        DEFAULT_CANVASE_WIDTH: 1000,
        DEFAULT_SPACE: 30,
        DEFAULT_WIDTH: 260,
        DEFAULT_ITEMS_OTHERHEIGHT: 48+6,
        DEFAULT_ITEMS_MAXCOUNT: 10,
    },
    intf_alias,
    dev_kinds,
}
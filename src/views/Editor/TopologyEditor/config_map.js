const DEFAULT_WIDTH = 260;
const BUS_WIDTH = 30;
const BUS_HEIGHT = 300;
const CANVASE_WIDTH = 1000;
const SPACE = 30;
const ITEM_HEIGHT = 46;
const ITEM_MAX_COUNT = 10;
const ITEM_VSPACE = 8;
const ITEM_DEVTITLE_HEIGHT = 48;

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
    map_config: {
        DEFAULT_WIDTH,
        BUS_WIDTH,
        BUS_HEIGHT,
        CANVASE_WIDTH,
        SPACE,
        ITEM_HEIGHT,
        ITEM_MAX_COUNT,
        ITEM_VSPACE,
        ITEM_DEVTITLE_HEIGHT,
        MAX_ITEMS_HEIGHT: ITEM_HEIGHT*ITEM_MAX_COUNT+2*ITEM_VSPACE,
        MAX_HEIGHT: ITEM_HEIGHT*ITEM_MAX_COUNT+2*ITEM_VSPACE+ITEM_DEVTITLE_HEIGHT,
    },
    intf_alias,
    dev_kinds,
}
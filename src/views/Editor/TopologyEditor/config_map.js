
const DEFAULT_WIDTH = 300;
const BUS_WIDTH = 30;
const BUS_HEIGHT = 300;
const CANVASE_WIDTH = 1000;
const SPACE = 30;
const ITEM_HEIGHT = 46;
const MAX_ITEMS = 10;

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
        ITEM_HEIGHT,
        ITEMS_MAX_HEIGHT: MAX_ITEMS*ITEM_HEIGHT,
        MAX_HEIGHT: (MAX_ITEMS+1)*ITEM_HEIGHT,
        BUS_WIDTH,
        BUS_HEIGHT,
        CANVASE_WIDTH,
        SPACE,
        MAX_ITEMS,
    },
    intf_alias,
    dev_kinds,
}
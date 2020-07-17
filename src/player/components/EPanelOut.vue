<template>
    <e-panel :layout="layout" :cfg="cfg" :show_line="show_line" :design="false"
        :recorder="recorder" :commander="commander">
    </e-panel>
</template>
<script>

import run from '../../run/run_r';
import EPanel from '../../components/panel/EPanel'
import cfg from '../../helper/cfg_panel';

export default {
    components: {
        'e-panel': EPanel,
    },

    mounted: function() {
        this.commander = this.$store.state.panel.commander || {};
        this.recorder = this.$store.state.panel.recorder || {};
        run.set_outs(this.outs);
    },

    data: () => {
        return {
            commander: {},
            recorder: {},
            outs: [],
            cfg: cfg,
            idx: 0,
            rcds: [],
        }
    },
    
    computed: {
        layout: function() {
            return this.$store.state.panel.layout;
        },
        show_line: function() {
            return this.$store.state.panel.show_line;
        },
    },

    watch: {
        outs: function(vs) {
            if(this.idx>=vs.length) {
                return;
            }
            let rcd = {};
            for(; this.idx<vs.length; this.idx++) {
                let item = vs[this.idx];
                if(item.catalog === 'record') {
                    this.rcds.push(item);
                    for(let k in item.value) {
                        rcd[k] = item.value[k];
                    }
                }
            }
            this.recorder = rcd;
        }
    }
}
</script>~
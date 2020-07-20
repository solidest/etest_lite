<template>
    <e-panel :layout="layout" :cfg="cfg" :show_line="show_line" :design="false"
        :recorder="recorder" :recorders="recorders" :commander="commander">
    </e-panel>
</template>
<script>

import run from '../../run/run_render';
import EPanel from '../../components/panel/EPanel'
import cfg from '../../helper/cfg_panel';

export default {
    components: {
        'e-panel': EPanel,
    },

    mounted: function() {
        this.commander = this.$store.state.panel.commander || {};
        this.recorder = this.$store.state.panel.recorder || {};
        this.start_read_out();
    },
    beforeDestroy: function() {
        if(this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },

    data: () => {
        return {
            commander: {},
            recorder: {},
            recorders: {},
            outs: [],
            cfg: cfg,
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

    methods: {
        start_read_out: function () {
            this.last_time = -1;
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            let self = this;
            let ids = this.$store.state.play_ids;
            this.timer = setInterval(async () => {
                await self.read_out(ids.proj_id, ids.case_id);
            }, 40);
        },

        read_out: async function (proj_id, case_id) {
            if (this.reading) {
                return;
            }
            this.reading = true;
            let info = {
                proj_id: proj_id,
                case_id: case_id,
                limit: 1000,
                begin_time: this.last_time,
                kinds: {
                    recorder: true,
                    recorders: true,
                }
            }
            let res = await run.get_outs(info);
            this.reading = false;
            if (res) {
                this.last_time = res.$time;
                if(res.recorder) {
                    this.recorder = res.recorder;
                }
                if(res.recorders) {
                    this.recorders = res.recorders;
                }
                if(res.is_stop) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            }
        },
    }


}
</script>~
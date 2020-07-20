<template>
    <v-sheet class="outs ma-0 pa-0" width="100%" style="height: calc(100vh - 32px);" tile>
        <e-outs :outs="outs" />
    </v-sheet>
</template>
<script>
    import run from '../../run/run_render';
    import EOuts from '../../components/EConsoleOuts'

    export default {
        components: {
            'e-outs': EOuts,
        },
        mounted: function() {
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
                outs: []
            }
        },

        methods: {
            start_read_out: function () {
                this.outs.length = 0;
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
                        console: true
                    }
                }
                let res = await run.get_outs(info);
                this.reading = false;
                if (res) {
                    if (res.console && res.console.length > 0) {
                        this.last_time = res.console[res.console.length - 1].$time;
                        this.outs.push(...res.console);
                        let dc = this.outs.length - 1000;
                        if (dc > 0) {
                            this.outs.splice(0, dc);
                        }
                    }
                    if (res.is_stop) {
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                }
            },
        }

    }
</script>~
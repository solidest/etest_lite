<template>
    <div :style="{height: '100%' , width: '100%', 'overflow-y':'scroll' } " id="out_div">
        <div v-for="(item, idx) in outs_" :key="idx" style=" width: 100%" class="px-2">
            <v-tooltip v-if="item.tip" right open-delay="500">
                <template v-slot:activator="{ on }">
                    <v-icon class="pa-0 pb-1 ma-0" small v-on="on" color="grey"
                        style="display:inline-block; cursor:pointer;">
                        mdi-record
                    </v-icon>
                </template>
                <span>{{item.tip}}</span>
            </v-tooltip>
            <v-icon v-else-if="item.kind!=='print'" class="pa-0 pb-1 ma-0" small color="grey"
                style="display:inline-block;">
                mdi-information-variant
            </v-icon>
            <v-icon v-else class="pa-0 pb-1 ma-0" small color="grey"
                style="display:inline-block;">
                mdi-greater-than
            </v-icon>
            <span :class="get_css(item)">
                {{get_text(item)}}
            </span>
        </div>
    </div>
</template>
<style scoped>
    ::-webkit-scrollbar {
        display: block;
        width: 10px;
        height: 1px;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        border-radius: 10px;
        background: #EDEDED;
    }

    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #535353;
    }
</style>
<script>
    import f_outs from '../feature/f_outs';

    export default {
        props: ['outs', 'height', 'debug'],
        computed: {
            outs__: function() {
                let res = [];
                let idx = this.outs.length - 500;
                if(idx<0) {
                    idx = 0;
                }
                for(;idx<this.outs.length; idx++) {
                    let item = this.outs[idx];
                    if (item.catalog === 'log') {
                        res.push(item);
                    } else if(item.catalog === 'system' && ['error','assertFail','verifyFail','print'].includes(item.kind)) {
                        res.push(item);
                    }
                }
                return res;
            },
            outs_: function () {
                if(!this.debug) {
                    return this.outs__;
                }
                let res = [];
                let rcds = [];
                let idx = this.outs.length - 500;
                if(idx<0) {
                    idx = 0;
                }
                for(;idx<this.outs.length; idx++) {
                    let item = this.outs[idx];
                    if (item.catalog !== 'record') {
                        if (rcds.length > 0) {
                            this.push_rcds(res, rcds);
                            rcds = [];
                        }
                        res.push(item);
                    } else {
                        rcds.push(item);
                    }
                }
                if (rcds.length > 0) {
                    this.push_rcds(res, rcds);
                }
                return res;
            }
        },
        watch: {
            outs_: function () {
                this.$nextTick(() => {
                    let div = document.getElementById('out_div');
                    div.scrollTop = div.scrollHeight;
                })
            }
        },
        methods: {
            get_css: function (item) {
                let res = f_outs.parse_kind(item);
                if (res.is_debug) {
                    return 'grey--text';
                }

                let text = 'grey--text';
                let deep = ' text--lighten-5';

                if (res.is_error) {
                    text = 'error--text';
                } else if (res.is_warn) {
                    text = 'warning--text';
                } else if (res.is_success) {
                    text = 'success--text';
                }
                if (res.is_system || (res.is_log && !res.is_log_normal)) {
                    deep = '';
                }
                return text + deep;
            },
            get_text: function (item) {
                return f_outs.parse_text(item);
            },
            push_rcds(outs, items) {
                let res = {
                    catalog: 'system',
                    kind: 'debug',
                    value: {
                        message: `生成记录${items.length}条`
                    },
                    tip: f_outs.rcds_tip(items),
                };
                outs.push(res);
            }
        }
    }
</script>
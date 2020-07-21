<template>
    <div :style="{height: '100%' , width: '100%', 'overflow-y':'scroll' } " id="out_div">
        <div v-for="(item, idx) in outs" :key="idx" style=" width: 100%" class="px-2">
            <v-tooltip v-if="item.tip" right open-delay="500">
                <template v-slot:activator="{ on }">
                    <v-icon class="pa-0 pb-1 ma-0" small v-on="on" color="grey"
                        style="display:inline-block; cursor:pointer;">
                        mdi-record
                    </v-icon>
                </template>
                <span>{{item.tip}}</span>
            </v-tooltip>
            <v-icon v-else-if="item.tag.is_console||item.tag.is_ask" class="pa-0 pb-1 ma-0" small color="grey"
                style="display:inline-block;">
                mdi-greater-than
            </v-icon>
            <v-icon v-else class="pa-0 pb-1 ma-0" small color="grey"
                style="display:inline-block;">
                mdi-information-variant
            </v-icon>
            
            <span :class="get_css(item)">
                <!-- {{`${item.time} ${item.text}`}} -->
                {{item.text}}
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
    export default {
        props: ['outs', 'height'],
        watch: {
            outs: function () {
                this.$nextTick(() => {
                    let div = document.getElementById('out_div');
                    div.scrollTop = div.scrollHeight;
                });
            }
        },
        methods: {
            get_css: function (item) {
                let tag = item.tag;
                if (tag.is_error) {
                    return 'error--text';
                } else if (tag.is_warn) {
                    return 'warning--text';
                } else if (tag.is_success) {
                    return 'success--text';
                } else if(tag.is_print || tag.is_log) {
                    return 'grey--text text--lighten-5';
                }
                return 'grey--text';
            },
        }
    }
</script>
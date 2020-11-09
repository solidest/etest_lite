<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-row align="center" justify="center">
            <div>
                <v-row class="mb-6" justify="center">
                    <img alt="ETestDev" src="../../../assets/logo.svg" style="display: block;">
                </v-row>
                <v-row class="mb-6 grey--text" justify="center">
                    <span>“仿真模型” 为ETestDev专业版中的功能</span>
                </v-row>
                <v-row class="mb-6 grey--text" justify="center">
                    <span>可以在测试环境中运行数字模型进行仿真实验</span>
                </v-row>
            </div>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        mounted: function () {
            this.$emit('active', this._get_ieditor());
        },
        _get_ieditor() {
            let self = this;
            return {
                right_tools:[],
                left_tools: [],
                get_state: () => {
                    return {};
                },
                do_action: (ac) => {
                    let fn = self[`action_${ac}`];
                    if (fn) {
                        return fn();
                    } else {
                        console.log('TODO', ac)
                    }
                }
            }
        },
    }
</script>
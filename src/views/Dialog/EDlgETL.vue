<template>
    <v-dialog :value="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dense color="primary">
                <v-toolbar-title class="mr-4">{{`{ ${title} }`}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-toolbar-title class="yellow--text pt-2 pr-4">{{error_tip}}</v-toolbar-title >
                    <v-btn icon @click="onCancel">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-btn icon @click="onOk">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <div style="height: calc(100vh - 60px); width: 100%" class="pa-0 ma-0">
                <e-etl-editor :script="code" @change="on_change" />
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
    import {sdk} from '../../../sdk/sdk'
    import ETLScriptEditor from '../Components/ETLScriptEditor'
    export default {
        props: ['etl_code', 'dialog', 'title', 'kind'],
        components: {
            'e-etl-editor': ETLScriptEditor,
        },
        mounted: function() {
            this.code = this.etl_code;
        },
        data: () => {
            return {
                code: '',
                error_tip: ''
            }
        },
        watch: {
            dialog: function (d) {
                if (d) {
                    this.code = this.etl_code;
                }
            }
        },
        methods: {
            on_change: function (code) {
                this.code = code;
                let self = this;
                setTimeout(() => {
                    self.error_tip = '';
                }, 1000);
            },
            onCancel: function () {
                this.$emit("result", {
                    result: 'cancel'
                });
            },
            onOk: function () {
                try {
                    let ast = sdk.parser.parse_etl(this.code);
                    if(!ast || ast.length!==1 || ast[0].kind !==this.kind) {
                        throw new Error('ETL代码错误');
                    }
                    this.$emit("result", {
                        result: 'ok',
                        value: ast[0],
                    });
                } catch (error) {
                    this.error_tip = error.message;
                }
            }
        }
    }
</script>
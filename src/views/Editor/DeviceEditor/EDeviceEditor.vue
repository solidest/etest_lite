<template>
    <div class="d-flex">
        <div :style="{height:`calc(100vh - ${top_height}px)`, width: '100%', 'overflow-y': 'auto'}">
            <v-data-table :headers="headers" :items="items" no-data-text="空" disable-sort hide-default-footer
                disable-pagination>
                <!-- <template v-slot:top>
                <v-text-field dense v-model="content.memo" placeholder="设备说明" label="说明" class="px-4 pt-4 pb-1" outlined
                    hide-details @change="save_doc">
                </v-text-field>
            </template>
            <template v-slot:item="{item}">
                <tr>
                    <td @click.stop="current_row=item" class="mt-0">
                        <v-icon small class="pt-0" :color="item===current_row?'primary':''" style="cursor:pointer;">
                            {{item===current_row?'mdi-radiobox-marked':'mdi-radiobox-blank'}}
                        </v-icon>
                    </td>
                    <td>
                        <v-chip class="ma-1" @click.stop="current_row=item">
                            {{item.kind}}
                        </v-chip>
                        <v-tooltip v-if="error_obj[item.id]" right color='red lighten-1'>
                            <template v-slot:activator="{ on }">
                                <v-icon color="red lighten-1" v-on="on">mdi-alert</v-icon>
                            </template>
                            <span>{{errtip_fmt(error_obj[item.id])}}</span>
                        </v-tooltip>
                    </td>
                    <td>
                        <e-editor-dlg :text="item.name" :memo="item.memo" :data="{name: item.name, memo: item.memo}"
                            :id="item.id" :widgets="cfg.name_widgets" @save="on_edited_name_memo" @_click="current_row=item"
                            :hide_name="true">
                        </e-editor-dlg>
                    </td>
                    <td>
                        <e-editor-dlg :text="obj_fmt(item.config)" :data="item.config" :id="item.id"
                            :widgets="cfg.intf_widgets[item.kind]" :title="`${title}.${item.name}`" @save="on_edited_cfg"
                            @_click="current_row=item">
                        </e-editor-dlg>
                    </td>
                </tr>
            </template> -->
            </v-data-table>
        </div>
        <e-vertical-bar :width="prop_width" :min="200" :max="800" :right="true" @resize="on_resize" />
        <div :style="{width: `${prop_width}px`}" class="d-flex align-stretch">

        </div>
    </div>
</template>

<script>
    import cfg from './config';
    import EVerticalBar from '../../Utility/EVerticalBar';

    export default {
        props: ['top_height'],
        components: {
            'e-vertical-bar': EVerticalBar,
        },
        mounted: function () {
            this.$emit('active', this.get_eidtor_iterface());
        },
        data() {
            return {
                headers: [],
                items: [],
            }
        },
        computed: {
            active: function () {
                return this.$store.state.Editor.active;
            },
            prop_width: {
                get: function() {
                    return this.$store.state.Device.prop_width;
                },
                set: function (v) {
                    this.$store.commit('Device/set_prop_width', v);
                }
            }
        },
        watch: {
            active: function() {
                this.$emit('active', this.get_eidtor_iterface());
            }
        },
        methods: {
            get_eidtor_iterface() {
                return {
                    right_tools: cfg.right_tools,
                    left_tools: cfg.left_tools,
                }
            },
            on_resize: function (width) {
                this.prop_width = width;
            },
        }
    }
</script>
<template>
    <v-toolbar dense>
        <span v-if="title" class="text--secondary">{{title}}</span>
        <v-spacer></v-spacer>
        <div style="display: inline-block" v-for="(item, idx) in items" :key="idx">
            <v-edit-dialog v-if="is_newaction(item.value)" @save="on_edit_finish">
                <v-tooltip bottomopen-delay="300">
                    <template v-slot:activator="{ on }">
                        <v-btn icon small v-on="on" class="mx-1"
                            @click="edit_action=item; edit_text=''; edit_type=edit_type||(item.items?item.items[0].value : null)">
                            <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                        </v-btn>
                    </template>
                    <span>{{item.text}}</span>
                </v-tooltip>
                <template v-slot:input>
                    <v-select v-if="item.items" label="类型" class="ma-2" full-width outlined dense hide-details
                        v-model="edit_type" :items="item.items" :disabled="!edit_action">
                    </v-select>
                    <v-text-field label="名称" class="ma-2" outlined dense hide-details v-model="edit_text"
                        :disabled="!edit_action">
                    </v-text-field>
                </template>
            </v-edit-dialog>
            <v-edit-dialog v-else-if="item.value==='re_name'" @save="on_edit_finish">
                <v-tooltip bottomopen-delay="300">
                    <template v-slot:activator="{ on }">
                        <v-btn v-if="item.value==='re_name'" icon small v-on="on" class="mx-1"
                            @click="(e)=>{selected?on_rename(item):e.stopPropagation()}">
                            <v-icon :color="selected ? 'grey lighten-1' : 'grey darken-1'">{{item.icon}}</v-icon>
                        </v-btn>
                    </template>
                    <span>{{item.text}}</span>
                </v-tooltip>
                <template v-slot:input>
                    <v-text-field label="名称" class="ma-2" outlined dense hide-details v-model="edit_text"
                        :disabled="!edit_action">
                    </v-text-field>
                </template>
            </v-edit-dialog>
            <v-tooltip v-else bottomopen-delay="300">
                <template v-slot:activator="{ on }">
                    <v-btn icon small v-on="on" class="mx-1" @click.stop="emit_action(item)">
                        <v-icon :color="selected ? 'grey lighten-1' : 'grey darken-1'">{{item.icon}}</v-icon>
                    </v-btn>
                </template>
                <span>{{item.text}}</span>
            </v-tooltip>
            <!-- <v-tooltip v-else-if="item.value === 'clone_item'" bottomopen-delay="300">
                <template v-slot:activator="{ on }">
                    <v-btn icon small v-on="on" class="mx-1" @click.stop="emit_action(item)">
                        <v-icon :color="selected ? 'grey lighten-1' : 'grey darken-1'">{{item.icon}}</v-icon>
                    </v-btn>
                </template>
                <span>{{item.text}}</span>
            </v-tooltip> -->
        </div>
        


        <!-- <v-edit-dialog @save="on_edit_finish">
            <v-tooltip bottom v-for="(item, idx) in items" :key="idx" open-delay="300">
                <template v-slot:activator="{ on }">
                    <v-btn v-if="is_newaction(item.value)" icon small v-on="on" class="mx-1"
                        @click="edit_action=item; edit_text='';">
                        <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                    </v-btn>
                    <v-btn v-else-if="item.value==='re_name'" icon small v-on="on" class="mx-1"
                        @click="(e)=>{selected?on_rename(item):e.stopPropagation()}">
                        <v-icon :color="selected ? 'grey lighten-1' : 'grey darken-1'">{{item.icon}}</v-icon>
                    </v-btn>
                    <v-btn v-else-if="item.value === 'del_item'" icon small v-on="on" class="mx-1"
                        @click.stop="emit(item)">
                        <v-icon :color="selected ? 'grey lighten-1' : 'grey darken-1'">{{item.icon}}</v-icon>
                    </v-btn>
                </template>
                <span>{{item.text}}</span>
            </v-tooltip>
            <template v-slot:input>
                <v-select v-if="item.items" label="类型" class="ma-2" outlined dense hide-details v-model="edit_type" :items="item.items" :disabled="!edit_action">
                </v-select>
                <v-text-field label="名称" class="ma-2" outlined dense hide-details v-model="edit_text" :disabled="!edit_action">
                </v-text-field>
            </template>
        </v-edit-dialog> -->

    </v-toolbar>
</template>

<script>
    export default {
        props: ['title', 'items'],
        data: () => {
            return {
                edit_action: null,
                edit_text: null,
                edit_type: null,
            }
        },
        computed: {
            selected: function () {
                let selected = this.$store.state.sele_doc;
                return selected ? selected.doc : null;
            }
        },
        methods: {
            emit_action: function (item) {
                this.$emit('edit_item', item.value);
            },
            is_newaction: function (ac) {
                if (ac && ac.length > 4) {
                    return ac.substr(0, 4) === 'new_'
                }
                return false;
            },
            on_edit_finish: function () {
                if (!this.edit_text || !this.edit_action) {
                    return;
                }
                this.$emit('edit_item', this.edit_action.value, this.edit_text, this.edit_type);
            },
            on_rename: function (ac) {
                if (!this.selected) {
                    this.edit_action = null;
                    this.edit_text = '';
                } else {
                    this.edit_action = ac;
                    this.edit_text = this.selected.name;
                }
            }
        }
    }
</script>
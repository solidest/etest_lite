<template>
    <v-toolbar dense>
        <span v-if="title" class="text--secondary">{{title}}</span>
        <v-spacer></v-spacer>
        <v-edit-dialog @save="on_edit_finish">
            <v-tooltip v-for="(item, idx) in items" :key="idx" right open-delay="1500">
                <template v-slot:activator="{ on }">
                    <v-btn v-if="is_newaction(item.value)" icon small v-on="on" class="mx-1"
                        @click="edit_action=item; edit_text='';">
                        <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                    </v-btn>
                    <v-btn v-else-if="item.value==='re_name'" icon small v-on="on" class="mx-1"
                        @click="on_rename(item)">
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
                <v-text-field label="请输入名称" v-model="edit_text" single-line :disabled="!edit_action">
                </v-text-field>
            </template>
        </v-edit-dialog>

    </v-toolbar>
</template>

<script>
    export default {
        props: ['title', 'items'],
        data: () => {
            return {
                edit_action: null,
                edit_text: null,
            }
        },
        computed: {
            selected: function() {
                let selected = this.$store.state.sele_doc;
                return selected ? selected.doc : null;
            }
        },
        methods: {
            emit: function (item) {
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
                this.$emit('edit_item', this.edit_action.value, this.edit_text);
            },
            on_rename: function (ac) {
                if(!this.selected) {
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
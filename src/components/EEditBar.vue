<template>
    <v-toolbar dense>
        <v-icon color="grey lighten-1" class="ml-3 mr-2">{{icon}}</v-icon>
        <span v-if="title" class="text--secondary">{{title}}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom v-for="(item, idx) in items" :key="idx" open-delay="1500">
            <template v-slot:activator="{ on }">
                <v-edit-dialog v-if="is_newaction(item.value)" @save="on_new_finish" large cancel-text="取消"
                    save-text="确定">
                    <v-btn icon small v-on="on" class="mx-1" @click="new_action=item; new_count=1;">
                        <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                    </v-btn>
                    <template v-slot:input>
                        <v-sheet tile class="mx-auto" width="200">
                            <v-select class="mt-4" dense hide-details :items="new_items" v-model="new_value" filled
                                label="类型" outlined :menu-props="{ maxHeight: 700}"></v-select>
                            <v-text-field class="mt-4 mb-0" dense hide-details label="数量" v-model="new_count" type="number" outlined>
                            </v-text-field>
                        </v-sheet>
                    </template>
                </v-edit-dialog>
                <v-btn v-else-if="item.value==='undo'||item.value==='redo'" icon small v-on="on" class="mx-1"
                    @click="emit(item)" :disabled="!allow_do(item.value)">
                    <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                </v-btn>
                <v-btn v-else icon small v-on="on" class="mx-1" @click="emit(item)" :disabled="!has_selected">
                    <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                </v-btn>
            </template>
            <span>{{item.text}}</span>
        </v-tooltip>
    </v-toolbar>
</template>

<script>
    export default {
        props: ['title', 'items', 'icon', 'new_items'],
        data: () => {
            return {
                new_action: null,
                new_count: 1,
                new_value: null,
            }
        },
        computed: {
            has_selected: function () {
                return this.$store.state.sele_count > 0;
            }
        },
        watch: {
            new_items: function(vs) {
                if(vs) {
                    this.new_value = vs[0];
                }
            }
        },
        methods: {
            emit: function (item) {
                this.$emit('action', item.value);
            },
            on_new_finish: function () {
                if (this.new_action && this.new_value) {
                    this.$emit('action', this.new_action.value, this.new_value, this.new_count);
                }
            },
            is_newaction: function (ac) {
                if (ac && ac.length > 4) {
                    return ac.substr(0, 4) === 'new_'
                }
                return false;
            },
            allow_do: function (ac) {
                return this.$store.state[ac + '_count']>0;
            }
        }
    }
</script>
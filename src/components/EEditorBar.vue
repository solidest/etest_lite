<template>
    <v-toolbar dense>
        <v-icon color="grey lighten-1" class="ml-3 mr-2">{{icon}}</v-icon>
        <span v-if="title" class="text--secondary">{{title}}</span>
        <v-spacer></v-spacer>
        <v-tooltip bottom v-for="(item, idx) in items" :key="idx" open-delay="300">
            <template v-slot:activator="{ on }">
                <v-spacer v-if="!item.value" />
                <v-edit-dialog v-else-if="item.value.startsWith('new_')" @save="on_new_finish">
                    <v-btn icon small v-on="on" class="mx-1" 
                        @click="(e)=>{(item.disabled && item.disabled())?e.stopPropagation():on_new_init(item)}">
                        <v-icon :color="`grey ${(item.disabled && item.disabled())?'darken-2':'lighten-1'}`">{{item.icon}}</v-icon>
                    </v-btn>
                    <template v-slot:input>
                        <slot name="new_sheet" :new_data="new_data"></slot>
                    </template>
                </v-edit-dialog>
                <v-btn v-else-if="item.value.startsWith('d_')" icon small v-on="on" class="mx-1" @click="emit(item)" :disabled="item.is_disabled" >
                    <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                </v-btn>
                <v-btn v-else-if="item.value==='undo'||item.value==='redo'" icon small v-on="on" class="mx-1"
                    @click="emit(item)" :disabled="!allow_do(item.value)">
                    <v-icon color="grey lighten-1">{{item.icon}}</v-icon>
                </v-btn>
                <v-btn v-else-if="item.value==='paste'" icon small v-on="on" class="mx-1" @click="emit(item)" :disabled="!allow_paste">
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
        props: ['title', 'items', 'icon', 'newdef_data', 'kind'],
        data: () => {
            return {
                new_action: null,
                new_data: {},
            }
        },
        computed: {
            has_selected: function () {
                return this.$store.state.sele_count > 0;
            },
            allow_paste: function() {
                return !!this.$store.state.copys[this.kind];
            },
        },
        methods: {
            emit: function (item) {
                this.$emit('action', item.value);
            },
            on_new_finish: function () {
                if (this.new_action) {
                    this.$emit('action', this.new_action.value, this.new_data);
                }
            },
            on_new_init: function(action) {
                this.new_action = action;
                let d = JSON.parse(JSON.stringify(this.newdef_data));
                let self = this;
                this.$nextTick(()=>self.new_data=d)
            },
            // is_newaction: function (ac) {
            //     return ac.substr(0, 4) === 'new_'
            // },
            allow_do: function (ac) {
                return this.$store.state[ac + '_count'] > 0;
            }
        }
    }
</script>
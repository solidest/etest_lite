<template>
    <v-edit-dialog large save-text="确定" cancel-text="取消"
    @cancel="doClear" @close="doClear" @open="onOpen">
        <span :class="cls" @click="onClick">{{text||' '}}</span>
        <span class = "ml-2 grey--text" @click="onClick">{{memo}}</span>
        <template v-slot:input>
            <v-sheet width=460>
                <v-text-field v-for="item of values" :key="item.id" placeholder="分支条件" v-model="item.condition" hide-details>
                    <template v-slot:append-outer>
                        <v-icon small @click="remove(item)">mdi-close</v-icon>
                    </template>
                    <template v-slot:prepend>
                        <v-checkbox hide-details dense v-model="item.selected" class="mt-0 mb-2" @change="selected(item)">
                        </v-checkbox>
                    </template>
                </v-text-field>
                <v-btn icon @click="addItem" class="mt-4"> <v-icon color="grey">mdi-plus</v-icon></v-btn>
            </v-sheet>
        </template>
    </v-edit-dialog>
</template>

<script>
    import shortid from 'shortid'
    export default {
        props: ['id', 'items', 'text', 'cls', 'memo'],
        data: () => {
            return {
                values: [],
            }
        },
        methods: {
            doClear: function () {
                this.values = [];
            },
            onOpen: function () {
                this.values = JSON.parse(JSON.stringify(this.items));
                if(this.values.length === 0) {
                    this.addItem();
                }
            },
            onSave: function () {
                this.$emit('save', this.id, this.values, this.sel_id_);
            },
            addItem: function() {
                this.values.push({id: shortid.generate(), condition: '', selected: false});
            },
            remove: function(item) {
                let idx = this.values.findIndex(it => it === item);
                if(idx>=0){
                    this.values.splice(idx, 1);
                }
            },
            selected: function(item) {
                if(item.selected) {
                    this.values.forEach(it => it.selected = (it===item));
                }
            },
            isSel: function(it) {
                return this.sel_id_=== it.id;
            },
            onClick: function() {
                this.$emit('_click');
            }
        }

    }
</script>
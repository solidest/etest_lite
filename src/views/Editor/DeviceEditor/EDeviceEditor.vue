<template>
    <div class="d-flex">
        <div :style="{height:`calc(100vh - ${top_height}px)`, width: '100%', 'overflow-y': 'auto'}">
            <v-data-table :headers="headers" :items="items" no-data-text="空" disable-sort hide-default-footer
                disable-pagination show-select v-model="selected" :single-select="single_select">
            </v-data-table>
        </div>
        <e-vertical-bar :width="prop_width" :min="200" :max="800" :right="true" @resize="on_resize" />
        <e-property-panel :style="{width: `${prop_width}px`}" class="d-flex align-stretch"
            :item="current.item" :schema="current.schema" :title="current.title" @changed="on_prop_changed">
        </e-property-panel>
        <div v-if="dlg_opt.type">
            <e-select-dlg v-if="dlg_opt.type==='select'" @result="do_new_item" :dialog="dlg_opt.type"
                :title="dlg_opt.title" :items="dlg_opt.data" />
        </div>
    </div>
</template>

<script>
    import cfg from './config';
    import schemas from './config_sch';
    import db from '../../../doc/projdb';
    import helper from '../../../utility/helper';
    import shortid from 'shortid';
    import EVerticalBar from '../../Components/EVerticalBar';
    import EPorpertyPanel from '../../Components/EPropertyPanel';

    export default {
        props: ['top_height'],
        components: {
            'e-vertical-bar': EVerticalBar,
            'e-property-panel': EPorpertyPanel,
            'e-select-dlg': () => import( /* webpackChunkName: "eselectdlg" */ '../../Dialog/ESelectDlg'),
        },
        mounted: function () {
            let self = this;
            let ieditor = {
                right_tools: cfg.right_tools,
                left_tools: cfg.left_tools,
                do_action: (ac) => {
                    let do_ac = self[`action_${ac}`];
                    if (do_ac) {
                        return do_ac();
                    }
                    console.log('TODO', `action_${ac}`);
                }
            }
            this.$emit('active', ieditor);
            this._reset_doc(this.doc_id);
        },
        beforeDestroy: function() {
            this._save_doc_state(this.doc_id);
        },
        data() {
            return {
                headers: cfg.headers,
                items: [],
                selected: [],
                single_select: true,
                dlg_opt: {
                    type: null,
                    title: '',
                    data: null,
                    tag: null,
                }
            }
        },
        computed: {
            doc_id: function () {
                let ac = this.$store.state.Editor.active;
                return ac ? ac.id : '';
            },
            prop_width: {
                get: function () {
                    return this.$store.state.Device.prop_width;
                },
                set: function (v) {
                    this.$store.commit('Device/set_prop_width', v);
                }
            },
            current: function() {
                if(this.selected.length === 1) {
                    return {
                        item: this.selected[0],
                        schema: schemas[this.selected[0].kind],
                        title: `接口类型: ${this.selected[0].kind}`,
                    }
                }
                return {title: '属性编辑器'};
            }
        },
        watch: {
            doc_id: function (nid, oid) {
                if(oid) {
                    this._save_doc_state(oid);
                }
                this._reset_doc(nid);
            },
            selected: function() {
                this.update_state();
            }
        },
        methods: {
            _temp: function () {
                let res = [];
                for (let index = 0; index < 100; index++) {
                    res.push({
                        id: index,
                        name: this.doc_id + index,
                        config: {},
                    })
                }
                return res;
            },
            _get_newdoc: function () {
                return {
                    id: this.doc_id,
                    content: this.items,
                    kind: cfg.kind,
                }
            },
            _idx_last: function() {
                if(this.selected.length === 0) {
                    if(this.items.length === 0) {
                        return 0;
                    }
                    return this.items.length;
                }
                for (let index = this.items.length-1; index >= 0; index--){
                    if(this.selected.includes(this.items[index])) {
                        return index + 1;
                    }
                }
                return 0;
            },
            _idx_first: function() {
                if(this.selected.length === 0) {
                    return 0;
                }
                for (let index = 0; index < this.items.length; index++) {
                    if(this.selected.includes(this.items[index])) {
                        return index;
                    }
                }
                return 0;
            },
            _save_doc_state: function(doc_id) {
                let s = {
                    selected: helper.deep_copy(this.selected),
                    single_select: this.single_select,
                    prop_width: this.prop_width,
                }
                this.$store.getters['Editor/put_doc_state'](doc_id, s);
            },
            _reset_doc: function (id) {
                let s = this.$store.getters['Editor/get_doc_state'](id);
                if(s) {
                    this.selected = helper.deep_copy(s.selected);
                    this.single_select = s.single_select;
                    this.prop_width = s.prop_width;
                } else {
                    this.selected = [];
                }
                let doc = db.get_doc(id);
                if (doc) {
                    this.items = doc.content;
                    this.$doc = doc;
                } else {
                    this.items = [];
                    this.$doc = db.put_doc(this._get_newdoc());
                }
                this.update_state();
            },
            update_state: function () {
                let len = this.selected.length;
                let dis = {
                    move_up: false,
                    move_down: false,
                    cut: false,
                    copy: false,
                    paste: false,
                    undo: false,
                    redo: false,
                    del_item: false,
                    multi_insert: false,
                }
                if(len===0) {
                    dis.move_up = true;
                    dis.move_down = true;
                    dis.cut = true;
                    dis.copy = true;
                    dis.del_item = true;
                    dis.multi_insert = true;
                } else if(len>1) {
                    dis.move_up = true;
                    dis.move_down = true;
                    dis.multi_insert = true;
                }
                this.$store.commit('Editor/set_state_disbar', dis);
            },

            on_resize: function (width) {
                this.prop_width = width;
            },
            on_prop_changed: function() {
                db.set_doc(this.$doc);
            },
            action_new_item_after: function () {
                this.dlg_opt.type = 'select';
                this.dlg_opt.title = '选择接口类型';
                this.dlg_opt.data = cfg.intf_types;
                this.dlg_opt.tag = 'after';
            },
            action_new_item_before: function () {
                this.dlg_opt.type = 'select';
                this.dlg_opt.title = '选择接口类型';
                this.dlg_opt.data = cfg.intf_types;
                this.dlg_opt.tag = 'before';
            },
            action_toggle_select: function() {
                this.single_select = !this.single_select;
                if(this.single_select) {
                    while(this.selected.length>1) {
                        this.selected.pop();
                    }
                } 
            },
            action_del_item: function() {
                let items = this.items;
                this.selected.forEach(it => {
                    let idx = items.findIndex(i => i === it);
                    if(idx>=0) {
                        items.splice(idx, 1);
                    }
                });
                db.set_doc(this.$doc);
            },
            do_new_item: function (res) {
                this.dlg_opt.type = null;
                if(res.result!=='ok') {
                    return;
                }
                let newi = {
                    id: shortid.generate(),
                    name: '',
                    memo: '',
                    kind: res.selected,
                }
                switch(this.dlg_opt.tag) {
                    case 'after':
                        this.items.splice(this._idx_last(), 0, newi);
                        break;
                    case 'before':
                        this.items.splice(this._idx_first(), 0, newi);
                        break;
                }
                if(this.selected.length>0) {
                    this.selected.splice(0, this.selected.length);
                }
                this.selected.push(newi);
                db.set_doc(this.$doc);
            }

        }
    }
</script>
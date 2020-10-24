<template>
    <div class="d-flex">
        <div :style="{height:`calc(100vh - ${top_height}px)`, width: '100%', 'overflow-y': 'auto'}" ref="__intf_list">
            <v-data-table :headers="headers" :items="items" no-data-text="空" disable-sort hide-default-footer
                disable-pagination show-select v-model="selected" :single-select="single_select"
                @item-selected="on_selected" @toggle-select-all="on_selected">
                <template v-slot:item.kind="{item}">
                    <v-chip small color="light-blue darken-3">{{alias[item.kind]}}</v-chip>
                </template>
                <template v-slot:item.name="{item}">
                    <span class="font-weight-bold">{{item.name}}</span>
                    <span class="pl-2 grey--text text--lighten-1">{{item.memo}}</span>
                </template>
                <template v-slot:item.config="{item}">
                    <span class="grey--text text--lighten-2">{{format_cfg(item)}}</span>
                </template>
            </v-data-table>
        </div>
        <e-vertical-bar :width="prop_width" :min="200" :max="800" :right="true" @resize="on_resize" />
        <e-property-panel :style="{width: `${prop_width}px`}" class="d-flex align-stretch"
            :item="current.item" :schema="current.schema" :title="current.title" @changed="on_prop_changed">
        </e-property-panel>
        <div v-if="dlg_opt.type">
            <e-select-dlg v-if="dlg_opt.type==='select'" @result="do_new_item" :dialog="dlg_opt.type"
                :title="dlg_opt.title" :items="dlg_opt.data" />
            <e-number-dlg v-else-if="dlg_opt.type==='number'" @result="do_paste_batch" :dialog="dlg_opt.type"
                :title="dlg_opt.title" :value="dlg_opt.data" :label="dlg_opt.tag.label" />
            <e-etl-dlg v-else-if="dlg_opt.type==='etl'" @result="do_etl_code" :dialog="dlg_opt.type"
                :title="dlg_opt.title" :etl_code="dlg_opt.data" :kind="kind" />
        </div>
    </div>
</template>

<script>
    import shortid from 'shortid';
    import {sdk} from '../../../../sdk/sdk'
    import api from '../../../api/client/';
    import helper from '../../../utility/helper';
    import cfg from './config';
    import schemas from './config_sch';
    import defaults from './config_default';
    import db from '../../../doc/workerdb';
    import redoundo from '../../../doc/redoundo';
    import EVerticalBar from '../../Components/EVerticalBar';
    import EPorpertyPanel from '../../Components/EPropertyPanel';
    import BatchName from '../../../utility/BatchName';

    export default {
        props: ['top_height'],
        components: {
            'e-vertical-bar': EVerticalBar,
            'e-property-panel': EPorpertyPanel,
            'e-select-dlg': () => import( /* webpackChunkName: "eselectonedlg" */ '../../Dialog/EDlgSelectOne'),
            'e-number-dlg': () => import( /* webpackChunkName: "enumberdlg" */ '../../Dialog/EDlgNumber'),
            'e-etl-dlg': () => import( /* webpackChunkName: "eetldlg" */ '../../Dialog/EDlgETL'),
        },
        mounted: function () {
            this._reset_doc(this.doc_id);
            this.$emit('active', this._get_ieditor());
        },
        beforeDestroy: function() {
            this._save_doc_state(this.doc_id);
        },
        data() {
            return {
                headers: cfg.headers,
                alias: cfg.intf_alias,
                items: [],
                selected: [],
                single_select: true,
                prop_width: 300,
                dlg_opt: {
                    type: null,
                    title: '',
                    data: null,
                    tag: null,
                },
                redoundo: null,
                kind: cfg.kind
            }
        },
        computed: {
            doc_id: function () {
                let ac = this.$store.state.Editor.active;
                return ac ? ac.id : '';
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
            },
            proj_id: function() {
                return this.$store.state.proj.id;
            },
            dialog: function() {
                return this.dlg_opt.type;
            }
        },
        watch: {
            doc_id: function (nid, oid) {
                if(oid) {
                    this._save_doc_state(oid);
                }
                this._reset_doc(nid);
                this._update_state();
            },
            dialog: function(d) {
                let mode = d ? (d==='etl'?'fullscreen':'dialog') : 'normal';
                this.$store.commit('setWinMode', mode);
            },
        },
        methods: {
            _reset_doc: async function (id, reset_state=false) {
                this.redoundo = redoundo.get_ru(id);
                if(reset_state) {
                    this.redoundo.reset();
                    this.selected = [];
                } else {
                    let s = this.$store.getters['Editor/get_doc_state'](id);
                    if(s) {
                        this.selected = s.selected;
                        this.single_select = s.single_select;
                        this.prop_width = s.prop_width;
                        if(s.list_top>0) {
                            let self = this;
                            this.$nextTick(()=>{self.$refs.__intf_list.scrollTop = s.list_top;})
                        }
                    } else {
                        this.selected = [];
                    }                    
                }

                let doc = await db.get('src', id);
                if (doc) {
                    this.items = doc.content;
                    this.$doc = doc;
                } else {
                    await db.insert('src', {id, content: [], kind: this.kind});
                    this.$doc =  await db.get('src', id);
                    this.items = this.$doc.content;
                    api.projdb_changed(this.proj_id);
                }
                if(this.redoundo.isEmpty) {
                    this.redoundo.pushChange(this.items, this._get_ru_version());
                }
            },
            _get_ieditor: function () {
                let self = this;
                return {
                    right_tools: cfg.right_tools,
                    left_tools: cfg.left_tools,
                    get_state: () => { return self._get_state();},
                    do_action: (ac) => { return self[`action_${ac}`](); }
                }
            },
            _get_ru_version: function() {
                let sels = [];
                this.selected.forEach(it => {sels.push(it.id)});
                return {
                    
                    pos: this.$refs.__intf_list.scrollTop,
                    sel_ids: sels,
                }
            },
            _set_ru_version: function(vo) {
                if(!vo) {
                    return;
                }
                this.selected.splice(0, this.selected.length);
                let self = this;
                vo.sel_ids.forEach(id => {self.selected.push(self.items.find( i => i.id === id))});
                this.$nextTick(() => {
                    self.$refs.__intf_list.scrollTop = vo.pos;
                })
            },
            _update_change: function(reason) {
                db.update('src', this.$doc);
                api.projdb_changed(this.proj_id);
                switch (reason) {
                    case 'action':
                        this.redoundo.pushChange(this.items, this._get_ru_version());
                        break;
                    case 'modify':
                        this.redoundo.pushChange(this.items, this._get_ru_version());
                        this._update_state();
                        break;
                    case 'redoundo':
                        break;
                    default:
                        console.error('UNKNOW REASON', reason);
                        break;
                }
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
                    selected: this.selected,
                    single_select: this.single_select,
                    prop_width: this.prop_width,
                    list_top: this.$refs.__intf_list.scrollTop,
                }
                this.$store.getters['Editor/put_doc_state'](doc_id, s);
            },
            _update_state: function() {
                let s = this._get_state();
                this.$store.commit('Editor/set_state_disbar', s);
            },
            _get_state: function() {
                let len = this.selected.length;
                let allow_paste = this.$store.state.copyed === cfg.kind;
                let dis = {
                    move_up: false,
                    move_down: false,
                    cut: false,
                    copy: false,
                    paste: !allow_paste,
                    paste_batch: !allow_paste,
                    undo: this.redoundo.undoCount===0,
                    redo: this.redoundo.redoCount===0,
                    remove: false,
                    multi_insert: false,
                }
                if(len===0) {
                    dis.move_up = true;
                    dis.move_down = true;
                    dis.cut = true;
                    dis.copy = true;
                    dis.remove = true;
                    dis.multi_insert = true;
                } else if(len>1) {
                    dis.move_up = true;
                    dis.move_down = true;
                    dis.multi_insert = true;
                } else {
                    len = this.items.length;
                    let sel = this.selected[0];
                    let idx = this.items.findIndex(it => it === sel);
                    dis.move_up = len===1 || idx===0;
                    dis.move_down = len===1 || idx===len-1;
                }
                return dis;
            },
            format_cfg: function(obj) {
                    if (!obj) {
                        return '';
                    }
                    let res = [];
                    for (let key in obj) {
                        if(['name', 'memo', 'id', 'kind'].includes(key)) {
                            continue;
                        }
                        let v = isNaN(obj[key]) ? `'${obj[key]}'` : obj[key]
                        res.push(key + ': ' + v);
                    }
                    return res.join(', ');
            },
            on_resize: function (width) {
                this.prop_width = width;
            },
            on_prop_changed: function() {
                this._update_change('modify');
            },
            on_selected: function() {
                let self = this;
                this.$nextTick(() => {
                    self._update_state();
                });
                this.$emit('action_click');
            },
            action_redo: function() {
                let ov = this.redoundo.popRedo();
                this.items = ov.doc;
                this.$doc.content = this.items;
                this._set_ru_version(ov.tag);
                this._update_change('redoundo');
            },
            action_undo: function() {
                let ov = this.redoundo.popUndo();
                this.items = ov.doc;
                this.$doc.content = this.items;
                this._set_ru_version(ov.tag);
                this._update_change('redoundo');
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
            action_move_up: function() {
                let sel = this.selected[0];
                if(!sel) {
                    return;
                }
                let items = this.items;
                let idx = items.findIndex(it => it === sel);
                if(idx<=0) {
                    return;
                }
                items.splice(idx, 1);
                items.splice(idx-1, 0, sel);
                this._update_change('action');
            },
            action_move_down: function() {
                let sel = this.selected[0];
                if(!sel) {
                    return;
                }
                let items = this.items;
                let idx = items.findIndex(it => it === sel);
                if(idx<0 || idx === this.items.length-1) {
                    return;
                }
                items.splice(idx, 1);
                items.splice(idx+1, 0, sel);
                this._update_change('action');
            },
            action_remove: function() {
                this.redoundo.updateTag(this._get_ru_version());
                let items = this.items;
                this.selected.forEach(it => {
                    let idx = items.findIndex(i => i === it);
                    if(idx>=0) {
                        items.splice(idx, 1);
                    }
                });
                this.selected.splice(0, this.selected.length);
                this._update_change('action');
            },
            action_copy: function() {
                if(this.selected.length===0) {
                    return;
                }
                api.clipboard_write(cfg.kind, this.selected);
            },
            action_cut: function() {
                this.action_copy();
                this.action_remove();
            },
            action_paste: function() {
                let self = this;
                api.clipboard_read().then(info => {
                    if(!info || info.format!==cfg.kind) {
                        return;
                    }
                    self.do_paste(info.data);
                });
            },
            action_paste_batch: function() {
                this.dlg_opt.type = 'number';
                this.dlg_opt.title = '批量粘贴';
                this.dlg_opt.data = 2;
                this.dlg_opt.tag = {label: '数量'};
            },
            action_etl_code: function() {
                let dev = this.$store.state.Editor.active;
                let etl_code = sdk.converter.device_dev2etl(this.items, dev.name, dev.memo);
                this.dlg_opt.type = 'etl';
                this.dlg_opt.title = dev.name;
                this.dlg_opt.data = etl_code;
            },
            do_etl_code: function(res) {
                this.dlg_opt.type = null;
                if(res.result!=='ok') {
                    return;
                }
                let doc = sdk.converter.device_etl2dev(res.value);
                this.$doc.content = doc.content;
                db.update('src', this.$doc);
                this._reset_doc(this.doc_id, true);
                this._update_state();
            },
            do_paste: function(res) {
                if(res && res.length>0) {
                    res.forEach(r => r.id = shortid.generate());
                } else {
                    return;
                }
                this.items.splice(this._idx_last(), 0, ...res);
                if(this.selected.length>0) {
                    this.selected.splice(0, this.selected.length);
                }
                this.selected.push(...res);
                this._update_change('modify');
            },
            do_paste_batch: function(res) {
                this.dlg_opt.type = null;
                if(res.result!=='ok') {
                    return;
                }
                let count = res.value;
                if(count>500 || count<0) {
                    count = 2;
                }
                let self = this;
                api.clipboard_read().then(info => {
                    if(!info || info.format!==cfg.kind || !info.data) {
                        return;
                    }
                    let res = [];
                    let bn = new BatchName(info.data.map(i=>i.name));
                    for (let index = 0; index < count; index++) {
                        let data = helper.deep_copy(info.data);
                        bn.rename(data, index);
                        res.push(...data);
                    }
                    self.do_paste(res);
                });
            },
            do_new_item: function (res) {
                this.dlg_opt.type = null;
                if(res.result!=='ok') {
                    return;
                }
                let kind = res.selected;
                let newi = JSON.parse(JSON.stringify(defaults[kind]));
                newi.id = shortid.generate();
                newi.name = '';
                newi.memo = '';
                newi.kind = kind;
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
                this._update_change('modify');
            }

        }
    }
</script>
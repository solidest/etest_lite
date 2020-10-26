<template>
    <div class="d-flex">
        <div :style="{height:`calc(100vh - ${top_height}px)`, width: '100%', 'overflow-y': 'auto'}" ref="__intf_list">
            <e-linking-editor />
        </div>
 <div v-if="dlg_opt.type">
            <e-select-dlg v-if="dlg_opt.type==='select'" @result="on_select_devs" :dialog="dlg_opt.type"
                 :items="raw_devs" />
            <!-- <e-number-dlg v-else-if="dlg_opt.type==='number'" @result="do_paste_batch" :dialog="dlg_opt.type"
                :title="dlg_opt.title" :value="dlg_opt.data" :label="dlg_opt.tag.label" />
            <e-etl-dlg v-else-if="dlg_opt.type==='etl'" @result="do_etl_code" :dialog="dlg_opt.type"
                :title="dlg_opt.title" :etl_code="dlg_opt.data" :kind="kind" /> -->
        </div>
    </div>
</template>

<script>
    // import shortid from 'shortid';
    import api from '../../../api/client/';
    import topo_map from '../../../utility/topo_map';
    // import helper from '../../../utility/helper';
    import cfg from './config';
    import tman from '../../../utility/tree_man';
    // import schemas from './config_sch';
    // import defaults from './config_default';
    import db from '../../../doc/workerdb';
    import redoundo from '../../../doc/redoundo';
    // import EVerticalBar from '../../Components/EVerticalBar';
    // import EPorpertyPanel from '../../Components/EPropertyPanel';
    // import BatchName from '../../../utility/BatchName';
    import ELinkingEditor from './ELinkingEditor'
    // import reused from '../../../utility/reused';

    export default {
        props: ['top_height'],
        components: {
            'e-linking-editor': ELinkingEditor,
            // 'e-vertical-bar': EVerticalBar,
            // 'e-property-panel': EPorpertyPanel,
            'e-select-dlg': () => import( /* webpackChunkName: "eselectdevdlg" */ './EDlgSelectDev'),
            // 'e-number-dlg': () => import( /* webpackChunkName: "enumberdlg" */ '../../Dialog/EDlgNumber'),
        },
        mounted: function () {
            this._reset_doc(this.doc_id);
            this.$emit('active', this._get_ieditor());
        },
        beforeDestroy: function () {
            // this._save_doc_state(this.doc_id);
        },
        data() {
            return {
                content: {},
                raw_devs: [],
                map: null,
                selected: null,
                redoundo: null,

                // headers: cfg.headers,
                // alias: cfg.intf_alias,
                // single_select: true,
                // prop_width: 300,
                dlg_opt: {
                    type: null,
                    title: '',
                    data: null,
                    tag: null,
                },
            }
        },
        computed: {
            doc_id: function () {
                let ac = this.$store.state.Editor.active;
                return ac ? ac.id : '';
            },
            // current: function() {
            //     if(this.selected.length === 1) {
            //         return {
            //             item: this.selected[0],
            //             schema: schemas[this.selected[0].kind],
            //             title: `接口类型: ${this.selected[0].kind}`,
            //         }
            //     }
            //     return {title: '属性编辑器'};
            // }
        },
        watch: {
            // doc_id: function (nid, oid) {
            //     if(oid) {
            //         this._save_doc_state(oid);
            //     }
            //     this._reset_doc(nid);
            //     this._update_state();
            // },
        },
        methods: {
            _get_ieditor() {
                let self = this;
                return {
                    right_tools: cfg.right_tools,
                    left_tools: cfg.left_tools,
                    get_state: () => {
                        return self._get_state();
                    },
                    do_action: (ac) => {
                        let fn = self[`action_${ac}`];
                        if (fn) fn();
                    }
                }
            },
            async _load_rawdata() {
                let tree = await db.get('config', 'tree');
                let fdevs = [];
                tman.getFileList('', tree.value, 'device', fdevs);
                let odevs = [];
                fdevs.forEach(async (fdev) => {
                    let dev = fdev[1];
                    let od = await db.get('src', dev.id);
                    odevs.push({
                        id: dev.id,
                        name: dev.name,
                        kind: 'none',
                        conns: ((od && od.content) ? od.content : []).map(c => {
                            return {
                                id: c.id,
                                name: c.name,
                                kind: c.kind
                            }
                        })
                    })
                });
                this.raw_devs = odevs;
            },
            _udpate_bydb (db_devs, bus_links, pp_links) {
                if(db_devs) {
                    for (const db_dev of db_devs) {
                        let dev = this.raw_devs.find(it => (it.id===db_dev.id || it.name===db_dev.name));
                        if(dev) {
                            dev.kind = db_dev.kind || 'none';
                            dev.pos = db_dev.pos;
                        }
                    }
                }
                this.map = topo_map.create_map_bydb(this.raw_devs, bus_links, pp_links);
            },
            async _reset_doc(id, reset_state = false) {
                this.redoundo = redoundo.get_ru(id);
                if (reset_state) {
                    this.redoundo.reset();
                    this.selected = null;
                } 
                else {
                    let s = this.$store.getters['Editor/get_doc_state'](id);
                    if (s) {
                        this.selected = s.selected;
                    } else {
                        this.selected = null;
                    }
                }   
                await this._load_rawdata();
                let doc = await db.get('src', id);
                if (!doc) {
                    await db.insert('src', {
                        id,
                        content: {devs: [], bus_links: [], pp_links: [], binds:{}},
                        kind: this.kind
                    });
                    doc = await db.get('src', id);
                    api.projdb_changed(this.proj_id);
                }
                this.content = doc.content;
                this._udpate_bydb(doc.devs, doc.bus_links, doc.pp_links);
                if (this.redoundo.isEmpty) {
                    this.redoundo.pushChange(this.content, this.selected);
                }
            },
            _get_state: function () {
                let dis = {
                    move_up: false,
                    move_down: false,
                    cut: false,
                    copy: false,
                    paste: false,
                    paste_batch: false,
                    undo: false,
                    redo: false,
                    remove: false,
                    multi_insert: false,
                }
                // let len = this.selected.length;
                // let allow_paste = this.$store.state.copyed === cfg.kind;
                // let dis = {
                //     move_up: false,
                //     move_down: false,
                //     cut: false,
                //     copy: false,
                //     paste: !allow_paste,
                //     paste_batch: !allow_paste,
                //     undo: this.redoundo.undoCount===0,
                //     redo: this.redoundo.redoCount===0,
                //     remove: false,
                //     multi_insert: false,
                // }
                // if(len===0) {
                //     dis.move_up = true;
                //     dis.move_down = true;
                //     dis.cut = true;
                //     dis.copy = true;
                //     dis.remove = true;
                //     dis.multi_insert = true;
                // } else if(len>1) {
                //     dis.move_up = true;
                //     dis.move_down = true;
                //     dis.multi_insert = true;
                // } else {
                //     len = this.items.length;
                //     let sel = this.selected[0];
                //     let idx = this.items.findIndex(it => it === sel);
                //     dis.move_up = len===1 || idx===0;
                //     dis.move_down = len===1 || idx===len-1;
                // }
                return dis;
            },
            action_select_dev() {
                this.dlg_opt.type = 'select';
            },
            on_select_devs(res) {
                this.dlg_opt.type = null;
                if(res.result !== 'ok') {
                    return;
                }
            },

            //     _set_ru_version: function(vo) {
            //         if(!vo) {
            //             return;
            //         }
            //         this.selected.splice(0, this.selected.length);
            //         let self = this;
            //         vo.sel_ids.forEach(id => {self.selected.push(self.items.find( i => i.id === id))});
            //         this.$nextTick(() => {
            //             self.$refs.__intf_list.scrollTop = vo.pos;
            //         })
            //     },
            //     _update_change: function(reason) {
            //         db.set_doc(this.$doc);
            //         switch (reason) {
            //             case 'action':
            //                 this.redoundo.pushChange(this.items, this._get_ru_tag());
            //                 break;
            //             case 'modify':
            //                 this.redoundo.pushChange(this.items, this._get_ru_tag());
            //                 this._update_state();
            //                 break;
            //             case 'redoundo':
            //                 break;
            //             default:
            //                 console.error('UNKNOW REASON', reason);
            //                 break;
            //         }
            //     },
            //     _get_newdoc: function () {
            //         return {
            //             id: this.doc_id,
            //             content: this.items,
            //             kind: cfg.kind,
            //         }
            //     },
            //     _idx_last: function() {
            //         if(this.selected.length === 0) {
            //             if(this.items.length === 0) {
            //                 return 0;
            //             }
            //             return this.items.length;
            //         }
            //         for (let index = this.items.length-1; index >= 0; index--){
            //             if(this.selected.includes(this.items[index])) {
            //                 return index + 1;
            //             }
            //         }
            //         return 0;
            //     },
            //     _idx_first: function() {
            //         if(this.selected.length === 0) {
            //             return 0;
            //         }
            //         for (let index = 0; index < this.items.length; index++) {
            //             if(this.selected.includes(this.items[index])) {
            //                 return index;
            //             }
            //         }
            //         return 0;
            //     },
            //     _save_doc_state: function(doc_id) {
            //         let s = {
            //             selected: this.selected,
            //             single_select: this.single_select,
            //             prop_width: this.prop_width,
            //             list_top: this.$refs.__intf_list.scrollTop,
            //         }
            //         this.$store.getters['Editor/put_doc_state'](doc_id, s);
            //     },
            //     _update_state: function() {
            //         let s = this._get_state();
            //         this.$store.commit('Editor/set_state_disbar', s);
            //     },
            
            //     format_cfg: function(obj) {
            //             if (!obj) {
            //                 return '';
            //             }
            //             let res = [];
            //             for (let key in obj) {
            //                 if(['name', 'memo', 'id'].includes(key)) {
            //                     continue;
            //                 }
            //                 let v = isNaN(obj[key]) ? `'${obj[key]}'` : obj[key]
            //                 res.push(key + ': ' + v);
            //             }
            //             return res.join(', ');
            //     },
            //     on_resize: function (width) {
            //         this.prop_width = width;
            //     },
            //     on_prop_changed: function() {
            //         this._update_change('modify');
            //     },
            //     on_selected: function() {
            //         let self = this;
            //         this.$nextTick(() => {
            //             self._update_state();
            //         });
            //         this.$emit('action_click');
            //     },
            //     action_redo: function() {
            //         let ov = this.redoundo.popRedo();
            //         this.items = ov.doc;
            //         this.$doc.content = this.items;
            //         this._set_ru_version(ov.tag);
            //         this._update_change('redoundo');
            //     },
            //     action_undo: function() {
            //         let ov = this.redoundo.popUndo();
            //         this.items = ov.doc;
            //         this.$doc.content = this.items;
            //         this._set_ru_version(ov.tag);
            //         this._update_change('redoundo');
            //     },
            //     action_new_item_after: function () {
            //         this.dlg_opt.type = 'select';
            //         this.dlg_opt.title = '选择接口类型';
            //         this.dlg_opt.data = cfg.intf_types;
            //         this.dlg_opt.tag = 'after';
            //     },
            //     action_new_item_before: function () {
            //         this.dlg_opt.type = 'select';
            //         this.dlg_opt.title = '选择接口类型';
            //         this.dlg_opt.data = cfg.intf_types;
            //         this.dlg_opt.tag = 'before';
            //     },
            //     action_toggle_select: function() {
            //         this.single_select = !this.single_select;
            //         if(this.single_select) {
            //             while(this.selected.length>1) {
            //                 this.selected.pop();
            //             }
            //         } 
            //     },
            //     action_move_up: function() {
            //         let sel = this.selected[0];
            //         if(!sel) {
            //             return;
            //         }
            //         let items = this.items;
            //         let idx = items.findIndex(it => it === sel);
            //         if(idx<=0) {
            //             return;
            //         }
            //         items.splice(idx, 1);
            //         items.splice(idx-1, 0, sel);
            //         this._update_change('action');
            //     },
            //     action_move_down: function() {
            //         let sel = this.selected[0];
            //         if(!sel) {
            //             return;
            //         }
            //         let items = this.items;
            //         let idx = items.findIndex(it => it === sel);
            //         if(idx<0 || idx === this.items.length-1) {
            //             return;
            //         }
            //         items.splice(idx, 1);
            //         items.splice(idx+1, 0, sel);
            //         this._update_change('action');
            //     },
            //     action_remove: function() {
            //         this.redoundo.updateTag(this._get_ru_tag());
            //         let items = this.items;
            //         this.selected.forEach(it => {
            //             let idx = items.findIndex(i => i === it);
            //             if(idx>=0) {
            //                 items.splice(idx, 1);
            //             }
            //         });
            //         this.selected.splice(0, this.selected.length);
            //         this._update_change('action');
            //     },
            //     action_copy: function() {
            //         if(this.selected.length===0) {
            //             return;
            //         }
            //         api.clipboard_write(cfg.kind, this.selected);
            //     },
            //     action_cut: function() {
            //         this.action_copy();
            //         this.action_remove();
            //     },
            //     action_paste: function() {
            //         let self = this;
            //         api.clipboard_read().then(info => {
            //             if(!info || info.format!==cfg.kind) {
            //                 return;
            //             }
            //             self.do_paste(info.data);
            //         });
            //     },
            //     action_paste_batch: function() {
            //         this.dlg_opt.type = 'number';
            //         this.dlg_opt.title = '批量粘贴';
            //         this.dlg_opt.data = 2;
            //         this.dlg_opt.tag = {label: '数量'};
            //     },
            //     do_paste: function(res) {
            //         if(res && res.length>0) {
            //             res.forEach(r => r.id = shortid.generate());
            //         } else {
            //             return;
            //         }
            //         this.items.splice(this._idx_last(), 0, ...res);
            //         if(this.selected.length>0) {
            //             this.selected.splice(0, this.selected.length);
            //         }
            //         this.selected.push(...res);
            //         this._update_change('modify');
            //     },
            //     do_paste_batch: function(res) {
            //         this.dlg_opt.type = null;
            //         if(res.result!=='ok') {
            //             return;
            //         }
            //         let count = res.value;
            //         if(count>500 || count<0) {
            //             count = 2;
            //         }
            //         let self = this;
            //         api.clipboard_read().then(info => {
            //             if(!info || info.format!==cfg.kind || !info.data) {
            //                 return;
            //             }
            //             let res = [];
            //             let bn = new BatchName(info.data.map(i=>i.name));
            //             for (let index = 0; index < count; index++) {
            //                 let data = helper.deep_copy(info.data);
            //                 bn.rename(data, index);
            //                 res.push(...data);
            //             }
            //             self.do_paste(res);
            //         });
            //     },
            //     do_new_item: function (res) {
            //         this.dlg_opt.type = null;
            //         if(res.result!=='ok') {
            //             return;
            //         }
            //         let kind = res.selected;
            //         let newi = JSON.parse(JSON.stringify(defaults[kind]));
            //         newi.id = shortid.generate();
            //         newi.name = '';
            //         newi.memo = '';
            //         newi.kind = kind;
            //         switch(this.dlg_opt.tag) {
            //             case 'after':
            //                 this.items.splice(this._idx_last(), 0, newi);
            //                 break;
            //             case 'before':
            //                 this.items.splice(this._idx_first(), 0, newi);
            //                 break;
            //         }
            //         if(this.selected.length>0) {
            //             this.selected.splice(0, this.selected.length);
            //         }
            //         this.selected.push(newi);
            //         this._update_change('modify');
            //     }

        }
    }
</script>
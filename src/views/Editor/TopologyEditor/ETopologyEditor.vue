<template>
    <div class="d-flex">
        <div :style="{height:`calc(100vh - ${top_height}px)`, width: '100%', 'overflow-y': 'auto'}" ref="__intf_list">
            <e-linking-editor :map="map" />
        </div>
        <div v-if="dlg_opt.type">
            <e-select-dlg v-if="dlg_opt.type==='select'" @result="do_select_devs" :dialog="dlg_opt.type"
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
        mounted: async function () {
            await this._reset_doc(this.active_doc_id);
            this.$emit('active', this._get_ieditor());
        },
        beforeDestroy: function () {
            this._save_docstate();
        },
        data() {
            return {
                doc_id: null,
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
            active_doc_id: function () {
                let ac = this.$store.state.Editor.active;
                return (ac && ac.kind===cfg.kind) ? ac.id : null;
            },
            proj_id: function () {
                return this.$store.state.proj.id;
            },
        },
        watch: {
            active_doc_id: async function (nid) {
                await this._save_docstate(this.doc_id);
                this._reset_doc(nid);
                this._update_state();
            },
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
            _save_docstate: function () {
                if(!this.doc_id) {
                    return;
                }
                let s = {
                    selected: this.selected,
                }
                this.$store.commit('Editor/put_doc_state', {id: this.doc_id, doc_state: s});
            },
            _load_docstate: function() {
                if(!this.doc_id) {
                    return;
                }
                let s = this.$store.getters['Editor/get_doc_state'](this.doc_id);
                if (s) {
                    this.selected = s.selected;
                } else {
                    this.selected = null;
                }
            },
            async _save_doc() {
                let content = topo_map.create_dbcontent(this.raw_devs, this.map);
                content.binds = this.content.binds;
                this.content = content;
                await db.update('src', {
                    id: this.doc_id,
                    content,
                    kind: cfg.kind
                });
                api.projdb_changed(this.proj_id);
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
            _update_bydb(db_devs, bus_links, pp_links) {
                if (db_devs) {
                    for (const db_dev of db_devs) {
                        let dev = this.raw_devs.find(it => (it.id === db_dev.id || it.name === db_dev.name));
                        if (dev) {
                            dev.kind = db_dev.kind || 'none';
                            dev.pos = db_dev.pos;
                        }
                    }
                }
                this.map = topo_map.create_map_bydb(this.raw_devs, bus_links, pp_links);
            },
            async _reset_doc(id, reset_state = false) {
                this.doc_id = id;
                if(!id) {
                    return;
                }
                this.redoundo = redoundo.get_ru(id);
                if (reset_state) {
                    this.redoundo.reset();
                    this.selected = null;
                } else {
                    this._load_docstate();
                }
                await this._load_rawdata();
                let doc = await db.get('src', id);
                if (!doc) {
                    await db.insert('src', {
                        id,
                        content: {
                            devs: [],
                            bus_links: [],
                            pp_links: [],
                            binds: {}
                        },
                        kind: cfg.kind
                    });
                    api.projdb_changed(this.proj_id);
                    doc = await db.get('src', id);
                }
                this.content = doc.content;
                this._update_bydb(this.content.devs, this.content.bus_links, this.content.pp_links);
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
                return dis;
            },
            _update_state: function() {
                let s = this._get_state();
                this.$store.commit('Editor/set_state_disbar', s);
            },
            action_select_dev() {
                this.dlg_opt.type = 'select';
            },
            do_select_devs(res) {
                this.dlg_opt.type = null;
                if (res.result !== 'ok') {
                    return;
                }
                for (const item of res.value) {
                    let raw_item = this.raw_devs.find(it => it.id === item.id);
                    raw_item.kind = item.kind;
                    if (item.kind === 'none') {
                        raw_item.pos = null;
                    }
                }
                this.map = topo_map.create_map_byold(this.raw_devs, this.map);
                this._save_doc();
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
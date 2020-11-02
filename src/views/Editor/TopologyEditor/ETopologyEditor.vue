<template>
    <div class="d-flex">
        <v-card color="grey darken-2" :style="{height:`calc(100vh - ${top_height}px)`, width: '100%', 'overflow-y': 'auto'}" id="editor_div">
            <e-linking-editor v-if="map" :map="map" :line_type="line_types[content.line_type_idx||0]" :scale="map_state.scale" :left="map_state.left" :top="map_state.top"
            @changed="on_changed" @moved="on_moved" />
        </v-card>
        <div v-if="dlg_opt.type">
            <e-select-dlg v-if="dlg_opt.type==='select'" @result="do_select_devs" :dialog="dlg_opt.type"
                :items="raw_devs" />
        </div>
    </div>
</template>

<script>
    import shortid from 'shortid';
    import api from '../../../api/client/';
    import topo_map from '../../../utility/topo_map';
    import cfg from './config';
    import tman from '../../../utility/tree_man';
    import db from '../../../doc/workerdb';
    import redoundo from '../../../doc/redoundo';
    import ELinkingEditor from './ELinkingEditor'

    const line_types = ['Straight','StateMachine', 'Bezier',  'Flowchart'];

    export default {
        props: ['top_height'],
        components: {
            'e-linking-editor': ELinkingEditor,
            'e-select-dlg': () => import( /* webpackChunkName: "eselectdevdlg" */ './EDlgSelectDev'),
        },
        mounted: async function () {
            await this._reset_doc(this.active_doc_id);
            this.$emit('active', this._get_ieditor());
            setTimeout(() => {this.scale=1}, 1)
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
                redoundo: null,
                map_state: {
                    scale: 1,
                    top: 0,
                    left: 0,
                    line_type_idx: 0,
                },
                dlg_opt: {
                    type: null,
                    title: '',
                    data: null,
                    tag: null,
                },
                line_types: line_types
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
                await this._reset_doc(nid);
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
                        if (fn) {
                            return fn();
                        } else {
                            console.log('TODO', ac)
                        }
                    }
                }
            },
            _save_docstate: function () {
                if(!this.doc_id) {
                    return;
                }
                this.$store.commit('Editor/put_doc_state', {id: this.doc_id, doc_state: this.map_state});
            },
            _load_docstate: function() {
                if(!this.doc_id) {
                    return;
                }
                this.map_state  = this.$store.getters['Editor/get_doc_state'](this.doc_id) || {scale: 1, top: 0, left: 0};
            },
            async _save_doc(ignore_undo=false) {
                let content = topo_map.create_content(this.map);
                content.binds = this.content.binds;
                content.line_type_idx = this.content.line_type_idx;
                this.content = content;
                if(!ignore_undo) {
                    this.redoundo.pushChange(this.content, this.map_state);
                }
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
                let rdevs = [];
                fdevs.forEach(async (fdev) => {
                    let dev = fdev[1];
                    let od = await db.get('src', dev.id);
                    rdevs.push({
                        id: dev.id,
                        name: dev.name,
                        memo: dev.memo,
                        kind: 'none',
                        conns: ((od && od.content) ? od.content : []).map(c => {
                            return {
                                id: c.id,
                                name: c.name,
                                kind: c.kind,
                                memo: c.memo
                            }
                        })
                    })
                });
                this.raw_devs = rdevs;
            },
            _create_map_bydb(db_devs, buses, bus_links, pp_links) {
                if (db_devs) {
                    for (const db_dev of db_devs) {
                        let dev = this.raw_devs.find(it => (it.id === db_dev.id || it.name === db_dev.name));
                        if (dev) {
                            dev.kind = db_dev.kind || 'none';
                            dev.pos = db_dev.pos;
                        }
                    }
                }
                return topo_map.create_map_bycontent(this.raw_devs, buses, bus_links, pp_links);
            },
            async _reset_doc(id, reset_state=false) {
                let self = this;
                this.doc_id = id;
                if(!id) {
                    return;
                }
                this.map = null;
                this.redoundo = redoundo.get_ru(id);
                if(reset_state) {
                    this.redoundo.reset();
                    this.selected = [];
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
                            buses: [],
                            bus_links: [],
                            pp_links: [],
                            binds: {}
                        },
                        kind: cfg.kind
                    });
                    api.projdb_changed(this.proj_id);
                    doc = await db.get('src', id);
                    setTimeout(() => {
                        self.dlg_opt.type='select';
                    }, 200);
                }
                this.content = doc.content;
                this._refresh_size();
                let map = this._create_map_bydb(this.content.devs, this.content.buses, this.content.bus_links, this.content.pp_links);
                this.$nextTick(() => {
                    self.map = map;
                });

                if (this.redoundo.isEmpty) {
                    this.redoundo.pushChange(this.content, this.selected);
                }
            },
            _get_state: function () {
                let dis = {
                    zoom_big: this.map_state.scale>1.99,
                    zoom_small: this.map_state.scale<0.21,
                    undo: this.redoundo.undoCount===0,
                    redo: this.redoundo.redoCount===0,
                    binding: true, //TODO
                }
                return dis;
            },
            _update_state: function() {
                let s = this._get_state();
                this.$store.commit('Editor/set_state_disbar', s);
            },
            _refresh_size() {
                let el = document.getElementById("editor_div");
                if(!el) {
                    return;
                }
                topo_map.set_container_width(el.offsetWidth, el.offsetHeight);

            },
            _update_map() {
                let map = this.map;
                this.map = null;
                this.$nextTick(() => {
                    this.map = map;
                });
            },
            on_changed() {
                this._save_doc();
                this._update_state();
            },
            on_moved(pos) {
                this.map_state.left = pos.left;
                this.map_state.top = pos.top;
                this._update_state();
            },
            action_select_dev() {
                this.dlg_opt.type = 'select';
            },
            action_link_type() {
                this.content.line_type_idx = this.content.line_type_idx || 0;
                this.content.line_type_idx++;
                if(this.content.line_type_idx>line_types.length) {
                    this.content.line_type_idx = 0;
                }
                this._save_doc();
                this._update_map();
            },
            action_zoom_big() {
                this.map_state.scale += 0.2;
                if(this.map_state.scale>2) {
                    this.map_state.scale = 2;
                }
            },
            action_zoom_small() {
                this.map_state.scale -= 0.2;
                if(this.map_state.scale<0.2) {
                    this.map_state.scale = 0.2;
                }
            },
            action_zoom_fit() {
                this.map_state.scale = 1;
                this.map_state.top = 0;
                this.map_state.left = 0;
                if(this.map) {
                    topo_map.adjust(this.map);
                    this._save_doc(true);
                    this._update_map();
                }
            },
            action_new_bus() {
                topo_map.add_bus(this.map, shortid.generate());
                this.on_changed();
                this._update_map();
            },
            action_redo: function() {
                let ov = this.redoundo.popRedo();
                this.content = ov.doc;
                this.map = null;
                let map = this._create_map_bydb(this.content.devs, this.content.buses, this.content.bus_links, this.content.pp_links);
                let self = this;
                this.$nextTick(() => {
                    self.map = map;
                    self._save_doc(true);
                });
            },
            action_undo: function() {
                let ov = this.redoundo.popUndo();
                this.content = ov.doc;
                this.map = null;
                let map = this._create_map_bydb(this.content.devs, this.content.buses, this.content.bus_links, this.content.pp_links);
                let self = this;
                this.$nextTick(() => {
                    self.map = map;
                    self._save_doc(true);
                });
            },
            action_binding() {
                this._update_map();
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
                this._refresh_size();
                this.map = topo_map.create_map_byold(this.raw_devs, this.map);
                this._save_doc();
                this._update_map();
            },
        }
    }
</script>
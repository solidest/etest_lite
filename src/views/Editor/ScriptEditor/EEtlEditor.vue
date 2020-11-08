<template>
    <div class="d-flex">
        <v-sheet color="grey darken-2" :style="{height:`calc(100vh - ${top_height}px)`, width: '100%', 'overflow-y': 'auto'}" id="editor_div">
            
        </v-sheet>
        <e-refby :top_height="top_height" />
    </div>
</template>

<script>
    import cfg from './config';
    import ERefby from './ERefby';

    export default {
        props: ['top_height'],
        components: {
            'e-refby': ERefby,
            // 'e-select-dlg': () => import( /* webpackChunkName: "eselectdevdlg" */ './EDlgSelectDev'),
            // 'e-binding-dlg': () => import( /* webpackChunkName: "ebindingdlg" */ './EDlgBinding'),
            // 'e-etl-dlg': () => import( /* webpackChunkName: "eetldlg" */ '../../Dialog/EDlgETL'),
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
                kind: cfg.kind,
                doc_id: null,
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
                // if(!this.doc_id) {
                //     return;
                // }
                // this.$store.commit('Editor/put_doc_state', {id: this.doc_id, doc_state: this.map_state});
            },
            _load_docstate: function() {
                // if(!this.doc_id) {
                //     return;
                // }
                // this.map_state = this.$store.getters['Editor/get_doc_state'](this.doc_id) || {scale: 1, top: 0, left: 0};
            },
            async _reset_doc(id, reset_state=false) {
                console.log(id, reset_state);
                // let self = this;
                // this.doc_id = id;
                // if(!id) {
                //     return;
                // }
                // this.map = null;
                // this.redoundo = redoundo.get_ru(id);
                // if(reset_state) {
                //     this.redoundo.reset();
                //     this.selected = [];
                // } else {
                //     this._load_docstate();
                // }
                // await this._load_rawdata();
                // let doc = await db.get('src', id);
                // if (!doc) {
                //     await db.insert('src', {
                //         id,
                //         content: {
                //             devs: [],
                //             buses: [],
                //             bus_links: [],
                //             pp_links: [],
                //             binds: []
                //         },
                //         kind: cfg.kind
                //     });
                //     api.projdb_changed(this.proj_id);
                //     doc = await db.get('src', id);
                //     setTimeout(() => {
                //         self.dlg_opt.type='select';
                //     }, 200);
                // }
                // this.content = doc.content;
                // this._refresh_size();
                // let map = this._create_map_bydb(this.content.devs, this.content.buses, this.content.bus_links, this.content.pp_links);
                // this.$nextTick(() => {
                //     self.map = map;
                // });

                // if (this.redoundo.isEmpty) {
                //     this.redoundo.pushChange(this.content, this.selected);
                // }
            },
            _get_state: function () {
                let dis = {
                    // zoom_big: this.map_state.scale>1.99,
                    // zoom_small: this.map_state.scale<0.21,
                    // undo: this.redoundo.undoCount===0,
                    // redo: this.redoundo.redoCount===0,
                }
                return dis;
            },
        }
    }
</script>
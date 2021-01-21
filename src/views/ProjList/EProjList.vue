<template>
  <v-container fluid>
    <v-toolbar dense class="mb-1">
      <v-text-field dense class="mx-2" v-model="search" clearable flat solo-inverted hide-details
        prepend-inner-icon="mdi-folder-search-outline" label="搜索"></v-text-field>
      <v-select dense class="mx-2" v-model="sort_by" flat solo-inverted hide-details :items="sort_keys"
        prepend-inner-icon="mdi-sort" label="排序"></v-select>
      <v-btn-toggle dense class="mx-2" v-model="sort_desc" mandatory>
        <v-btn depressed :value="false">
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <v-btn depressed :value="true">
          <v-icon>mdi-arrow-down</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-spacer></v-spacer>
      <span class="grey--text">{{`版本: ${version}`}}</span>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="on_import">
        <v-icon left>mdi-import</v-icon>导入
      </v-btn>
      <v-btn color="primary" class="ml-2" @click="dlg='create'">
        <v-icon left>mdi-plus-thick</v-icon>新建
      </v-btn>
    </v-toolbar>
    <div style="height: calc(100vh - 126px);  overflow-y:auto">
      <v-data-iterator :items="projs" :search="search" :sort-by="sort_by" :sort-desc="sort_desc" hide-default-footer
        no-data-text="暂时还没有项目" no-results-text="没有找到匹配的项目" disable-pagination>
        <template v-slot:header>
        </template>
        <template v-slot:default="props">
          <v-row>
            <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
              <v-card :loading="item.$proj.id===doing_id" flat outlined>
                <v-card-title class="subheading font-weight-bold blue--text" style="cursor: pointer"
                  @click.stop="open_proj(item.$proj)">
                  {{item.name}}
                </v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-item v-for="(h, index) in headers" :key="index" dense class="py-0 my-0">
                    <v-list-item-content class="grey--text py-0 my-0">
                      {{ `${h.text}: ${item[h.value]}` }}
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-toolbar flat dense>
                  <v-spacer />
                  <v-tooltip bottom open-delay="300">
                    <template v-slot:activator="{ on }">
                      <v-btn class="mx-2" v-on="on" small icon @click="update_item=item;dlg='update'">
                        <v-icon color="grey">mdi-pencil-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>修改</span>
                  </v-tooltip>
                  <v-tooltip bottom open-delay="300">
                    <template v-slot:activator="{ on }">
                      <v-btn class="mx-2" v-on="on" small icon @click="on_open_inwin(item.$proj)">
                        <v-icon color="grey">mdi-folder-multiple-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>在新窗口打开</span>
                  </v-tooltip>
                  <v-tooltip bottom open-delay="300">
                    <template v-slot:activator="{ on }">
                      <v-btn class="mx-2" v-on="on" small icon @click="on_export(item.$proj)">
                        <v-icon color="grey">mdi-export</v-icon>
                      </v-btn>
                    </template>
                    <span>导出项目</span>
                  </v-tooltip>
                  <v-tooltip bottom open-delay="300">
                    <template v-slot:activator="{ on }">
                      <v-btn class="mx-2" v-on="on" small icon @click="update_item=item; dlg='remove'">
                        <v-icon color="grey">mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>删除项目</span>
                  </v-tooltip>
                </v-toolbar>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
      <div v-if="dlg">
        <e-dlg-confirm v-if="dlg==='remove'" :dialog="dlg" title="删除确认" :text="'确定要删除项目【'+ update_item.name+'】吗？'"
          @result="on_remove" />
        <e-dlg-input v-else-if="dlg==='create'" :dialog="dlg" title="新建项目" label="项目名称" placeholder="请输入新项目名称"
          :need_memo="true" @result="on_create" />
        <e-dlg-input v-else-if="dlg==='update'" :dialog="dlg" title="修改项目信息" label="项目名称" :value="update_item.name"
          :memo="update_item.memo" placeholder="请输入新项目名称" :need_memo="true" @result="on_update" />
      </div>
    </div>
  </v-container>
</template>

<script>
  import cfg from './config';
  import mcfg from '../config';
  import pkg from '../../../package.json';
  import ver from '../../doc/version';
  import helper from '../../utility/helper';
  import proj_db from '../../doc/workerdb';
  import api from '../../api/client/';
  import wf from '../../utility/web_file';

  export default {
    components: {
      'e-dlg-input': () => import( /* webpackChunkName: "e-dlg-input" */ '../Dialog/EDlgInput'),
      'e-dlg-confirm': () => import( /* webpackChunkName: "e-dlg-confirm" */ '../Dialog/EDlgConfirm'),
    },

    mounted: async function () {
      let self = this;
      api.projdb_list().then((res) => {
        self.load_data(res);
      }).catch(err => {
        self.$store.commit('setMsgError', err.message);
      })
    },

    data: () => ({
      search: '',
      version: mcfg.version_map[pkg.version] || '2.0',
      projs: [],
      dlg: null,
      doing_id: null,
      sort_keys: cfg.sort_keys,
      headers: cfg.headers,
      update_item: null,
    }),

    computed: {
      opened_projid: function () {
        let proj = this.$store.state.proj;
        return proj ? proj.id : null;
      },
      sort_by: {
        get: function () {
          return this.$store.state.ProjList.sort_by;
        },
        set: function (v) {
          return this.$store.commit('ProjList/set_sort_by', v);
        }
      },
      sort_desc: {
        get: function () {
          return this.$store.state.ProjList.sort_desc;
        },
        set: function (v) {
          return this.$store.commit('ProjList/set_sort_desc', v);
        }
      }
    },

    methods: {
      on_create: async function (res) {
        this.dlg = null;
        if (res.result !== 'ok') {
          return;
        }
        let name = (res.value || '').trim();
        if (!name || !helper.check_name(name)) {
          return this.$store.commit('setMsgError', `项目名称【${name}】无效`);
        }
        if (this.projs.find(p => p.name === name)) {
          return this.$store.commit('setMsgError', `项目【${name}】已经存在`);
        }
        let proj = await api.projdb_create(res.value, res.memo);
        this.open_proj(proj);
      },

      on_update: function (res) {
        this.dlg = null;
        if (res.result !== 'ok') {
          return;
        }
        let name = (res.value || '').trim();
        if (!name || !helper.check_name(name)) {
          return this.$store.commit('setMsgError', `项目名称【${name}】无效`);
        }
        if (this.projs.find(p => (p.name === name && p.id !== this.update_item.id))) {
          return this.$store.commit('setMsgError', `项目【${name}】已经存在`);
        }
        this.update_item.name = res.value;
        this.update_item.memo = res.memo;
        this.update_item.$proj.name = res.value;
        this.update_item.$proj.memo = res.memo;
        if (this.opened_projid === this.update_item.$proj.id) {
          this.$store.state.proj.name = res.value;
        }
        api.projdb_udpate(this.update_item.$proj);
      },

      on_remove: function (res) {
        this.dlg = null;
        if (res.result != 'ok') {
          return;
        }
        let proj = this.update_item.$proj;
        if (this.opened_projid === proj.id) {
          this._doopen_proj(null);
        }
        var req = indexedDB.deleteDatabase(`etestdev_${proj.id}.db`);
        let self = this;
        let it = self.update_item;
        req.onsuccess = async function () {
          await api.projdb_remove(proj.id);
          let idx = self.projs.findIndex(i => i === it);
          if (idx < 0) {
            console.error('ERR2');
            return;
          }
          self.projs.splice(idx, 1);
        };
        req.onerror = function (err) {
          console.error('INDEXEDDB ERROR', err.message);
        };
        req.onblocked = function () {
          console.error('LOCKED');
        };
      },

      load_data: function (proj_list) {
        if (!proj_list) {
          this.projs = [];
          return;
        }
        this.projs = proj_list.map(d => {
          return {
            id: d.id,
            name: d.name,
            memo: d.memo,
            created: d.created,
            updated: d.updated,
            count: d.count,
            result: d.result,
            screated: helper.date_fmt("YYYY-mm-dd HH:MM", new Date(d.created)),
            supdated: helper.date_fmt("YYYY-mm-dd HH:MM", new Date(d.updated)),
            scount: d.count || 0,
            sresult: d.result ? (Math.floor(d.result * 100) + '%') : '',
            $proj: d,
          }
        });
      },

      _doopen_proj: function (proj) {
        this.$store.commit('setProj', proj);
        this.$store.commit('Editor/reset');
        api.project_bind(proj ? proj.id : null);
        if (proj) {
          this.$router.push({
            name: 'SrcTree'
          });
        }
      },

      on_open_inwin: async function (proj) {
        if (!this.opened_projid || proj.id === this.opened_projid) {
          return this._doopen_proj(proj);
        }
        if (await api.project_tryopen(proj.id)) {
          return;
        }
        api.project_open(proj.id);
        this.doing_id = proj.id;
        let self = this;
        setTimeout(() => {
          self.doing_id = null;
        }, 3000);
      },

      open_proj: async function (proj) {
        if (!proj || proj.id === this.opened_projid) {
          return this._doopen_proj(proj);
        }
        if (await api.project_tryopen(proj.id)) {
          return;
        }
        await proj_db.close();
        await proj_db.open(proj.id, mcfg.proj_colls);
        let res = await ver.check_proj();
        if (res !== 'ok') {
          this.$store.commit('setMsgError', res);
          return this._doopen_proj(null);
        }
        return this._doopen_proj(proj);
      },

      on_export: function (proj) {
        wf.save_json(proj, proj.name);
        console.log('TODO export');
      },
      on_import: async function () {
        let res = await wf.open_json();
        console.log('TODO import', res);
      },
    }

  }
</script>
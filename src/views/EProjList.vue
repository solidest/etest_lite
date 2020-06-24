<template>
  <v-container fluid>
    <v-data-iterator :items="projs" :search="search" :sort-by="sortBy" :sort-desc="sortDesc" hide-default-footer
      no-data-text="暂时还没有项目" disable-pagination>
      <template v-slot:header>
        <v-toolbar class="mb-1">
          <v-text-field v-model="search" clearable flat solo-inverted hide-details
            prepend-inner-icon="mdi-folder-search-outline" label="搜索"></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select v-model="sortBy" flat solo-inverted hide-details :items="sortKeys" prepend-inner-icon="mdi-sort"
              label="排序"></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn large depressed :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn large depressed :value="true">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
            <v-card :loading="item===doing_item">
              <v-card-title class="subheading font-weight-bold blue--text">
                <v-edit-dialog @save="save_name">
                  <span style="cursor: pointer" @click.stop="open(item)">
                    {{item.name}}
                  </span>
                  <v-btn small icon class="mx-1" @click="editing_proj=item; editing_name=item.name;">
                    <v-icon small color="grey">mdi-pencil-outline</v-icon>
                  </v-btn>
                  <template v-slot:input>
                    <v-text-field v-model="editing_name" label="修改项目名称" single-line>
                    </v-text-field>
                  </template>
                </v-edit-dialog>
                <v-spacer />
                <v-tooltip right open-delay="1500">
                    <template v-slot:activator="{ on }">
                      <v-btn class="mx-2" v-on="on" small icon @click="open_win(item)">
                        <v-icon color="grey">mdi-folder-multiple-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>在新窗口打开</span>
                </v-tooltip>
                <v-tooltip right open-delay="1500">
                    <template v-slot:activator="{ on }">
                      <v-btn class="mx-2" v-on="on" small icon @click="proj_export(item)">
                        <v-icon color="grey">mdi-export</v-icon>
                      </v-btn>
                    </template>
                    <span>导出项目</span>
                </v-tooltip>
                <v-tooltip right open-delay="1500">
                    <template v-slot:activator="{ on }">
                      <v-btn class="mx-2" v-on="on" small icon @click="remove(item)">
                        <v-icon color="grey">mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>删除项目</span>
                </v-tooltip>
              </v-card-title>
              <v-divider></v-divider>
              <v-list dense>
                <v-list-item v-for="(h, index) in headers" :key="index" dense>
                  <v-list-item-content class="grey--text">
                    {{ h.text }}:
                  </v-list-item-content>
                  <v-list-item-content class="align-end grey--text">
                    {{ item[h.value] }}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
    <confirm-dlg v-if="dlg==='remove'" :dialog="remove_proj" title="删除确认" :text="'确定要删除项目【'+ remove_proj.name+'】吗？'"
      @closed="remove_result" />
  </v-container>
</template>

<script>
  import ipc from '../feature/r_ipc';
  import helper from '../feature/r_helper';

  export default {
    components: {
      'confirm-dlg': () => import( /* webpackChunkName: "confirmdlg" */ '../dialog/ConfirmDlg'),
    },

    data() {
      return {
        sortBy: 'updated',
        search: '',
        sortDesc: true,
        projs: [],
        editing_proj: null,
        editing_name: null,
        remove_proj: null,
        dlg: null,
        doing_item: null,
        headers: [{
            text: '创建时间',
            value: 'screated'
          },
          {
            text: '修改时间',
            value: 'supdated'
          },
          {
            text: '用例总数',
            value: 'scount'
          },
          {
            text: '执行结果',
            value: 'sresult'
          },
        ],
        sortKeys: [{
            text: '修改时间',
            value: 'updated'
          },
          {
            text: '名称',
            value: 'name'
          },
          {
            text: '创建时间',
            value: 'created'
          },
          {
            text: '用例总数',
            value: 'count'
          },
          {
            text: '执行结果',
            value: 'result'
          },
        ]
      }
    },

    mounted: function () {
      let self = this;
      ipc.list_proj().then((res) => {
        self.update(res);
      });
    },

    methods: {
      update: function (data) {
        this.projs = [];
        if (!data) {
          return;
        }
        let projs = [];
        for (let d of data) {
          let p = {}
          p.name = d.name;
          p.created = d.created;
          p.created = d.updated;
          p.created = d.count;
          p.created = d.result;
          p.screated = helper.date_fmt("YYYY-mm-dd HH:MM", new Date(d.created));
          p.supdated = helper.date_fmt("YYYY-mm-dd HH:MM", new Date(d.updated));
          p.scount = d.count || 0;
          p.sresult = d.result ? (Math.floor(d.result * 100) + '%') : '';
          p.data = d;
          delete data.count;
          delete data.result;
          projs.push(p);
        }
        this.projs = projs;
      },
      open: async function (proj) {
        let gp = this.$store.state.proj;
        if(gp && gp.id === proj.data.id) {
          this.$router.push({
            name: 'TestCase'
          });
          return;
        }
        let res = await ipc.active_proj(proj.data.id);
        if(!res) {
          this.$store.commit('setProj', proj.data);
          this.$router.push({
            name: 'TestCase'
          });
        }
      },
      open_win: async function (proj) {
        let gp = this.$store.state.proj;
        if(!gp || proj.data.id === gp.id) {
            return this.open(proj);
        }
        let res = await ipc.active_proj(proj.data.id);
        if(!res) {
          ipc.open_proj(proj.data.id);
          this.doing_item = proj;
          let self = this;
          setTimeout(()=>{
            self.doing_item = null;
          }, 2000);
        }
      },
      remove: function (proj) {
        this.remove_proj = proj;
        this.dlg = 'remove';
      },
      remove_result: function (res) {
        this.dlg = null;
        let self = this;
        let id = this.remove_proj.data.id;
        if (res.result != 'ok') {
          return;
        }
        let doc = {
          id: id
        };
        ipc.remove_proj(doc).then(() => {
          let idx = self.projs.findIndex(it => it.data.id === id);
          self.projs.splice(idx, 1);
          let selp = this.$store.state.proj;
          if (selp && selp.id == id) {
            this.$store.commit('setProj', null);
          }
          this.remove_proj_id = null;
        });
      },
      proj_export: function (proj) {
        console.log('TODO proj_export', proj)
      },
      save_name: function () {
        let n = this.editing_name;
        if (!n) {
          return;
        }
        n = n.trim();
        if (!n || n === this.editing_proj.name) {
          return;
        }
        let self = this;
        let proj = this.editing_proj.data;
        helper.check_proj_newname(n).then((r) => {
          if (r !== 'ok') {
            self.$store.commit('setMsgError', r);
          } else {
            let np = JSON.parse(JSON.stringify(proj));
            np.name = n;
            ipc.update_proj(np).then(() => {
              proj.name = n;
              self.editing_proj.name = n;
              let selp = self.$store.state.proj;
              if (selp && selp.id == proj.id) {
                selp.name = np.name;
              }
            });
          }
        });
      },
    }

  }
</script>
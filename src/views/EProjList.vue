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
            <v-card>
              <v-card-title class="subheading font-weight-bold blue--text">
                <span style="cursor: pointer" @click="open(item)">
                  {{item.name}}
                </span>
                <v-spacer />
                <v-btn small icon class="mx-1" @click="rename(item)">
                  <v-icon small color="grey">mdi-pencil-outline</v-icon>
                </v-btn>
                <v-btn small icon class="mx-1" @click="proj_export(item)">
                  <v-icon small color="grey">mdi-export</v-icon>
                </v-btn>
                <v-btn small icon class="mx-1" @click="remove(item)">
                  <v-icon small color="grey">mdi-delete-outline</v-icon>
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-list dense>
                <v-list-item v-for="(h, index) in headers" :key="index" dense>
                  <v-list-item-content class="grey--text">
                    {{ h.text }}:
                  </v-list-item-content>
                  <v-list-item-content class="align-end grey--text">
                    {{ item.$s[h.value] }}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>

    <input-one v-if="dlg==='rename' && proj" :dialog="proj" title="输入新的项目名称" label="新项目名称" :default="proj.name"
        @closed="rename_result" />
    <confirm-dlg v-if="dlg==='remove'" :dialog="proj" title="删除确认" :text="'确定要删除项目【'+proj.name+'】吗？'"
        @closed="remove_result" />
  </v-container>
</template>

<script>
  import ipc from '../feature/r_ipc';
  import helper from '../feature/r_helper';

  export default {
    components: {
      'input-one': () => import( /* webpackChunkName: "inputonedlg" */ '../dialog/InputOne'),
      'confirm-dlg': () => import( /* webpackChunkName: "confirmdlg" */ '../dialog/ConfirmDlg'),
    },

    data() {
      return {
        sortBy: 'updated',
        search: '',
        sortDesc: true,
        projs: [],
        proj: null,
        dlg: null,
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
        this.projs = data;
        if (!data) {
          return;
        }
        for (let d of data) {
          let $s = {}
          $s.screated = helper.date_fmt("YYYY-mm-dd HH:MM", new Date(d.created));
          $s.supdated = helper.date_fmt("YYYY-mm-dd HH:MM", new Date(d.updated));
          $s.scount = d.count || 0;
          $s.sresult = d.result ? (Math.floor(d.result * 100) + '%') : '';
          d.$s =$s;
        }
      },
      open: function(proj) {
        this.$store.commit('setProj', proj);
        this.$router.push({ name: 'Empty'});
      },
      rename: function(proj) {
        this.proj = proj;
        this.dlg = 'rename';
      },
      rename_result: function(res) {
        this.dlg = null;
        if(res.result !='ok' || res.value.trim() === this.proj.name) {
          return;
        }
        let self = this;
        helper.check_proj_newname(res.value).then((r) =>{
          if(r !== 'ok') {
              self.$store.commit('setMsgError', r);
          } else {
            let np = JSON.parse(JSON.stringify(self.proj));
            np.name = res.value.trim();
            delete np.$s;
            ipc.update_proj(np).then(() => {
              self.proj.name = np.name;
              let selp = self.$store.state.proj;
              if(selp && selp.id == self.proj.id) {
                selp.name = np.name;
              }
            });
          }
        });
      },
      remove: function(proj) {
        this.proj = proj;
        this.dlg = 'remove';
      },
      remove_result: function(res) {
        this.dlg = null;
        if(res.result !='ok') {
          return;
        }
        let self = this;
        let doc = {id: this.proj.id};
        ipc.remove_proj(doc).then(() => {
          let idx = self.projs.findIndex(it => it === this.proj);
          self.projs.splice(idx, 1);
          let selp = this.$store.state.proj;
          if(selp && selp.id == this.proj.id) {
            this.$store.commit('setProj', null);
          }
          this.proj = null;
        });
      },
      proj_export: function(proj) {
        console.log('TODO proj_export', proj)
      },
    }

  }
</script>
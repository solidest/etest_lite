<template>
  <v-container fluid>
    <v-toolbar class="mb-1">
      <v-text-field class="mx-2" v-model="search" clearable flat solo-inverted hide-details
        prepend-inner-icon="mdi-folder-search-outline" label="搜索"></v-text-field>
      <v-select class="mx-2" v-model="sortBy" flat solo-inverted hide-details :items="sort_keys"
        prepend-inner-icon="mdi-sort" label="排序"></v-select>
      <v-btn-toggle class="mx-2" v-model="sortDesc" mandatory>
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
      <v-btn large color='grey darken-3' @click="dlg='create'">
        <v-icon left>mdi-plus-thick</v-icon>新建
      </v-btn>
    </v-toolbar>
    <div style="height: calc(100vh - 126px);  overflow-y:auto">
      <v-data-iterator :items="projs" :search="search" :sort-by="sortBy" :sort-desc="sortDesc" hide-default-footer
        no-data-text="暂时还没有项目" no-results-text="没有找到匹配的项目" disable-pagination>
        <template v-slot:header>
        </template>
        <template v-slot:default="props">
          <v-row>
            <v-col v-for="item in props.items" :key="item.name" cols="12" sm="6" md="4" lg="3">
              <v-card :loading="item===doing_item">
                <v-card-title class="subheading font-weight-bold blue--text" style="cursor: pointer"
                  @click.stop="open_proj(item)">
                  {{item.name}}
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
                <v-toolbar flat dense>
                  <v-spacer />
                  <v-tooltip bottom open-delay="300">
                    <template v-slot:activator="{ on }">
                      <v-btn class="mx-2" v-on="on" small icon @click="edit_win(item)">
                        <v-icon color="grey">mdi-pencil-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>修改</span>
                  </v-tooltip>
                  <v-tooltip bottom open-delay="300">
                    <template v-slot:activator="{ on }">
                      <v-btn class="mx-2" v-on="on" small icon @click="open_win(item)">
                        <v-icon color="grey">mdi-folder-multiple-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>在新窗口打开</span>
                  </v-tooltip>
                  <v-tooltip bottom open-delay="300">
                    <template v-slot:activator="{ on }">
                      <v-btn class="mx-2" v-on="on" small icon @click="proj_export(item)">
                        <v-icon color="grey">mdi-export</v-icon>
                      </v-btn>
                    </template>
                    <span>导出项目</span>
                  </v-tooltip>
                  <v-tooltip bottom open-delay="300">
                    <template v-slot:activator="{ on }">
                      <v-btn class="mx-2" v-on="on" small icon @click="remove(item)">
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
        <e-confirm-dlg v-if="dlg==='remove'" :dialog="dlg" title="删除确认" :text="'确定要删除项目【'+ remove_proj.name+'】吗？'"
          @closed="remove_result" />
        <e-input-dlg v-else-if="dlg==='create'" :dialog="dlg" title="新建项目" label="项目名称" placeholder="请输入新项目名称"
          :need_memo="true" @result="on_create" />
      </div>
    </div>
  </v-container>
</template>

<script>
  import pkg from '../../../package.json';
  import helper from '../Utility/helper';
  import cfg from './config';

  export default {
    components: {
      'e-input-dlg': () => import( /* webpackChunkName: "e-input-dlg" */ '../Dialog/EInputDlg'),
      'e-confirm-dlg': () => import( /* webpackChunkName: "e-confirm-dlg" */ '../Dialog/EConfirmDlg'),
    },

    mounted: function () {
      let data = [];
      for (let index = 0; index < 20; index++) {
        data.push({
          id: index,
          name: '项目名称xxxx' + index,
          created: Date.now(),
          updated: Date.now(),
        })
      }
      this.load_data(data);
    },


    data: () => ({
      sortBy: 'updated',
      search: '',
      sortDesc: true,
      version: pkg.version,
      projs: [],
      dlg: null,
      doing_item: null,
      sort_keys: cfg.sort_keys,
      headers: cfg.headers,
    }),

    methods: {
      on_create: function (res) {
        this.dlg = null;
        console.log(res);
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
          }
        });
      },
      open_proj: function (proj) {
        if (proj.id) {
          this.$store.commit('setProj', {});
        }
      }
    }

  }
</script>
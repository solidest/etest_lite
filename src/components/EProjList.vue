<template>

      <v-card raised width="800">
        <v-data-table hide-default-footer single-select no-data-text="<暂无数据>" :items-per-page="itemsPerPage"
          :headers="headers" :items="projlist" :page="page">

          <template v-slot:top>
            <v-toolbar flat color="cyan darken-2" dark>
              <v-toolbar-title>项目列表</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn class="mx-2" small dark fab color="white" @click="impproj">
                <v-icon color="black">mdi-import</v-icon>
              </v-btn>
              <v-btn class="mx-2" small dark fab color="white" @click="create">
                <v-icon color="black">mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.name="{ item }">
            <div :style="{cursor:item.deleted?'default':'pointer', display:'inline-block'}"
              @click="dev(item.id, item.name)">
              <v-icon color="primary">mdi-folder-outline</v-icon>
              <span class="pl-1 primary--text">
                {{item.name}}
              </span>
            </div>
          </template>

          <template v-slot:item.action="{ item }">
            <div style="display:inline-block">
              <v-tooltip top open-delay=500>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-3" v-on="on" @click.stop="rename(item)">
                    mdi-textbox
                  </v-icon>
                </template>
                <span>修改名称</span>
              </v-tooltip>
              <v-tooltip top open-delay=500>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-3" v-on="on" @click.stop="remove(item)">
                    mdi-trash-can-outline
                  </v-icon>
                </template>
                <span>删除</span>
              </v-tooltip>
              <v-tooltip top open-delay=500>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-3" v-on="on" @click.stop="expproj(item)">
                    mdi-export
                  </v-icon>
                </template>
                <span>导出</span>
              </v-tooltip>
              <v-tooltip top open-delay=500>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-3" v-on="on" @click.stop="report(item.id, item.name)">
                    mdi-file-table-box-multiple-outline
                  </v-icon>
                </template>
                <span>查看报告</span>
              </v-tooltip>
              <v-tooltip top open-delay=500>
                <template v-slot:activator="{ on }">
                  <v-icon small class="mr-3" v-on="on" @click.stop="run(item.id, item.name)">
                    mdi-play
                  </v-icon>
                </template>
                <span>执行</span>
              </v-tooltip>
            </div>
          </template>

          <template v-slot:footer v-if="projlist">
            <v-row class="mt-2" align="center" justify="center">
              <v-spacer />
              <span class="mr-1 grey--text">
                第{{ page }}页（共{{ numberOfPages }}页）项目总数：{{projlist.length}}
              </span>
              <v-btn icon class="mr-3" @click="formerPage" :disabled="page===1">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn icon class="mr-6" @click="nextPage" :disabled="page===numberOfPages">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </v-row>
          </template>

        </v-data-table>
      </v-card>
</template>

<script>

  export default {

    mounted: function () {
      
    },

    data() {
      return {
        projlist: [],
        itemsPerPage: 8,
        page: 1,
        headers: [{
            text: '项目',
            align: 'left',
            value: 'name'
          },
          {
            text: '创建时间',
            value: 'created'
          },
          {
            text: '最后修改',
            value: 'updated'
          },
          {
            text: '操作',
            sortable: false,
            value: 'action'
          }
        ]

      }
    },

    computed: {
      numberOfPages() {
        return Math.ceil(this.projlist.length / this.itemsPerPage)
      },
    },

    methods: {

      //下一页
      nextPage() {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },

      //上一页
      formerPage() {
        if (this.page - 1 >= 1) this.page -= 1
      },

      // //刷新数据
      // refresh: function () {
      //   let self = this;
      //   self.$store.dispatch('list_proj')
      //     .then(res => {
      //       let projs = res.projs || [];
      //       let n = Date.now();
      //       for (let p of projs) {
      //         if (p.make_info && p.make_info.maked > 0) {
      //           p.maked = format_diff(n, p.make_info.maked);
      //         } else {
      //           p.maked = '';
      //         }
      //         p.updated = format_diff(n, p.updated);
      //         p.created = format_diff(n, p.created);
      //       }
      //       self.projlist = projs;
      //     })
      // },

      // //打开项目
      // dev: function (id, name) {
      //   this.$router.push({
      //     name: 'dev',
      //     query: {
      //       id: id,
      //       name: name
      //     }
      //   });
      // },

      // //导入导出项目
      // impproj: function () {
      //   let exp = new ExpImpProject(config.proj_type, config.doc_version, this);
      //   exp.impProj(this.emitImpProj);
      // },
      // emitImpProj: function (res) {
      //   if (res.result !== 'ok') {
      //     this.$store.commit('setMsgError', res.result);
      //   } else {
      //     this.$store.commit('setMsgSuccess', '导入成功');
      //   }
      //   this.refresh();
      // },
      // emitNewProj: async function(name) {
      //     let d = await this.$store.dispatch('create_proj', {name:name});
      //     return d.id
      // },
      // emitNewDevTree: async function(id, tree) {
      //     await this.$store.dispatch('import_devtree', {id:id, tree: tree});
      // },
      // emitNewFileDoc: async function(id, ftype, doc) {
      //     await this.$store.dispatch('save_filedoc', {$ftype: ftype, id: id, doc:doc, ignoreUpdate: true});
      // },


      // expproj: function (item) {
      //   let exp = new ExpImpProject(config.proj_type, config.doc_version, this);
      //   exp.downloadProject(item);
      // },

      // emitDevTree: async function (proj_id) {
      //   let res = await this.$store.dispatch('load_devtree', proj_id);
      //   return res.tree;
      // },
      // emitFileDoc: async function (file_item) {
      //   let res = await this.$store.dispatch('load_filedoc', {
      //     type: file_item.type,
      //     id: file_item.id
      //   });
      //   return res.doc;
      // },


      // //执行项目
      // run: function (id, name) {
      //   this.$router.push({
      //     name: 'run',
      //     query: {
      //       id: id,
      //       name: name
      //     }
      //   });
      // },

      // //查看报告
      // report: function (id, name) {
      //   this.$router.push({
      //     name: 'report',
      //     query: {
      //       id: id,
      //       name: name
      //     }
      //   });
      // },

      // //创建项目
      // create: function () {
      //   this.dlg.type = 'create';
      //   this.dlg.title = '新建项目';
      //   this.dlg.label = '请输入项目名称';
      // },

      // create_result: function (r) {
      //   if (r.result === 'ok') {
      //     let self = this;
      //     let data = {
      //       name: r.value
      //     };
      //     self.$store.dispatch('create_proj', data)
      //       .then(d => {
      //         if (d) {
      //           self.dev(d.id, r.value);
      //         }
      //       });
      //   }
      //   this.dlg.type = null;
      // },

      // //重命名
      // rename: function (item) {
      //   this.dlg.type = 'rename';
      //   this.dlg.title = '重命名';
      //   this.dlg.value = item.name;
      //   this.dlg.label = '请输入新的项目名称';
      //   this.dlg.tag = item;
      // },

      // rename_result: function (r) {
      //   if (r.result === 'ok') {
      //     let self = this;
      //     let item = self.dlg.tag;
      //     let data = {
      //       action: 'rename',
      //       id: item.id,
      //       name: r.value
      //     }
      //     self.$store.dispatch('edit_proj', data)
      //       .then(d => {
      //         if (d) {
      //           item.name = r.value;
      //         }
      //       });
      //   }
      //   this.dlg.type = null;
      // },

      // //删除
      // remove: function (item) {
      //   this.dlg.type = 'remove';
      //   this.dlg.tag = item;
      // },
      // remove_result: function (r) {
      //   if (r.result === 'ok') {
      //     let self = this;
      //     self.$store.dispatch('remove_proj', self.dlg.tag.id)
      //       .then(res => {
      //         if (res) {
      //           self.refresh();
      //         }
      //       });
      //   }
      //   this.dlg.type = null;
      // },

    }
  }
</script>
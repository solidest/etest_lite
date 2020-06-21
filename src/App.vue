<template>
  <v-app>
    <e-sys-bar />
    <v-navigation-drawer permanent :width="width">
      <v-row class="fill-height" no-gutters>
        <v-navigation-drawer mini-variant mini-variant-width="80" permanent>
          <v-list dense nav>
            <v-list-item v-for="item in pages" :key="item.key" @click="onClick(item)">
              <v-list-item-action>
                <v-tooltip right open-delay="1500">
                  <template v-slot:activator="{ on }">
                    <v-icon large v-on="on" :color="page===item ? 'white':'grey'">{{ item.icon }}</v-icon>
                  </template>
                  <span>{{item.title}}</span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-spacer />
        </v-navigation-drawer>
        <e-file-editor v-if="show_file_editor" :title="page.title" :kind="page.kind" :editor="page.editor" />
      </v-row>
    </v-navigation-drawer>
    <v-main>
    </v-main>
  </v-app>
</template>
<style>
  ::-webkit-scrollbar {
    display: none;
  }
</style>
<script>
  import ESysBar from './components/ESysBar';
  import EFileEditor from './components/EFileEditor';

  const show_ = 360;
  const hide_= 80;

  const pages_ = [{
    icon: 'mdi-file-multiple-outline',
    title: '测试用例',
    key: 'testcase'
  }, {
    icon: 'mdi-chart-bell-curve',
    title: '监控页面',
    key: 'page'
  }, {
    icon: 'mdi-comment-edit-outline',
    title: '通信协议',
    key: 'protocol'
  }, {
    icon: 'mdi-developer-board',
    title: '设备接口',
    key: 'device'
  }, {
    icon: 'mdi-link-variant',
    title: '连接拓扑',
    key: 'topology'
  }, {
    icon: 'mdi-tools',
    title: '调试助手',
    key: 'assistant'
  }, {
    icon: 'mdi-view-list',
    title: '项目管理',
    key: 'project'
  }];

  export default {
    name: 'App',

    components: {
      'e-sys-bar': ESysBar,
      'e-file-editor': EFileEditor,
    },

    data: () => ({
      pages: pages_,
      page: pages_[0],
      width: show_,
      show_file_editor: true,
    }),

    methods: {
      onClick: function (page) {
        if(this.page === page) {
          this.width = this.width===show_ ? hide_ : show_;
        } else {
          this.page = page;
          if(this.width === hide_) {
            this.width = show_;
          }
        }
        if(this.width === hide_) {
          this.show_file_editor = false;
        } else {
          let self = this;
          setTimeout(() => {
            self.show_file_editor = true;
          }, 200)
        }
      }
    }
  };
</script>
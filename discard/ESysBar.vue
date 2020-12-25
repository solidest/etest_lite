<template>
  <div v-resize="onResize">
    <v-system-bar window dark id="app_bar" app>
      <v-icon>mdi-ember</v-icon>
      <span class="nodrag">{{header}}</span>
      <v-spacer></v-spacer>
      <span class="nodrag">{{title}}</span>
      <v-spacer></v-spacer>
      <v-icon class="nodrag" @click.stop="onMin">mdi-minus</v-icon>
      <v-icon class="nodrag" @click.stop="onMax">{{is_max ? 'mdi-checkbox-multiple-blank-outline':'mdi-checkbox-blank-outline'}}</v-icon>
      <v-icon class="nodrag" @click.stop="onClose">mdi-close</v-icon>
    </v-system-bar>
  </div>
</template>
<style>
  #app_bar {
    -webkit-app-region: drag;
    -webkit-user-select: none;
  }
  .nodrag {
    -webkit-app-region: no-drag;
  }
</style>
<script>

const { ipcRenderer, remote  } = window.require('electron')

export default {
    props: ['header', 'stop_run'],
    data: () => {
        return {
            is_max: false,
        }
    },

    computed: {
      title: function() {
        let proj = this.$store.state.proj;
        let doc = this.$store.state.Editor.active;
        if(!proj && !doc) {
          return 'www.kiyun.com';
        }
        return `${proj ? proj.name : ''}${doc ? ' - ' + doc.name : ''}`;
      }
    },

    methods: {
        onResize: function() {
            let self = this;
            this.$nextTick(() => {
                self.is_max = remote.getCurrentWindow().isMaximized();
            });
        },
        onMax: function() {
            let window = remote.getCurrentWindow()
            if(window.isMaximized()) {
                window.unmaximize();
            } else {
                window.maximize();
            }
        },
        onMin: function() {
            let window = remote.getCurrentWindow();
            window.minimize();
        },
        onClose: function() {
          ipcRenderer.send('close-win');
        }
    }

}
</script>

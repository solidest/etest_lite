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
  }
  .nodrag {
    -webkit-app-region: no-drag;
  }
</style>
<script>

const { ipcRenderer, remote  } = window.require('electron')

export default {
    props: ['header'],
    data: () => {
        return {
            is_max: false,
        }
    },

    computed: {
      title: function() {
        let proj = this.$store.state.proj;
        return proj ? proj.name : 'www.kiyun.com';
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
                // window.setFullScreen(true);
            }
        },
        onMin: function() {
            let window = remote.getCurrentWindow();
            window.minimize();
        },
        onClose: function() {
          ipcRenderer.send('close-win', this.$store.state.winid||1);
        }
    }

}
</script>

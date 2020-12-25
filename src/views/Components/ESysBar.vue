<template>
  <div v-resize="onResize">
    <v-system-bar window dark id="app_bar" app>
      <v-icon>mdi-ember</v-icon>
      <span class="noselect">{{header}}</span>
      <v-spacer></v-spacer>
      <span class="noselect">{{title}}</span>
      <v-spacer></v-spacer>
      <v-icon class="nodrag" @click.stop="onHelp">mdi-help</v-icon>
      <v-icon class="nodrag" @click.stop="onMin">mdi-minus</v-icon>
      <v-icon class="nodrag" @click.stop="onMax">
        {{is_max ? 'mdi-checkbox-multiple-blank-outline':'mdi-checkbox-blank-outline'}}</v-icon>
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

  .noselect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
</style>
<script>
  const { ipcRenderer } = window.require('electron')

  import api from '../../api/client/';
  import proj_db from '../../doc/workerdb';

  export default {
    props: ['header', 'stop_run'],
    data: () => {
      return {
        is_max: false,
      }
    },

    computed: {
      title: function () {
        let proj = this.$store.state.proj;
        let doc = this.$store.state.Editor.active;
        if (!proj && !doc) {
          return 'www.kiyun.com';
        }
        return `${proj ? proj.name : ''}${doc ? ' - ' + doc.name : ''}`;
      }
    },

    methods: {
      onResize: function () {
        let self = this;
        this.$nextTick(async () => {
          self.is_max = await ipcRenderer.invoke('win_ismax');
        });
      },
      onMax: function () {
        ipcRenderer.send('win_max');
      },
      onMin: function () {
        ipcRenderer.send('win_min');
      },
      onClose: async function () {
        await proj_db.close();
        api.win_close();
      },
      onHelp: function() {

      }
    }

  }
</script>
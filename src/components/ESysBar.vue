<template>
  <div>
    <v-system-bar window dark id="app_bar">
      <v-icon>mdi-message</v-icon>
      <span>ETest Lite</span>
      <v-spacer></v-spacer>
      <v-icon class="nodrag">mdi-minus</v-icon>
      <v-icon class="nodrag">mdi-checkbox-blank-outline</v-icon>
      <v-icon class="nodrag">mdi-close</v-icon>
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

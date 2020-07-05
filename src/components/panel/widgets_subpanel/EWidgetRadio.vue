<template>
    <v-radio-group class="pa-0 ma-0" v-model="value" :label="config.label">
      <v-radio v-for="(item, idx) in config.items" :key="idx" :label="item.text" :value="item.value" color="grey lighten-3"></v-radio>
    </v-radio-group>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
    }
</script>
<template>
    <v-select class="pa-0 ma-0" :label="config.label" v-model="value" :items="config.items" hide-details></v-select>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
    }
</script>
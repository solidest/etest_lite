<template>
    <v-select class="pa-0 ma-0" :label="config.label" v-model="value" :items="config.items" hide-details  no-data-text="<空>"></v-select>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
    }
</script>
<template>
    <v-checkbox class="pa-0 ma-0" :label="config.label" v-model="value" color="grey lighten-3" hide-details>
    </v-checkbox>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
    }
</script>
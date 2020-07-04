<template>
    <v-checkbox class="pa-0 ma-0" :label="config.label" v-model="value" hide-details>
    </v-checkbox>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
    }
</script>
<template>
    <v-switch class="pa-0 ma-0 no-drag" :label="config.label" v-model="value" hide-details>
    </v-switch>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
    }
</script>
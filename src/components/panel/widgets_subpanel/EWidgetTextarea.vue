<template>
    <v-textarea class="pa-0 ma-0" v-model="value" :label="config.label" :rows="config.rows" 
        no-resize outlined dense :placeholder="config.placeholder" hide-details>
    </v-textarea>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
    }
</script>
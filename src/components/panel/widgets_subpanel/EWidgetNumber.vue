<template>
    <v-text-field class="pa-0 ma-0" v-model="value" type="number" :label="config.label" 
        :placeholder="config.placeholder" hide-details >
    </v-text-field>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
    }
</script>
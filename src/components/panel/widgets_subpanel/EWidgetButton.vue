<template>
    <v-btn class="py-0 px-3 ma-0" block hide-details outlined>
        {{config.label}}
    </v-btn>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
    }
</script>
<template>
    <v-card-text class="subtitle-1 pa-0 ma-0">
        <span v-if="config.label" style="color:#BDBDBD">{{config.label}}</span>
        <span >{{value}}</span>
    </v-card-text>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
    }
</script>
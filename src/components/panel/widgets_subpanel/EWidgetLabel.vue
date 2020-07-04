<template>
    <v-card-text class="subtitle-1 pa-0 ma-0" v-text="text"></v-card-text>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
        computed: {
            text: function () {
                let title = this.config.label || '';
                return title + (this.value||'');
            }
        },
    }
</script>
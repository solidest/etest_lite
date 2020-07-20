<template>
    <v-btn class="py-0 px-3 ma-0" block hide-details outlined @click="onClick">
        {{config.label}}
    </v-btn>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
        methods: {
            onClick: function() {
                if(this.config && this.config.command) {
                    this.$emit('command', this.config.command)
                }
            }
        }
    }
</script>
<template>
    <v-switch class="pa-0 ma-0 no-drag" color="white" :label="config.label" v-model="value_" hide-details inset>
    </v-switch>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
        computed: {
            value_: {
                set: function(v) {
                    this.value = v ? 1 : 0;
                },
                get: function() {
                    return this.value === 1;
                }
            }
        }
    }
</script>
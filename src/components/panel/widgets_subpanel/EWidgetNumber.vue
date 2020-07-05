<template>
    <v-text-field class="pa-0 ma-0" v-model="value_" type="number" :label="config.label" 
        :placeholder="config.placeholder" hide-details >
    </v-text-field>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
        
        computed: {
            value_: {
                get: function () {
                    return this.value;
                },
                set: function(v) {
                    this.value = Number(v);
                }
            },
        },
    }
</script>
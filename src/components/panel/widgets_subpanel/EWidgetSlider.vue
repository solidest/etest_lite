<template>
    <v-slider class="pa-0 ma-0" :label="config.label" v-model="value" :max="max" :min="min" hide-details>
    </v-slider>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
        computed: {
            max: function() {
                if(this.config.max===undefined || this.config.max===null) {
                    return 100;
                }
                return this.config.max;
            },
            min: function() {
                if(this.config.min===undefined || this.config.min===null) {
                    return 0;
                }
                return this.config.min;
            }
        }
    }
</script>
<template>
    <v-checkbox :label="config.label"  v-model="value_" dense hide-details @change="on_changed" class="pa-0 ma-0">
    </v-checkbox>
</template>
<script>
    export default {
        props: ['config', 'model'],
        mounted: function() {
            this.value_ = this.model[this.config.name];
        },
        data: () => ({
            value_: false,
        }),
        watch: {
            model: function(m) {
                this.value_ = m[this.config.name];
            }
        },
        methods: {
            on_changed: function(v) {
                this.$emit('changed', this.config.name, v);
            }
        }
    }
</script>
<template>
    <v-combobox :label="config.label" v-model="value_" :items="config.items" dense hide-details
        :menu-props="{ maxHeight: 700}" @change="on_changed"></v-combobox>
</template>
<script>
    export default {
        props: ['config', 'model'],
        mounted: function () {
            this.value_ = this.model[this.config.name];
        },
        data: () => ({
            value_: null,
        }),
        watch: {
            model: function (m) {
                this.value_ = m[this.config.name];
            }
        },
        methods: {
            on_changed: function (v) {
                this.$emit('changed', this.config.name, v);
            }
        }
    }
</script>
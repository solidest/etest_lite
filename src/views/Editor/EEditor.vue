<template>
    <e-title-man :items="titles" />
</template>
<script>
    import ETitleMan from './ETitleMan'
    export default {
        props: ['items'],
        components: {
            'e-title-man': ETitleMan,
        },
        computed: {
            titles: function () {
                return [{
                    icon: 'mdi-file',
                    name: 'file1'
                }, {
                    icon: 'mdi-file',
                    name: 'file2'
                }]
            }
        }

    }
</script>
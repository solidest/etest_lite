<template>
    <v-card :width="width" height="100%" tile>
        <e-mini-bar :items="bar_items" :title="title" />
        <div style="height: calc(100vh - 90px);  overflow-y:auto">
            <e-list :items="items"> </e-list>
        </div>
    </v-card>
</template>

<script>
    import EMiniBar from './widgets/EMiniBar';
    import EList from './widgets/EList';

    export default {
        props: ['title', 'catalog', 'width'],
        components: {
            'e-mini-bar': EMiniBar,
            'e-list': EList,
        },

        mounted: function () {
            this.updateBarState(null);
            let self = this;
            this.$nextTick(() => {
                self.$on('action', (a) => {
                    self.onAction(a);
                }); 
            })
        },

        data: () => {
            return {
                selected: null,
                bar_items: [{
                    text: '新建文件',
                    value: 'new_file',
                    icon: 'mdi-file-plus-outline'
                }, {
                    text: '修改名称',
                    value: 'rename',
                    icon: 'mdi-pencil'
                }, {
                    text: '删除选中项',
                    value: 'remvoe',
                    icon: 'mdi-delete-outline'
                }],
                items: []
            }
        },

        computed: {
            proj: function () {
                return this.$store.state.proj;
            },
        },

        methods: {
            onAction: function (a) {
                console.log(a)
            },
        }
    }
</script>
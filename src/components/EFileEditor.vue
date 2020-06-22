<template>
    <v-card :width="width" height="100%" tile>
        <e-file-bar :title="page.title" :selected="selected" :allow_newdir="page && page.kind=='tree'" :readonly="!page || page.kind==='items'" />
        <v-list shaped dense>
            <v-list-item-group color="primary">
                <v-list-item v-for="(item, i) in items" :key="i">
                    <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-card>
</template>

<script>
    import EFileBar from './widgets/EFileBar';

    export default {
        props: ['page', 'width'],
        components: {
            'e-file-bar': EFileBar,
        },

        data: () => {
            return {
                selected: null,
                items: [{
                    text: "ttttt",
                    key: "aaaa1"
                }, {
                    text: "ttttt",
                    key: "aaaa2"
                }, {
                    text: "ttttt",
                    key: "aaaa3"
                }, {
                    text: "ttttt",
                    key: "aaaa4"
                },{
                    text: "ttttt",
                    key: "aaaa1"
                }, {
                    text: "ttttt",
                    key: "aaaa2"
                }, {
                    text: "ttttt",
                    key: "aaaa3"
                }, {
                    text: "ttttt",
                    key: "aaaa4"
                },{
                    text: "ttttt",
                    key: "aaaa1"
                }, {
                    text: "ttttt",
                    key: "aaaa2"
                }, {
                    text: "ttttt",
                    key: "aaaa3"
                }, {
                    text: "ttttt",
                    key: "aaaa4"
                },{
                    text: "ttttt",
                    key: "aaaa1"
                }, {
                    text: "ttttt",
                    key: "aaaa2"
                }, {
                    text: "ttttt",
                    key: "aaaa3"
                }, {
                    text: "ttttt",
                    key: "aaaa4"
                }, {
                    text: "ttttt",
                    key: "aaaa3"
                }, {
                    text: "ttttt",
                    key: "aaaa4"
                }]
            }
        }
    }
</script>
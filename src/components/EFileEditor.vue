<template>
    <v-card width="278" height="100%" tile>
        <v-toolbar dense>
            <span class="text--secondary">{{title}}</span>
            <v-spacer></v-spacer>
            <v-tooltip right open-delay="1500">
                <template v-slot:activator="{ on }">
                    <v-btn icon small v-on="on">
                        <v-icon small color="grey lighten-1">mdi-file-plus-outline</v-icon>
                    </v-btn>
                </template>
                <span>新增</span>
            </v-tooltip>
            <v-tooltip right open-delay="1500">
                <template v-slot:activator="{ on }">
                    <v-btn icon small v-on="on">
                        <v-icon small color="grey lighten-1">mdi-folder-plus-outline</v-icon>
                    </v-btn>
                </template>
                <span>新增目录</span>
            </v-tooltip>
            <v-tooltip right open-delay="1500">
                <template v-slot:activator="{ on }">
                    <v-btn icon small v-on="on">
                        <v-icon small color="grey lighten-1">mdi-pencil</v-icon>
                    </v-btn>
                </template>
                <span>重命名</span>
            </v-tooltip>
            <v-tooltip right open-delay="1500">
                <template v-slot:activator="{ on }">
                    <v-btn icon small v-on="on">
                        <v-icon small color="grey lighten-1">mdi-delete-outline</v-icon>
                    </v-btn>
                </template>
                <span>删除</span>
            </v-tooltip>
        </v-toolbar>
        <v-list shaped dense>
            <v-list-item-group v-model="item" color="primary">
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
    export default {
        props: ['title', 'kind', 'editor'],
        data: () => {
            return {
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
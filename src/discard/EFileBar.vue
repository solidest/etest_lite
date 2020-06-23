<template>
    <v-toolbar dense>
        <span class="text--secondary">{{title}}</span>
        <v-spacer></v-spacer>
        <v-tooltip v-if="!readonly && allow_newdir" right open-delay="1500">
            <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="emit('new_dir')" class="mx-1">
                    <v-icon color="grey lighten-1">mdi-folder-plus-outline</v-icon>
                </v-btn>
            </template>
            <span>新增目录</span>
        </v-tooltip>
        <v-tooltip v-if="!readonly && allow_newdir" right open-delay="1500">
            <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="emit('new_file')" class="mx-1">
                    <v-icon color="grey lighten-1">mdi-vector-polyline-plus</v-icon>
                </v-btn>
            </template>
            <span>新增模型</span>
        </v-tooltip>
        <v-tooltip v-if="!readonly" right open-delay="1500">
            <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="emit('new_file')" class="mx-1">
                    <v-icon color="grey lighten-1">mdi-file-plus-outline</v-icon>
                </v-btn>
            </template>
            <span>新增项</span>
        </v-tooltip>
        <v-tooltip v-if="!readonly" right open-delay="1500">
            <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="emit('new_file')" class="mx-1">
                    <v-icon color="grey lighten-1">mdi-database-search</v-icon>
                </v-btn>
            </template>
            <span>从历史项目导入</span>
        </v-tooltip>
        <v-tooltip v-if="!readonly" right open-delay="1500">
            <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="emit('rename')" :disabled="!selected" class="mx-1">
                    <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                </v-btn>
            </template>
            <span>重命名</span>
        </v-tooltip>
        <v-tooltip v-if="!readonly" right open-delay="1500">
            <template v-slot:activator="{ on }">
                <v-btn icon small v-on="on" @click="emit('delete')" :disabled="!selected" class="mx-1">
                    <v-icon color="grey lighten-1">mdi-delete-outline</v-icon>
                </v-btn>
            </template>
            <span>删除</span>
        </v-tooltip>
    </v-toolbar>
</template>

<script>
    export default {
        props: ['title', 'allow_newdir', 'selected', 'readonly'],
        methods: {
            emit: function (key) {
                this.$emit(key);
            }
        }
    }
</script>
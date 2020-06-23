
const cfg = {
    pages: [{
        icon: 'mdi-file-multiple-outline',
        title: '测试用例',
        catalog: 'program',
        type: 'tree',
    }, {
        icon: 'mdi-chart-bell-curve',
        title: '监控页面',
        catalog: 'page',
        type: 'list',
    }, {
        icon: 'mdi-comment-processing-outline',
        title: '通信协议',
        catalog: 'protocol',
        type: 'list',
    }, {
        icon: 'mdi-developer-board',
        title: '设备接口',
        catalog: 'device',
        type: 'list',
    }, {
        icon: 'mdi-link-variant',
        title: '连接拓扑',
        catalog: 'topology',
        type: 'list',
    }, {
        icon: 'mdi-tools',
        title: '工具箱',
        catalog: 'tools',
        type: 'items'
    }, {
        icon: 'mdi-cog-outline',
        title: '项目设置',
        catalog: 'project',
        type: 'items'
    }],
    list_bars: [{
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

    // <v-tooltip v-if="!readonly && allow_newdir" right open-delay="1500">
    //         <template v-slot:activator="{ on }">
    //             <v-btn icon small v-on="on" @click="emit('new_dir')" class="mx-1">
    //                 <v-icon color="grey lighten-1">mdi-folder-plus-outline</v-icon>
    //             </v-btn>
    //         </template>
    //         <span>新增目录</span>
    //     </v-tooltip>
    //     <v-tooltip v-if="!readonly && allow_newdir" right open-delay="1500">
    //         <template v-slot:activator="{ on }">
    //             <v-btn icon small v-on="on" @click="emit('new_file')" class="mx-1">
    //                 <v-icon color="grey lighten-1">mdi-vector-polyline-plus</v-icon>
    //             </v-btn>
    //         </template>
    //         <span>新增模型</span>
    //     </v-tooltip>
    tree_bars: [{
        text: '新建目录',
        value: 'new_dir',
        disabled: false,
        icon: 'mdi-folder-plus-outline',
    }, {
        text: '新建模型',
        value: 'new_model',
        disabled: false,
        icon: 'mdi-vector-polyline-plus'
    }, {
        text: '新建动作序列',
        value: 'new_actions',
        disabled: false,
        icon: 'mdi-playlist-plus'
    }, {
        text: '新建脚本',
        value: 'new_file',
        disabled: false,
        icon: 'mdi-file-plus-outline'
    }, {
        text: '修改名称',
        value: 'rename',
        disabled: false,
        icon: 'mdi-pencil'
    }, {
        text: '删除选中项',
        value: 'remvoe',
        disabled: false,
        icon: 'mdi-delete-outline'
    }],
}
export default cfg

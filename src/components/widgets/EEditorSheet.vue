<template>
    <v-sheet tile class="mx-auto pa-2" :max-width="max_width?max_width:null" :width="width?width:null">
        <v-row>
            <v-col v-if="title" cols=12 class="pa-1">
                <v-card-title class="ma-1 pa-0">{{title}}</v-card-title>
            </v-col>
            <v-col v-for="(wed, idx) in widgets" :key="idx" :cols="(!wed.visual || wed.visual(data)) ? wed.cols: 0"
                class="pa-1">
                <v-text-field v-if="(wed.type==='number'||wed.type==='text') && (!wed.visual || wed.visual(data))"
                    :label="hide_name?wed.label:`${wed.label}-${wed.name}`" v-model="data[wed.name]"
                    :disabled="wed.disabled && wed.disabled(data)" class="ma-1" dense hide-details :type="wed.type"
                    outlined>
                </v-text-field>
                <v-select v-else-if="wed.type==='select' && (!wed.visual || wed.visual(data)) " no-data-text="<空>"
                    :label="hide_name?wed.label:`${wed.label}-${wed.name}`" v-model="data[wed.name]" :items="wed.items"
                    class="ma-1" dense hide-details filled outlined :menu-props="{ maxHeight: 700}"></v-select>
                <v-combobox v-else-if="wed.type==='combobox' && (!wed.visual || wed.visual(data))"
                    :label="hide_name?wed.label:`${wed.label}-${wed.name}`" v-model="data[wed.name]" :items="wed.items"
                    class="ma-1" dense hide-details filled outlined :menu-props="{ maxHeight: 700}"></v-combobox>
                <v-checkbox v-else-if="wed.type==='checkbox' && (!wed.visual || wed.visual(data))"
                    :label="hide_name?wed.label:`${wed.label}(${wed.name})`" v-model="data[wed.name]" class="ma-1" dense
                    hide-details>
                </v-checkbox>
                <div v-else-if="wed.type==='editor' && (!wed.visual || wed.visual(data)) ">
                    <span>{{wed.label}}</span>
                    <div style="width: 100%; height: 350px;">
                    <e-mini-editor :script="data[wed.name]" type="yaml" @change="(v) => data[wed.name]=v">
                    </e-mini-editor>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-sheet>
</template>
<script>
    import EMiniScriptEditor from '../EMiniScriptEditor';
    export default {
        props: ['data', 'widgets', 'hide_name', 'max_width', 'title', 'width' ],
        components: {
            'e-mini-editor': EMiniScriptEditor,
        },

    }
</script>
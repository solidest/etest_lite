<template>
    <v-sheet width="100%" height="100%" tile>
        <v-row class="pa-0 ma-0">
            <v-col v-if="title" class="pa-1" cols=12>
                <v-card-title class="pa-1">{{title}}</v-card-title>
            </v-col>
            <v-col v-for="(wed, idx) in items" :key="idx" :cols="wed.cols" class="pa-1">
                <v-card-text  class="pa-1 ma-1 body-1" v-if="wed.type==='label'" v-text="wed.label+(recorder[wed.record_key]||'')"></v-card-text>
                <v-select v-else-if="wed.type==='select'" :label="wed.label" v-model="commander[wed.command_key]" :items="wed.items"
                    class="pa-1 ma-1" hide-details filled :menu-props="{maxHeight: 700}"></v-select>
                <v-combobox v-else-if="wed.type==='combobox'" :label="wed.label" v-model="commander[wed.command_key]" :items="wed.items"
                    class="pa-1 ma-1" hide-details filled :menu-props="{maxHeight: 700}"></v-combobox>
                <v-checkbox v-else-if="wed.type==='checkbox'" :label="wed.label" v-model="commander[wed.command_key]" 
                    class="pa-1 ma-1" hide-details>
                </v-checkbox>
                <v-text-field v-else-if="(wed.type==='number'|| wed.type==='text') && (!wed.visual || wed.visual(commander))" :label="wed.label"
                    v-model="commander[wed.command_key]" :disabled="wed.disabled && wed.disabled(commander)"
                    class="pa-1 ma-1" hide-details :type="wed.type">
                </v-text-field>
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script>
    export default {
        props: ['title', 'items', 'recorder', 'commander'],
    }
</script>
<template>
    <v-sheet tile class="mx-auto" :max-width="max_width">
        <v-row>
            <v-col v-for="(wed, idx) in widgets" :key="idx" :cols="wed.cols" class="pa-1">
                <v-text-field v-if="wed.type==='number'||wed.type==='text'" :label="hide_name?wed.label:`${wed.label}-${wed.name}`" v-model="data[wed.name]"
                    class="ma-2" dense hide-details :type="wed.type" outlined>
                </v-text-field>
                <v-select v-else-if="wed.type==='select'" :label="hide_name?wed.label:`${wed.label}-${wed.name}`" v-model="data[wed.name]" :items="wed.items"
                    class="ma-2" dense hide-details filled outlined :menu-props="{ maxHeight: 700}"></v-select>
                <v-combobox v-else-if="wed.type==='combobox'" :label="hide_name?wed.label:`${wed.label}-${wed.name}`" v-model="data[wed.name]" :items="wed.items"
                    class="ma-2" dense hide-details filled outlined :menu-props="{ maxHeight: 700}"></v-combobox>
                <v-checkbox v-else-if="wed.type==='checkbox'" :label="hide_name?wed.label:`${wed.label}(${wed.name})`" v-model="data[wed.name]" 
                    class="ma-2" dense hide-details>
                </v-checkbox>
            </v-col>
        </v-row>
    </v-sheet>
</template>
<script>
    export default {
        props: ['data', 'widgets', 'hide_name', 'max_width'],

    }
</script>
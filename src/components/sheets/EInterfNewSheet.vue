<template>
    <v-sheet tile class="mx-auto" width="260">
        <v-row>
            <v-col cols="8" class = "pa-1 ">
                <v-select class="ma-2" dense hide-details :items="types" v-model="data.type" filled label="接口类型"
                    outlined :menu-props="{ maxHeight: 700}"></v-select>
            </v-col>
            <v-col cols="4" class = "pa-1">
                <v-text-field class="ma-2" dense hide-details label="数量" v-model="data.count" type="number"
                    outlined>
                </v-text-field>
            </v-col>
            <v-col cols="12" class = "pa-1">
                <v-text-field class="ma-2" dense hide-details label="接口名称" v-model="data.name" outlined>
                </v-text-field>
            </v-col>
        </v-row>
    </v-sheet>
</template>
<script>
    export default {
        props: ['data', 'types'],

    }
</script>
<template>
    <v-sheet class="d-flex flex-column" color="grey darken-3">
        <v-card-subtitle class="py-1">
            执行用例
            <v-btn fab icon small color="white">
                <v-icon small>mdi-plus-thick</v-icon>
            </v-btn>
        </v-card-subtitle>
        <v-divider />
        <div class="pa-2" :style="{height:`calc(100vh - ${top_height+48}px)`, width: '200px', 'overflow-y': 'auto'}">
            <v-chip-group column>
                <v-chip v-for="i in 30" :key="i" class="ma-1">
                    <v-avatar left>
                        <v-icon small>mdi-play</v-icon>
                    </v-avatar>
                    {{`run_id${i}`}}
                    <v-avatar right>
                        <v-icon small>mdi-pencil-outline</v-icon>
                    </v-avatar>
                    <v-avatar right class="ml-3">
                        <v-icon small>mdi-close</v-icon>
                    </v-avatar>
                </v-chip>
            </v-chip-group>
        </div>
    </v-sheet>
</template>
<script>
    export default {
        props: ['top_height'],

    }
</script>
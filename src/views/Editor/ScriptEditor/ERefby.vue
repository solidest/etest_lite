<template>
    <v-sheet class="d-flex flex-column" color="grey darken-3">
        <v-card-text class="ml-2 body-2 py-3">执行用例</v-card-text>
        <v-divider />
        <div :style="{height:`calc(100vh - ${top_height+46}px)`, width: '160px', 'overflow-y': 'auto'}">
            <v-chip-group column active-class="primary--text">
                <v-chip v-for="i in 20" :key="i" class="ma-1">
                    <v-avatar left>
                        <v-icon small>mdi-pencil-outline</v-icon>
                    </v-avatar>
                    {{`run_id${i}`}}
                    <v-avatar right>
                        <v-icon small>mdi-play</v-icon>
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
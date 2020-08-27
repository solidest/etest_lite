<template>
     <v-expansion-panel aria-expanded>
            <v-expansion-panel-header color="grey darken-3" class="py-0">
                <template v-slot:default="{open}">
                    <v-list-item class="pa-0">
                        <v-list-item-icon>
                            <v-icon>mdi-play-box-multiple-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>执行用例</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action v-if="open">
                            <div style="diplay: flex" class="pr-4">
                                <v-btn icon small class="mx-1" @click.stop>
                                    <v-icon color="grey lighten-1">mdi-file-plus-outline</v-icon>
                                </v-btn>
                                <v-btn icon small class="mx-1" @click.stop>
                                    <v-icon color="grey lighten-1">mdi-trash-can-outline</v-icon>
                                </v-btn>
                                <v-btn icon small  class="mx-1" @click.stop>
                                    <v-icon color="grey lighten-1">mdi-content-duplicate</v-icon>
                                </v-btn>
                            </div>
                        </v-list-item-action>
                    </v-list-item>
                </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content color="grey darken-3">
                TREE TREE TREE TREE TREE
            </v-expansion-panel-content>
        </v-expansion-panel>
</template>
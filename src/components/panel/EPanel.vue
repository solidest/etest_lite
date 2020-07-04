<template>
    <grid-layout :layout.sync="layout" :col-num="cfg.col_num" :row-height="cfg.row_height" :margin="cfg.margin"
        :is-draggable="design" :is-resizable="design" :is-mirrored="false" :use-css-transforms="false" 
        :style="{background: design ? '#424242' : null}">
        <grid-item v-for="item in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="item.id"
            @resized="resizedEvent" @moved="movedEvent" drag-ignore-from=".no-drag">
            <div :style="{ border: get_border(item), width: '100%', height: '100%'}" @click="on_click(item)">
                <e-widgets v-if="item.kind==='widgets'" :title="item.title" :items="item.items"
                    :recorder="recorder" :commander="commander" >
                </e-widgets>
            </div>
        </grid-item>
    </grid-layout>
</template>
<script>
    import VueGridLayout from 'vue-grid-layout';
    import EWidgets from './widgets_subpanel/ESubpanelWidgets'

    export default {
        props: ['layout', 'cfg', 'design', 'show_line', 'recorder', 'commander'],
        components: {
            'GridLayout': VueGridLayout.GridLayout,
            'GridItem': VueGridLayout.GridItem,
            'e-widgets': EWidgets,
        },
        data: () => {
            return {
                selected: null,
            }
        },
        methods: {
            resizedEvent: function () {
                this.$emit("change");
            },
            movedEvent: function () {
                this.$emit("change");
            },
            on_click(item) {
                this.selected = item;
                this.$emit("selected", item);
            },
            get_border: function (item) {
                if (!this.show_line) {
                    return '';
                }
                if (this.design && item === this.selected) {
                    return '1px solid #E0E0E0';
                } else {
                    return '1px solid grey';
                }
            }
        }
    }
</script>
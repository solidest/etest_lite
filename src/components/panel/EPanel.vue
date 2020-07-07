<template>
    <grid-layout :layout.sync="layout" :col-num="cfg.col_num" :row-height="cfg.row_height" :margin="cfg.margin"
        :is-draggable="design" :is-resizable="design" :is-mirrored="false" :use-css-transforms="false"
        :style="{background: design ? '#424242' : null}">
        <grid-item v-for="item in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="item.id"
            @resized="resizedEvent" @container-resized="containerResizedEvent" @moved="movedEvent"
            drag-ignore-from=".no-drag">
            <div :style="{ border: get_border(item), width: '100%', height: '100%'}" @click="on_click(item)">
                <e-widgets v-if="item.kind==='widgets'" :title="item.title" :items="item.items" :recorder="recorder"
                    :commander="commander">
                </e-widgets>
                <e-charts v-else-if="item.kind==='charts'" :title="item.title" :design="design" :id="item.id" :size="item.size" 
                    :items="item.items" :recorder="recorder">
                </e-charts>
            </div>
        </grid-item>
    </grid-layout>
</template>
<script>
    import VueGridLayout from 'vue-grid-layout';
    import EWidgets from './widgets_subpanel/ESubpanelWidgets'
    import ECharts from './charts_subpanel/ESubpanelCharts'

    export default {
        props: ['layout', 'cfg', 'design', 'show_line', 'recorder', 'commander'],
        components: {
            'GridLayout': VueGridLayout.GridLayout,
            'GridItem': VueGridLayout.GridItem,
            'e-widgets': EWidgets,
            'e-charts': ECharts,
        },
        data: () => {
            return {
                selected: null,
                size_list: {},
            }
        },
        methods: {
            resizedEvent: function (i, newH, newW, newHPx, newWPx) {
                let item = this.layout.find(it => it.i === i);
                this.$emit("change");
                if (item || item.kind === 'charts') {
                    item.size = {width: newWPx-2, height: newHPx-2};
                }
            },
            containerResizedEvent: function (i, newH, newW, newHPx, newWPx) {
                let item = this.layout.find(it => it.i === i);
                if (!item || item.kind !== 'charts') {
                    return;
                }
                item.size = {width: newWPx-2, height: newHPx-2};
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
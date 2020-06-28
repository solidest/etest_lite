<template>
    <div style="width:100%; height: 100%;" id="__topo">
    </div>
</template>
<script>
    import G6 from '@antv/g6';
    import h from '../feature/f_topo';
    import {
        debounce
    } from 'throttle-debounce';

    export default {
        mounted: function () {
            this.redraw = debounce(200, this.redraw_)
        },
        methods: {
            update: function (main, size, draw_data) {
                if(draw_data) {
                    this.draw_data = draw_data;
                } else {
                    this.draw_data = h.get_draw_data(main.devs, main.conns, main.mapping, main.linking, main.binding);
                }
                this.draw_size = size;
                this.redraw();
            },
            on_draged: function() {
                let edited_data = this.graph.save();
                this.$emit('save', edited_data);
            },
            redraw_: function () {
                if (!this.graph) {
                    this.graph = new G6.Graph({
                        container: '__topo',
                        width: this.draw_size.width,
                        height: this.draw_size.height,
                        fitCenter: true,
                        fitViewPadding: 20,
                        modes: {
                            default: ['drag-canvas', 'drag-node'],
                        },
                        nodeStateStyles: {
                            hover: {
                                fillOpacity: 0.8,
                            },
                            selected: {
                                lineWidth: 5,
                            },
                        },
                        defaultEdge: h.draw_line_style
                    });
                    this.graph.on('node:dragend', this.on_draged);
                    this.graph.data(this.draw_data);
                    this.graph.render();
                } else {
                    this.graph.changeSize(this.draw_size.width, this.draw_size.height)
                    this.graph.changeData(this.draw_data);
                    let edited_data = this.graph.save();
                    this.$emit('save', edited_data);
                }
            },
        }

    }
</script>
<template>
    <div style="width:100%; height: 100%;" id="__topo">
    </div>
</template>
<script>
    import G6 from '@antv/g6';
    import h from '../feature/f_topo_draw';

    export default {
        methods: {
            update: function (main, size, draw_data) {
                let dd = h.get_draw_data(main.devs, main.conns, main.mapping, main.linking, main.binding);
                this.draw_data = draw_data ? (h.merge_data(dd, draw_data)) : dd;
                this.draw_size = size;
                main.draw_data = this.redraw();
            },
            on_draged: function() {
                this.$emit('save', this.graph.save());
            },
            redraw: function () {
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
                }
                return this.graph.save();
            },
        }

    }
</script>
<template>
    <div style="width:100%; height: 100%;" id="__topo">
    </div>
</template>
<script>
import G6 from '@antv/g6';
import h from '../feature/h_topo';

export default {
    props: ['size'],
    data: () => {
        return {
            draw_size: {x: 100, y: 100},
            draw_data: {},
        }
    },
    watch: {
        size: function(n) {
            this.draw_size = n;
        },
        draw_size: function(n, o) {
            if(!n || (o && n.width==o.width && n.height==o.height)) {
                return;
            }
            this.resize(n)
        }
    },
    methods: {
        update: function(main) {
            this.draw_data = h.get_draw_data(main.devs, main.mapping, main.linking, main.binding);
            this.redraw();
            console.log('udpate')
        },
        create_graph: function(size) {
            this.graph = new G6.Graph({
                    container: '__topo',
                    width: size.width,
                    height: size.height,
                    fitCenter: true,
                    fitView: true,
                    fitViewPadding: 40,
                });
            this.graph.data(this.draw_data);
            this.graph.render();
            console.log('draw0')
        },
        redraw: function() {
            if(!this.graph) {
                if(!this.draw_size) {
                    return;
                }
                this.create_graph(this.draw_size);
            } else {
                this.graph.changeData(this.draw_data);
                this.graph.render();
                console.log('draw1')
            }
        },
        resize: function(size) {
            if(this.is_resize) {
                return;
            }
            if(!this.graph) {
                this.create_graph(size);
            } else {
                this.is_resize = true;
                let self = this;
                setTimeout(() => {
                    self.graph.changeSize(self.draw_size.width, self.draw_size.height);
                    self.graph.changeData(self.draw_data);
                    self.graph.render();
                    console.log('draw3')
                    self.is_resize = false;
                }, 100);                
            }

        }
    }

}
</script>
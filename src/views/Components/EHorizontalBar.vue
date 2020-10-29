<template>
    <div style="cursor:row-resize; height: 6px; background: #424242" @mousedown="on_mousedown">
        
    </div>
</template>

<script>
    export default {
        props: ['step', 'min', 'max', 'count'],
        mounted() {
            this.count_ = this.count;
        },
        data: () => {
            return {
                count_: -1,
                start_y: -1,
            }
        },
        methods: {
            on_move: function (client_y) {
                let dy = client_y - this.start_y;
                if (Math.abs(dy) >= this.step*0.8) {
                    let new_count = this.count_+ (dy>0?1:-1);
                    if(new_count<this.min || new_count>this.max) {
                        return;
                    }
                    this.$emit("resize", new_count);
                    this.count_ = new_count;
                    this.start_y = client_y;
                }
            },

            on_mousedown: function (e) {
                this.start_y = e.clientY;
                e.preventDefault();

                let self = this;
                document.onmousemove = ee => {
                    self.on_move(ee.clientY);
                };

                document.onmouseup = () => {
                    document.onmouseup = null;
                    document.onmousemove = null;
                };

            },
        }
    }
</script>
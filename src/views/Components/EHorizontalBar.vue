<template>
    <div style="cursor:row-resize; height: 6px; background: #424242" @mousedown="on_mousedown">
        
    </div>
</template>

<script>
    export default {
        props: ['height', 'min', 'max', 'top'],
        mounted: function () {
            this.height_ = this.height;
        },
        data: () => {
            return {
                height_: 0,
                start_y: -1,
            }
        },
        methods: {
            on_move: function (client_y) {
                let dy = client_y - this.start_y;
                let new_height = this.top ? (this.height_ - dy) : (this.height_ + dy);
                    console.log('move', new_height, this.min, this.max)
                if (Math.abs(dy) > 10 && new_height >= this.min && new_height <= this.max) {
                    this.$emit("resize", new_height);
                    console.log(new_height);
                    this.height_ = new_height;
                    this.start_y = client_y;
                }
            },

            on_mousedown: function (e) {
                console.log('move', e.clientY)
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
<template>
    <div style="cursor:col-resize; width: 6px" @mousedown="on_mousedown">
        <v-divider vertical> </v-divider>
    </div>
</template>

<script>
    export default {
        props: ['width', 'min', 'max', 'right'],
        mounted: function () {
            this.width_ = this.width;
        },
        data: () => {
            return {
                width_: 0,
                start_x: -1,
            }
        },
        methods: {
            on_move: function (client_x) {
                let dx = client_x - this.start_x;
                let new_width = this.right ? (this.width_ - dx) : (this.width_ + dx);
                if (Math.abs(dx) > 10 && new_width >= this.min && new_width <= this.max) {
                    this.$emit("resize", new_width);
                    this.width_ = new_width;
                    this.start_x = client_x;
                }
            },

            on_mousedown: function (e) {
                this.start_x = e.clientX;
                e.preventDefault();

                let self = this;
                document.onmousemove = ee => {
                    self.on_move(ee.clientX);
                };

                document.onmouseup = () => {
                    document.onmouseup = null;
                    document.onmousemove = null;
                };

            },
        }
    }
</script>
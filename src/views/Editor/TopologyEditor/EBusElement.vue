<template>
    <div :style="{position:'absolute', left: `${left_}px`, top: `${top_}px`, width: `${size}px`, height: `${size}px`}"
        :id="eid" @mouseup="on_moved">
        <svg :width="size" :height="size">
            <circle :id="eid" :cx="size/2" :cy="size/2" :r="size/2-4" :stroke-width="selected?5:3" fill="none" :stroke="`${selected?'#FFA726':'white'}`" 
                @mouseenter="on_hover" @mouseout="on_unhover" @dblclick="on_dbclick">
            </circle>
        </svg>
    </div>
</template>

<script>
    export default {
        props: ['eid', 'size', 'left', 'top', 'title'],
        data() {
            return {
                selected: false,
                left_: this.left,
                top_: this.top,
            }
        },
        methods: {
            on_hover() {
                this.selected = true;
            },
            on_unhover() {
                this.selected = false;
            },
            on_dbclick() {
                this.$emit('e_dbclick');
            },
            on_moved() {
                let el = document.getElementById(this.eid);
                if(this.left_ === el.offsetLeft && this.top_ === el.offsetTop) {
                    return;
                }
                this.left_ = el.offsetLeft;
                this.top_ = el.offsetTop;
                this.$emit('moved', {top: this.top_, left: this.left_});
            },
        }
    }
</script>
<template>
    <!-- <div :id="eid"
            :style="{position:'relative', width: `${size}px`, height: `${size}px`, 'border-radius': `${size/2}px`,
             left: `${left}px`, top: `${top}px`, 'background-color': '#BDBDBD'}" /> -->
    <div :style="{position:'relative', left: `${left}px`, top: `${top}px`, width: `${size}px`, height: `${size}px`}"
        :id="eid">
        <svg :width="size" :height="size">
            <circle :id="eid" :cx="size/2" :cy="size/2" :r="size/2-4" :stroke-width="selected?5:3" fill="none" :stroke="`${selected?'#E53935':'white'}`" 
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
            }
        }
    }
</script>
<template>
    <div>
        <v-chip v-for="item in items" :key="item"
            :style="{borderRadius:'0px', borderRight:'1px solid #111',backgroundColor:(item.light==true?'#111':'#333') ,color:(item.light==true?'white':'#999')}"
            close close-icon="mdi-close" color="#999" @click="click(item)" @click:close="propsClose(item)" draggable
            @drop.native="(ev) => on_drop(ev, item)" @dragover.native="(ev) => on_dragover(ev, item)"
            @dragstart.native="(ev) => on_dragstart(ev, item)" @dragend="by_drag=null" :ripple="false">
            <v-icon :style="{color:(item.light==true?'white':'#999')}" left>{{ item.icon }}</v-icon>
            <strong>{{ item.name }}</strong>
        </v-chip>
    </div>
</template>

<script>
    export default {
        props: ['items'],
        data() {
            return {
                by_drag: null,
            }
        },
        methods: {
            click(data) {
                this.$emit('active', data)
            },
            propsClose(data) {
                this.$emit('close', data)
            },
            on_dragstart: function (ev, item) {
                this.by_drag = item;
            },
            on_drop: function (ev, item) {
                if(!this.by_drag || !item || this.by_drag===item) {
                    return;
                }
                let idx = this.items.findIndex(it => it === this.by_drag);
                this.items.splice(idx, 1);
                idx = this.items.findIndex(it => it === item);
                this.items.splice(idx, 0, this.by_drag);
            },
            on_dragover: function (ev, item) {
                ev.preventDefault();
                if (!this.by_drag) {
                    return;
                }
            },
        },
    }
</script>
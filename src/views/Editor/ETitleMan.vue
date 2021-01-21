<template>
    <div style="width: 100%;">
        <v-chip v-for="item in items" :key="item.id" class= "rounded-t-lg px-4"
            :style="{height: '38px', borderRadius:'0px'}" :color="active===item?'grey lighten-4':'grey lighten-3'"
            :ripple="false"  @click="on_click(item)"
            draggable @drop.native="(ev) => on_drop(ev, item)"  @dragover.native="(ev) => on_dragover(ev, item)" @dragstart.native="(ev) => on_dragstart(ev, item)" @dragend="by_drag=null">
            <v-icon left>{{ icons[item.kind] }}</v-icon>
            <strong :class="`pr-4 text-subtitle-1`">{{ item.name }}</strong>
            <v-icon right small   @click="on_close(item)">mdi-close</v-icon>
        </v-chip>
    </div>
</template>

<script>
    import cfg from '../MainBar/SrcTree/config';

    export default {
        props: ['items'],
        data() {
            return {
                by_drag: null,
            }
        },
        computed: {
            icons: function() {
                return cfg.file_icons;
            },
            active: function() {
                return this.$store.state.Editor.active;
            }
        },
        methods: {
            on_click(item) {
                this.$store.commit('Editor/open', item);
            },
            on_close(item) {
                this.$store.commit('Editor/close', item);
            },
            on_dragstart: function (ev, item) {
                this.by_drag = item;
            },
            on_drop: function (ev, item) {
                if (!this.by_drag || !item || this.by_drag === item) {
                    return;
                }
                let idx = this.items.findIndex(it => it === this.by_drag);
                this.items.splice(idx, 1);
                idx = this.items.findIndex(it => it === item);
                this.items.splice(idx, 0, this.by_drag);
            },
            on_dragover: function (ev) {
                ev.preventDefault();
                if (!this.by_drag) {
                    return;
                }
            },
        },
    }
</script>
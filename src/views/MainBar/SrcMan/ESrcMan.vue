<template>
    <v-expansion-panels multiple accordion flat v-model="panel">
        <e-sub-panel v-for="(item,i) in list_pages" :key="i" :ctx="item"
            @action="on_action" >
        </e-sub-panel>
    </v-expansion-panels>
</template>

<script>
    import cfg from './config';
    import ESubPanel from './ESubPanel'

    export default {
        components: {
            'e-sub-panel': ESubPanel,
        },
        data: () => {
            return {
                panel: [0],
                list_pages: cfg.list_pages,
            }
        },
        methods: {
            on_action: function(ac, ctx) {
                if(!ac) {
                    return;
                }
                if(!this[ac.action]) {
                    console.log('TODO', ac);
                } else {
                    this[ac.action](ctx);
                }
            },
            do_packup: function(ctx) {
                let i = this.list_pages.findIndex(it => it === ctx);
                let p = this.list_pages.findIndex(it => it !== ctx);
                if(this.panel.includes(p)) {
                    this.panel = [i];
                } else {
                    let eps = [];
                    for(let i=0; i<this.list_pages.length; i++) {
                        eps.push(i);
                    }
                    this.panel = eps;
                }
            },
        }
    }
</script>
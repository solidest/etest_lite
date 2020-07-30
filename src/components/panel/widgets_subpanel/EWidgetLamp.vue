<template>
    <div style="display: inline-block" class="pa-0 ma-0">
        <v-avatar :color="face.background" size="36" class="mr-2">
            <v-icon v-if="face.icon" :color="face.foreground">
                {{face.icon}}
            </v-icon>
        </v-avatar>
        <span class="ml-2 subtitle-1" v-html="config.label"></span>
    </div>
</template>
<script>
    import IWidget from './IWidget';
    export default {
        mixins: [IWidget],
        data: () => {
            return {
                default_face: {
                    icon: '',
                    background: 'grey',
                    foreground: 'white'
                }
            }
        },
        computed: {
            face: function() {
                if(!this.config.items){
                    return this.default_face;
                }
                let v = this.value;
                let it = this.config.items.find(i => i.value===v);
                return it ? it : this.default_face;
            }
        },
    }
</script>
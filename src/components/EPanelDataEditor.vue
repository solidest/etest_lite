<template>
    <v-sheet width="100%" height="calc(100vh - 205px)" class="pa-0 ma-0" style="position:relative">
        <div style="position:absolute; left:-28px; top:-2px; z-index:100">
            <v-icon small color="grey lighten-1" class="pa-0 ma-1" style="cursor:pointer"> mdi-refresh </v-icon>
        </div>
        <e-script-editor :scrript="''" type="yaml" ref="script_editor">
        </e-script-editor>
    </v-sheet>
</template>
<script>
    import EScriptEditor from './EScriptEditor';

    export default {
        props: ['commander', 'recorder'],
        components: {
            'e-script-editor': EScriptEditor,
        },
        mounted: function () {

        },
    }
</script>
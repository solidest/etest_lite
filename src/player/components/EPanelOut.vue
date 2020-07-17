<template>
    <v-sheet class="outs ma-0 pa-0"  width="100%" style="height: calc(100vh - 32px);" tile>
        <e-outs :outs="outs" :debug="false" height="500" />
    </v-sheet>
</template>
<script>

import run from '../../run/run_r';
import EOuts from '../../components/EOutsDebug'

export default {
    components: {
        'e-outs': EOuts,
    },
    mounted: function() {
        run.set_outs(this.outs);
    },
    data: () => {
        return {
            outs: []
        }
    },

}
</script>~
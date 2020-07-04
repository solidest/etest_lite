<template>
    <v-sheet width="100%" height="100%" tile class="pa-3 ma-0">
        <v-row class="pa-0 ma-0">
            <v-col v-if="title" class="pa-0 ma-0" cols=12>
                <v-card-title class="pa-2 ma-0">{{title}}</v-card-title>
            </v-col>
            <v-col v-for="(wed, idx) in items" :key="idx" :cols="wed.config.cols||12" class="px-2 py-4 ma-0">
                <component v-bind:is="wed.type" :recorder="recorder" :commander="commander" :config="wed.config"></component>
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script>
    import ELabel from './EWidgetLabel';
    import EText from './EWidgetText';
    import ENumber from './EWidgetNumber';
    import ESelect from './EWidgetSelect';
    import ECombobox from './EWidgetCombobox';
    import ECheckbox from './EWidgetCheckbox';
    import ESwitch from './EWidgetSwitch';
    import ERadio from './EWidgetRadio';
    import ESlider from './EWidgetSlider';
    import EButton from './EWidgetButton';
    import ELamp from './EWidgetLamp';
    
    export default {
        props: ['title', 'items', 'recorder', 'commander'],
        components: {
            'e-label': ELabel,
            'e-text': EText,
            'e-number': ENumber,
            'e-select': ESelect,
            'e-combobox': ECombobox,
            'e-checkbox': ECheckbox,
            'e-switch': ESwitch,
            'e-radio': ERadio,
            'e-slider': ESlider,
            'e-button': EButton,
            'e-lamp': ELamp,
        },
    }
</script>
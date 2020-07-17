<template>
    <v-sheet :id="id" class="pa-0 ma-0" outlined :height="size.height" :width="size.width" color="grey darken-2">
    </v-sheet>
</template>

<script>
    import echarts from 'echarts';
    import mocker from './mocker_data';

    export default {
        props: ['id', 'size', 'items', 'title', 'design', 'recorder', ],
        
        mounted: function() {
            this.load_data(this.recorder);
        },

        data: () => {
            return {
                value: {},
                values: {},
            }
        },
        computed: {
            is_gauge: function() {
                return !!this.items.find(it => it.type==='e-gauge');
            }
        },

        watch: {
            size: function () {
                let self = this;
                this.$nextTick(() => {
                    if (!self.chart) {
                        self.chart = echarts.init(document.getElementById(this.id),'dark');
                        self.redraw();
                        return;
                    }
                    if (self.design) {
                        self.chart.resize();
                        self.redraw();
                    } else {
                        self.chart.resize();
                    }
                });
            },
            title: function () {
                let self = this;
                this.$nextTick(() => {
                    if (self.chart) {
                        self.redraw();
                    }
                });
            },
            recorder: function (v) {
                this.load_data(v);
                this.load_datas();
                this.redraw_data();
            },
        },

        methods: {
            load_data: function(recorder) {
                if(this.is_gauge) {
                    this.items.forEach(it => {
                        if (it.config.record_key && it.config.record_key.trim()) {
                            let keys = it.config.record_key.trim().split('.');
                            let v = this.get_value_(recorder, keys);
                            if (v !== undefined) {
                                this.value[it] = v;
                            }
                        }
                    });
                }
            },
            load_datas: function() {
                console.log('TODO load datas');
            },
            get_value_: function (obj, keys) {
                let o = obj;
                let idx = 0;
                let last = keys.length - 1;
                while (o && (typeof o === 'object')) {
                    if (idx === last) {
                        return o[keys[last]];
                    }
                    o = o[keys[idx]];
                    idx++;
                }
                return undefined;
            },

            set_value_: function (obj, keys, v) {
                let idx = 0;
                let last = keys.length - 1;
                let o = obj;
                do {
                    if (idx === last) {
                        o[keys[last]] = v;
                        return;
                    }
                    if (!o[keys[idx]]) {
                        o[keys[idx]] = {};
                    }
                    o = o[keys[idx]];
                } while (idx++ < last);
            },

            get_main_option_: function () {
                if(this.items.length === 0) {
                    return;
                }
                let cfg = this.items[0].config.items;
                cfg = JSON.parse(JSON.stringify(cfg));
                if (this.title) {
                    cfg.title = {
                        text: this.title,
                        textStyle: {
                            color: '#EEEEEE',
                        },
                        left: 20,
                        top: 20,
                        show: true,
                    };
                } else {
                    cfg.title = {
                        show: false
                    };
                }
                if(!this.is_gauge) {
                    cfg.xAxis = cfg.xAxis || {};
                    cfg.yAxis = cfg.yAxis || {};
                }
                return cfg;
            },

            get_series_option_: function (opt) {
                let series = [];
                this.items.forEach(it => {
                    let cfg = it.config;
                    let se = {};
                    if(cfg && cfg.items && cfg.items.series && cfg.items.series.length===1) {
                        se = cfg.items.series[0];
                    }
                    se.type = it.type.substring(2);
                    se.name = cfg.label;
                    series.push(se);
                });
                opt.series = series;
            },

            get_design_data_: function (opt) {
                opt.series.forEach(se => {
                    if (se.type === 'gauge') {
                        if(this.value[se] !== undefined) {
                            se.data = [{
                                value: this.value[se],
                                name: se.name,
                            }];
                        } else if(!se.data) {
                            se.data = [{value: 0, name: se.name}]
                        }
                    } else {
                        se.data = mocker.create_data(se);
                    }
                });
            },

            get_run_data_: function(opt) {
                opt.series.forEach(se => {
                    if (se.type === 'gauge') {
                        if(this.value[se] !== undefined) {
                            se.data = [{
                                value: this.value[se],
                                name: se.name,
                            }];
                        } else if(!se.data) {
                            se.data = [{value: 0, name: se.name}]
                        }
                    } else {
                        //TODO
                    }
                });
            },

            redraw: function () {
                if (!this.chart) {
                    return;
                }
                if(this.items.length === 0) {
                    this.chart.clear();
                    return;
                }
                let option = this.get_main_option_();
                this.get_series_option_(option);

                if (this.design) {
                    this.get_design_data_(option);
                    this.chart.clear();
                } else {
                    this.get_run_data_(option);
                }

                this.chart.setOption(option);
            },

            redraw_data: function() {
                // console.log('TODO redraw_data');
                this.redraw();
            }
        }

    }
</script>
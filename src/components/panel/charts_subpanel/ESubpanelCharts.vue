<template>
    <v-sheet :id="id" class="pa-0 ma-0" outlined :height="size.height" :width="size.width" color="grey darken-2">
    </v-sheet>
</template>

<script>
    import echarts from 'echarts';
    import gauge from './gauge';
    import lines from './lines';
    import mocker_data from './mocker_data';

    const max_points = 2000;

    export default {
        props: ['id', 'size', 'items', 'title', 'design', 'recorder', 'recorders'],
        
        mounted: function() {
            if(this.design) {
                this.mock_datas();
            } else {
                this.init_datas();
            }
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
                        self.redraw('size');
                        return;
                    }
                    self.chart.resize();
                    self.redraw('size');
                });
            },
            title: function () {
                let self = this;
                this.$nextTick(() => {
                    if (self.chart) {
                        self.redraw('title');
                    }
                });
            },
            recorder: function (v) {
                if(!this.is_gauge) {
                    if(this.design) {
                        this.mock_datas();
                        this.redraw('recorder');
                    }
                    return;
                }
                let res = this.load_data(v);
                if(!res && !this.design) {
                    return;
                }
                let self = this;
                this.$nextTick(() =>{
                    if(self.design) {
                        self.redraw('recorder');
                    } else {
                        self.redraw_data('recorder');
                    }
                });
            },
            recorders: function(vs) {
                if(this.is_gauge || !this.load_datas(vs)) {
                    return;
                }
                let self = this;
                this.$nextTick(() =>{
                    self.redraw_data('recorders');
                })
            }
        },

        methods: {

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
            
            load_data: function(recorder) {
                let res = false;
                this.items.forEach(it => {
                    if (it.config.record_key && it.config.record_key.trim()) {
                        let key = it.config.record_key.trim();
                        let keys = key.split('.');
                        let v = this.get_value_(recorder, keys);
                        if (v !== undefined) {
                            this.value[key] = v;
                            res = true;
                        }
                    }
                });
                return res;
            },

            load_datas: function(recorders) {
                let res = false;
                if (!this.items || this.items.length === 0) {
                    return res;
                }
                this.items.forEach (it => {
                    let x_key = (it.config && it.config.x_record_key) ? it.config.x_record_key.trim():'';
                    let y_key = (it.config && it.config.y_record_key) ? it.config.y_record_key.trim():'';
                    if(x_key && y_key) {
                        let key = x_key + '::' + y_key;
                        let vs = recorders[key];
                        if(vs) {
                            res = true;
                            if(!this.values[key]) {
                                this.values[key] = vs;
                            } else {
                                this.values[key].push(...vs);
                            }
                            let rc = this.values[key].length - max_points;
                            if(rc>0) {
                                this.values[key].splice(0, rc);
                            }
                        }                
                    }
                });
                return res;
            },

            init_datas: function() {
                this.values = {};
                if (!this.items || this.items.length === 0) {
                    return;
                }
                this.items.forEach (it => {
                    let x_key = (it.config && it.config.x_record_key) ? it.config.x_record_key.trim():'';
                    let y_key = (it.config && it.config.y_record_key) ? it.config.y_record_key.trim():'';
                    if(x_key && y_key) {
                        this.values[x_key + '::' + y_key] = [];                   
                    }
                });
            },


            mock_datas: function() {
                this.values = {};
                if (!this.items || this.items.length === 0) {
                    return;
                }
                this.items.forEach (it => {
                    let x_key = (it.config && it.config.x_record_key) ? it.config.x_record_key.trim():'';
                    let y_key = (it.config && it.config.y_record_key) ? it.config.y_record_key.trim():'';
                    if(x_key && y_key) {
                        this.values[x_key + '::' + y_key] = mocker_data.create_data(it);                   
                    }
                });
            },

            redraw: function () {
                // console.log('redraw by', reason)
                this.chart.clear();
                if(this.items.length === 0) {
                    return;
                }
                let option = this.is_gauge ? gauge.get_option(this.items, this.value, this.title) : lines.get_option(this.items, this.values, this.title);
                this.chart.setOption(option);
            },

            redraw_data: function() {
                // console.log('redraw_data by', reason)
                let option = this.is_gauge ? gauge.get_data_option(this.items, this.value) : lines.get_data_option(this.items, this.values);
                this.chart.setOption(option);
            }
        }

    }
</script>
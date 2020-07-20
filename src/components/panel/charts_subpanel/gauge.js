//             get_design_data_: function (opt) {
//                 opt.series.forEach(se => {
//                     if (se.type === 'gauge') {
//                         if(this.value[se] !== undefined) {
//                             se.data = [{
//                                 value: this.value[se],
//                                 name: se.name,
//                             }];
//                         } else if(!se.data) {
//                             se.data = [{value: 0, name: se.name}]
//                         }
//                     } else {
//                         se.data = mocker.create_data(se);
//                     }
//                 });
//             },

//             get_run_data_: function(opt) {
//                 opt.series.forEach(se => {
//                     if (se.type === 'gauge') {
//                         if(this.value[se] !== undefined) {
//                             se.data = [{
//                                 value: this.value[se],
//                                 name: se.name,
//                             }];
//                         } else if(!se.data) {
//                             se.data = [{value: 0, name: se.name}]
//                         }
//                     } else {
//                         //TODO
//                     }
//                 });
//             },




// if (this.design) {
//     this.get_design_data_(option);
//     this.chart.clear();
// } else {
//     this.get_run_data_(option);
// }

// set_value_: function (obj, keys, v) {
//     let idx = 0;
//     let last = keys.length - 1;
//     let o = obj;
//     do {
//         if (idx === last) {
//             o[keys[last]] = v;
//             return;
//         }
//         if (!o[keys[idx]]) {
//             o[keys[idx]] = {};
//         }
//         o = o[keys[idx]];
//     } while (idx++ < last);
// },

function get_data_option(items, value) {
    let series = [];
    items.forEach(it => {
        let icfg = it.config;
        if (icfg && icfg.items && icfg.items.series && icfg.items.series.length === 1) {
            let key = it.config.record_key ? it.config.record_key.trim() : '';
            if (value[key] !== undefined) {
                series.push({
                    data: [{
                        value: value[key],
                        name: it.name,
                    }]
                });
            } else {
                series.push({});
            }
        }
    });

    return {
        series: series
    };
}

function get_option(items, value, title) {
    if (!items || items.length === 0) {
        return {};
    }

    let opt = JSON.parse(JSON.stringify(items[0].config.items));
    if (title) {
        opt.title = {
            text: title,
            textStyle: {
                color: '#EEEEEE',
            },
            left: 20,
            top: 20,
            show: true,
        };
    } else {
        opt.title = {
            show: false
        };
    }

    let series = [];
    items.forEach(it => {
        let icfg = it.config;
        if (icfg && icfg.items && icfg.items.series && icfg.items.series.length === 1) {
            let se = icfg.items.series[0];
            se.type = it.type.substring(2);
            se.name = icfg.label;

            let key = it.config.record_key ? it.config.record_key.trim() : '';
            if (value[key] !== undefined) {
                se.data = [{
                    value: value[key],
                    name: it.name,
                }]
            } else {
                se.data = [{
                    value: 0,
                    name: it.name
                }]
            }
            series.push(se);
        }
    });
    opt.series = series;

    return opt;
}

export default {
    get_data_option,
    get_option,
}
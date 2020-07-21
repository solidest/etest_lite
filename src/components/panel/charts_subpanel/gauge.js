
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
                        name: icfg.label||'',
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
                    name: se.name||'',
                }]
            } else {
                se.data = [{
                    value: 0,
                    name: se.name||''
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
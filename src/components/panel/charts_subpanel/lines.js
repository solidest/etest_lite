
function get_data_option(items, values) {
    if (!items || items.length === 0) {
        return {};
    }
    let series = [];
    items.forEach(it => {
        let icfg = it.config;
        if (icfg && icfg.items && icfg.items.series && icfg.items.series.length === 1) {
            let se = {}
            let x_key = (icfg.x_record_key) ? icfg.x_record_key.trim():'';
            let y_key = (icfg.y_record_key) ? icfg.y_record_key.trim():'';
            if(x_key && y_key) {
                let vs = values[x_key + '::' + y_key];
                if(vs) {
                    se.data = vs;
                }
            }
            series.push(se);
        }
    });
    let res = {
        series: series
    }
    return res;
}

function get_option(items, values, title) {
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

            let x_key = (icfg.x_record_key) ? icfg.x_record_key.trim():'';
            let y_key = (icfg.y_record_key) ? icfg.y_record_key.trim():'';
            if(x_key && y_key) {
                let vs = values[x_key + '::' + y_key];
                if(vs) {
                    se.data = vs;
                }
            }
            series.push(se);
        }
    });
    opt.series = series;
    return opt;
}
export default {
    get_option,
    get_data_option,
}
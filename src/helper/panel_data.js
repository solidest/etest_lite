import yaml from 'js-yaml'

class PanelData {
    constructor() {
        this.commander = {};
        this.recorder = {};
        this.script = '';
    }
    load_yaml(str) {
        this.script = str;
        if (this.save_yaml() === str) {
            return;
        }
        try {
            let doc = yaml.load(str, 'utf8');
            if (doc) {
                this.commander = doc.command || {};
                this.recorder = doc.record || {};
            }
        } catch (error) {
            this.commander = {};
            this.recorder = {};
        }
    }
    save_yaml() {
        let obj = {
            record: this.recorder,
            command: this.commander
        };
        let str = yaml.safeDump(JSON.parse(JSON.stringify(obj)), {
            styles: {
                '!!null': 'lowercase'
            },
        });
        return str || '';
    }
    init_data_(obj, o_key) {
        if (!o_key || !o_key.trim()) {
            return;
        }
        let keys = o_key.trim().split('.');
        let idx = 0;
        let last = keys.length - 1;
        let o = obj;
        do {
            if (idx === last) {
                if (o[keys[last]] === undefined) {
                    o[keys[last]] = null;
                }
                return;
            }
            if (!o[keys[idx]]) {
                o[keys[idx]] = {};
            }
            o = o[keys[idx]];
        } while (idx++ < last);
    }
    init_data(panels) {
        this.commander = {};
        this.recorder = {};
        panels.forEach(panel => {
            if (panel.items) {
                panel.items.forEach(wed => {
                    if (wed.config) {
                        this.init_data_(this.commander, wed.config.command_key);

                        ['record_key', 'x_record_key', 'y_record_key'].forEach(key => {
                            if(wed.config[key]) {
                                this.init_data_(this.recorder, wed.config[key]);
                            }
                        })
                    }
                });
            }
        });
        this.script = this.save_yaml();
    }

    update(doc) {
        // this.udpate_obj(this.recorder, doc.record);
        // this.recorder = JSON.parse(JSON.stringify(this.recorder));
        this.recorder = doc.record;
        let self = this;
        setTimeout(() => {
            self.script = self.save_yaml();
        }, 100);
    }
}

export default PanelData
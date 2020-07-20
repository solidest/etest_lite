export default {
    props: ['recorder', 'commander', 'config'],

    mounted: function() {
        if(this.rcd_keys) {
            this.value = this.get_value_(this.recorder, this.rcd_keys);
            if(this.value !== undefined && this.cmd_keys) {
                this.set_value_(this.commander, this.cmd_keys, this.value);
            }
        } else if(this.cmd_keys) {
            this.value = this.get_value_(this.commander, this.cmd_keys) || null;
        }
    },

    data: () => {
        return {
            value : null,
        }
    },

    computed: {
        cmd_keys: function() {
            if (this.config.command_key) {
                let keys = this.config.command_key.trim().split('.');
                if (keys && keys.length > 0) {
                    return keys;
                }
            }
            return null;
        },
        rcd_keys: function() {
            if (this.config.record_key) {
                let keys = this.config.record_key.trim().split('.');
                if (keys && keys.length > 0) {
                    return keys;
                }
            }
            return null;
        },
    },

    watch: {
        recorder: function (v) {
            if(this.rcd_keys) {
                let vv = this.get_value_(v, this.rcd_keys);
                if(vv !== undefined) {
                    this.value = vv;
                }
                // if(this.rcd_keys.length>1) {
                //     console.log(v, vv);
                // }
            }
        },
        commander: function(v) {
            if(this.cmd_keys) {
                this.value = this.get_value_(v, this.cmd_keys);
            }
        },
        value: function(v) {
            if(this.cmd_keys) {
                let vv = this.get_value_(this.commander, this.cmd_keys)
                if(vv !== v) {
                    this.set_value_(this.commander, this.cmd_keys, v);
                }
            }
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
        }
    }
}
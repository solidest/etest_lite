<script>
    export default {
        props: ['recorder', 'commander', 'config'],

        beforeMount: function() {
            if(this.config.command_key) {
                let keys = this.config.command_key.trim().split('.');
                if(keys && keys.length>0) {
                    this.cmd_keys = keys;
                } 
            } else {
                this.cmd_keys = null;
            }
            if(this.config.record_key) {
                let keys = this.config.record_key.trim().split('.');
                if(keys && keys.length>0) {
                    this.rcd_keys = keys;
                }
            } else {
                this.rcd_keys = null;
            }
            // console.log(this.cmd_keys, this.rcd_keys)
        },

        computed: {
            value: {
                get: function () {
                    if(!this.rcd_keys) {
                        if(!this.cmd_keys) {
                            return undefined;
                        } else {
                            return this.get_value_(this.commander, this.cmd_keys);
                        }
                    } else {
                        return this.get_value_(this.recorder, this.rcd_keys);
                    }
                },
                set: function(v) {
                    if(!this.cmd_keys) {
                        if(!this.rcd_keys) {
                            return;
                        } else {
                            this.set_value_(this.recorder, this.rcd_keys, v);
                            return;
                        }
                    } else {
                        this.set_value_(this.commander, this.cmd_keys, v);
                    }
                }
            },
        },

        methods: {

            get_value_: function (obj, keys) {
                let o = obj;
                let idx = 0;
                let last = keys.length - 1;
                while (o || (typeof o === 'object')) {
                    if (idx === last) {
                        let v = o[keys[last]];
                        if (v === null || v === undefined) {
                            return null;
                        }
                        return v;
                    } 

                    o = o[keys[idx]];
                    idx++;
                }
                return null;
            },

            set_value_: function (obj, keys, v) {
                let idx = 0;
                let last = keys.length - 1;
                let o = obj;
                do {
                    if(idx === last) {
                        o[keys[last]] = v;
                        return;
                    }
                    if(!o[keys[idx]]) {
                        o[keys[idx]] = {};
                    }
                    o = o[keys[idx]];
                } while(idx++<last);
            }

            // get_vrecorder: function (cfg) {
            //     if (!cfg || !cfg.recorder_key) {
            //         return undefined;
            //     }
            //     let keys = cfg.recorder_key.trim().split('.');
            //     if (!keys || keys.length === 0) {
            //         return undefined;
            //     }
            //     return this.get_value_(this.recorder, keys);
            // },

            // get_vcommander: function (cfg) {
            //     if (!cfg || !cfg.commander_key) {
            //         return undefined;
            //     }
            //     let keys = cfg.commander_key.trim().split('.');
            //     if (!keys || keys.length === 0) {
            //         return undefined;
            //     }
            //     return this.get_value_(this.recorder, keys);
            // }
        }
    }
</script>
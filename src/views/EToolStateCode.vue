<template>
    <v-container class="pa-0 fill-height" fluid>
        <v-card height="100%" width="100%" tile>
            <div style="height: calc(100vh - 40px);  overflow-y:auto">
                <v-row class="pa-0 ma-0" style="flex-wrap: nowrap;">
                    <v-col cols="7">
                        <v-sheet class="pa-2" height="100%" style="border:1px solid grey">
                        </v-sheet>
                    </v-col>
                    <v-col cols="5">
                        <v-sheet class="pa-2">
                            <v-row class="pa-0 ma-0">
                                <v-col cols="12" class="ma-0 pa-1" align="center">
                                    <v-btn color="grey lighten-2" outlined @click="on_code">
                                        {{design ? '生成代码':'编辑设置'}}
                                    </v-btn>
                                </v-col>
                                <v-col cols="12" class="ma-0 pa-0">
                                    <v-sheet class="pa-0 ma-0" style="height: calc(100vh - 130px);">
                                        <e-script-editor v-if="design" :small="true" id="yaml" :script="yaml" type="yaml"
                                            @change="on_change" />
                                        <v-sheet v-else class="pa-0 ma-0" style="height: calc(100vh - 130px);">
                                            <e-script-editor id="lua" :small="true" :script="lua" type='etlua' @change="on_change" />
                                        </v-sheet>
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </v-col>
                </v-row>
            </div>
        </v-card>
    </v-container>
</template>

<script>
    import EScriptEditor from '../components/widgets/EDataFormatEditor';
    import yaml from 'js-yaml';
    import helper from '../helper/helper';

    export default {
        components: {
            'e-script-editor': EScriptEditor,
        },

        data() {
            return {
                yaml: '- comment: 测试程序启动事件\n  when: $entry\n  then: todo1\n',
                lua: '',
                design: true,
            }
        },

        methods: {
            on_change(id, value) {
                this[id] = value;
            },
            valid_event(e) {
                if (!e || !e.trim()) {
                    return false;
                }
                e = e.trim();
                if (e === '$entry') {
                    return true;
                }
                if (e.startsWith('timeout.')) {
                    e = e.substring(8);
                }
                return helper.check_name(e);
            },
            valid_actions(acs) {
                if (!acs || !acs.trim()) {
                    return false;
                }
                acs = acs.split(' ');
                let al = [];
                acs.forEach(ac => {
                    if (ac && ac.trim()) {
                        al.push(ac.trim());
                    }
                });
                if (al.length === 0) {
                    return false;
                }
                for (let ac of al) {
                    let aa = ac.split('@');
                    if (aa.length === 1) {
                        if (!helper.check_name(aa[0])) {
                            return false;
                        }
                    } else if (aa.length === 2) {
                        if (!helper.check_name(aa[0]) || (aa[1] && isNaN(aa[1]))) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                return true;
            },
            valid_yaml() {
                try {
                    let states = yaml.safeLoad(this.yaml);
                    for (let it of states) {
                        for (let k in it) {
                            if (!['when', 'then', 'comment'].includes(k)) {
                                throw new Error('无效关键词' + k);
                            }
                        }
                        if (!this.valid_event(it.when)) {
                            throw new Error('when无效事件' + it.when);
                        }
                        if (!this.valid_actions(it.then)) {
                            throw new Error('then无效动作' + it.then);
                        }
                    }
                    if (states.length === 0) {
                        throw new Error('状态序列不能为空');
                    }
                    if (states[0].when.trim() !== '$entry') {
                        throw new Error('必须以$entry事件开始');
                    }
                    return true;
                } catch (error) {
                    this.$store.commit('setMsgError', error.message);
                }
                return false;
            },
            make_timeouts(states, codes) {
                let begin = [];
                let end = [];
                let out = [];
                states.forEach(st => {
                    if (st.event.type === 'timeout') {
                        if (!out.includes(st.event.name)) {
                            out.push(st.event.name);
                        }
                    }
                    st.actions.forEach(ac => {
                        if (ac.type === 'begin_timer' && !begin.includes(ac.name)) {
                            begin.push(ac.name);
                        } else if (ac.type === 'end_timer' && !end.includes(ac.name)) {
                            end.push(ac.name);
                        }
                    });
                });
                begin.forEach(t => {
                    if (!end.includes(t)) {
                        throw new Error(`定时器${t}没有结束`);
                    }
                    if (!out.includes(t)) {
                        throw new Error(`定时器${t}超时没有被捕获`);
                    }
                });
                codes.push('local _timers = {}');
            },
            make_fns(states, codes) {
                let fns = [];
                states.forEach(st => {
                    st.actions.forEach(ac => {
                        if (ac.type === 'action' && !fns.includes(ac.name)) {
                            fns.push(ac.name);
                        }
                    });
                });
                fns.forEach(fn => {
                    codes.push('\n');
                    codes.push(`function ${fn}(udata)`);
                    codes.push('\t\n');
                    codes.push('end');
                });
            },
            append_action(ac, codes, level) {
                let pre = '\t'.repeat(level);
                if(ac.type === 'begin_timer') {
                    codes.push(`${pre}_timers.${ac.name} = async.timeout(${ac.value}, async.emit, 'timeout.${ac.name}')`);
                } else if(ac.type === 'end_timer') {
                    codes.push(`${pre}async.clear(_timers.${ac.name})`);
                } else if(ac.type === 'action') {
                    codes.push(`${pre}${ac.name}()`)
                }
            },

            make_entry(states, codes) {
                let self = this;
                states.forEach(st => {
                    if(st.comment) {
                        codes.push(`\n${'\t'.repeat(st.event.type === 'entry'?0:1)}-- ${st.comment}`)
                    }
                    if(st.event.type === 'entry') {
                        codes.push('function entry(vars, option)')
                    } else {
                        if(st.actions.length === 1 && st.actions[0].type === 'action') {
                            codes.push(`\tasync.on('${st.event.type==='timeout'?'timeout.':''}${st.event.name}', ${st.actions[0].name})`);
                        } else {
                            codes.push(`\tasync.on('${st.event.type==='timeout'?'timeout.':''}${st.event.name}', function()`);
                            st.actions.forEach(ac => self.append_action(ac, codes, 2));
                            codes.push('\tend)');
                        }
                    }
                });
                states[0].actions.forEach(ac => {
                    self.append_action(ac, codes, 1);
                });
                codes.push('end');
            },
            make_code(states) {
                let codes = ['\n'];
                this.make_timeouts(states, codes);
                this.make_fns(states, codes);
                this.make_entry(states, codes);
                return codes.join('\n');
            },
            get_code(yaml_code) {
                let state_list = [];
                let states = yaml.safeLoad(yaml_code);
                states.forEach(st => {
                    let ev = st.when.trim();
                    let oev;
                    if (ev === '$entry') {
                        oev = {
                            type: 'entry'
                        }
                    } else {
                        if (ev.startsWith('timeout.')) {
                            oev = {
                                type: 'timeout',
                                name: ev.substring(8)
                            }
                        } else {
                            oev = {
                                type: 'event',
                                name: ev
                            }
                        }
                    }

                    let acts = st.then.trim().split(' ');
                    let actls = [];
                    acts.forEach(ac => {
                        ac = ac.trim();
                        if (ac) {
                            let ts = ac.split('@');
                            if (ts.length === 2) {
                                if (ts[1]) {
                                    actls.push({
                                        type: 'begin_timer',
                                        name: ts[0],
                                        value: parseInt(ts[1]),
                                    });
                                } else {
                                    actls.push({
                                        type: 'end_timer',
                                        name: ts[0]
                                    });
                                }
                            } else {
                                actls.push({
                                    type: 'action',
                                    name: ts[0],
                                });
                            }
                        }
                    });

                    state_list.push({
                        event: oev,
                        actions: actls,
                        comment: st.comment,
                    });
                });
                return this.make_code(state_list);
            },
            on_code() {
                if (this.design) {
                    if (this.valid_yaml()) {
                        try {
                            this.lua = this.get_code(this.yaml);
                            this.design = false;
                        } catch (error) {
                            this.$store.commit('setMsgError', error.message);
                        }
                    }
                } else {
                    this.design = true;
                }
            }
        }
    }
</script>
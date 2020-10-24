
import redoundo from '../../doc/redoundo';

const state = () => ({
    items: [],
    active: null,
    state_disbar: {},
    doc_states: {}
});


const mutations = {
    reset(state) {
        state.items = [];
        state.active = null;
        state.doc_states = {};
    },
    open(state, item) {
        let fi = state.items.find(it => it.id === item.id);
        if (!fi) {
            fi = {id: item.id, name: item.name, kind: item.kind}
            state.items.push(fi);
            redoundo.put_ru(item.id);
        }  else {
            fi.name = item.name;
        }
        state.active = fi;
    },
    close(state, item) {
        let idx = state.items.findIndex(it => it.id === item.id);
        if (idx >= 0) {
            state.items.splice(idx, 1);
            delete state.doc_states[item.id];
            redoundo.del_ru(item.id);
        }
        if (state.active && state.active.id === item.id) {
            if (state.items.length > 0) {
                if (idx >= 0 && idx < state.items.length) {
                    state.active = state.items[idx];
                } else {
                    state.active = state.items[0];
                }
            } else {
                state.active = null;
            }
        }
    },
    update(state, item) {
        let fi = state.items.find(it => it.id === item.id);
        if (fi) {
            fi.name = item.name;
            fi.memo = item.memo;
        }
    },
    set_state_disbar(state, state_disbar) {
        state.state_disbar = state_disbar;
    },
};

const getters = {
    put_doc_state: (state) => (id, doc_state) => {
        if(state.items.find(it => it.id === id)) {
            state.doc_states[id] = doc_state;
        }
    },
    get_doc_state: (state) => (id) => {
        return state.doc_states[id];
    },
}


export default {
    namespaced: true,
    state,
    mutations,
    getters,
}
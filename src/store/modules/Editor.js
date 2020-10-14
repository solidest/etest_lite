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
        if (!state.items.find(it => it === item)) {
            state.items.push(item);
        }
        state.active = item;
        let ss = state.doc_states;
        let rms = [];
        for(let key in ss) {
            if(state.items.find(it => it.id===key)) {
                continue;
            }
            rms.push(key);
        }
        rms.forEach(k => {
            delete ss[k];
        })
    },
    close(state, item) {
        let idx = state.items.findIndex(it => it === item);
        if (idx >= 0) {
            state.items.splice(idx, 1);
        }
        if (state.active === item) {
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
    set_state_disbar(state, state_disbar) {
        state.state_disbar = state_disbar;
    },
};

const getters = {
    del_doc_state: (state) => (id) => {
        delete state.doc_states[id];
    },
    put_doc_state: (state) => (id, doc_state) => {
        state.doc_states[id] = doc_state;
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
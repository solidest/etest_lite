

const state = () => ({
    items: [],
    active: null,
});

const mutations = {
    reset(state) {
        state.items = [];
        state.active = null;
    },
    open(state, item) {
        if(!state.items.find(it => it === item)) {
            state.items.push(item);
        }
        state.active = item;
    },
    close(state, item) {
        let idx = state.items.findIndex(it => it === item);
        if(idx>=0) {
            state.items.splice(idx, 1);
        }
        if(state.active === item) {
            if(state.items.length>0) {
                if(idx>=0&&idx<state.items.length) {
                    state.active = state.items[idx];
                } else {
                    state.active = state.items[0];
                }
            } else {
                state.active = null;
            }
        }
    },

};


export default {
  namespaced: true,
  state,
  mutations
}
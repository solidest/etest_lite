

const state = () => ({
    prop_width: 300,
});

const mutations = {
    set_prop_width(state, width) {
        state.prop_width = width;
    }

};


export default {
  namespaced: true,
  state,
  mutations
}
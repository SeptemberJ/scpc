import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const state = {
}

const actions = {
  // changeSiderIdx ({commit, state}, IDX) {
  //   commit('setSiderIdx', IDX)
  // }
}

const mutations = {
  // setSiderIdx (state, IDX) {
  //   state.siderIdx = IDX
  // }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [vuexLocal.plugin]
})

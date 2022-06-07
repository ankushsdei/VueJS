/**
 ** Socket testo module is handle all transaction i.e. related to the API Server calls
 *! Update if socket testo logic re-newed||Modified.
 *
 */

const state = {
  onlineSuperAdmin: false,
  onlineAdmin: false,
  onlineTPC: false,
  platform: ""
};

// mutations
const mutations = {
  SET_PLATFROM(state, platform) {
    state.platform = platform;
  },
  SET_SOCKET_STATUS(state, payload) {
    if (payload.type == "superadmin") {
      state.onlineSuperAdmin = payload.flag;
    }
    if (payload.type == "admin") {
      state.onlineAdmin = payload.flag;
    }
    if (payload.type == "tpc") {
      state.onlineTPC = payload.flag;
    }
  }
};

// getters
const getters = {};

// actions
const actions = {
  /**
   * @desc Connect with Socket Server
   * @param {*} param0
   * @param {*} type
   */
  connect({ commit }, payload) {
    payload.flag = true;
    // console.log(this.$socket);
    if (payload.type == "superadmin") {
      commit("SET_SOCKET_STATUS", payload);
    }
    if (payload.type == "admin") {
      commit("SET_SOCKET_STATUS", payload);
    }
    if (payload.type == "tpc") {
      commit("SET_SOCKET_STATUS", payload);
    }
  },

  /**
   * @desc disconnect with Socket Server
   * @param {*} param0
   * @param {*} type
   */
  disconnect({ commit }, payload) {
    // console.log(getSocketUrl());
    if (payload.type == "superadmin") {
      let flag = false;

      commit("SET_SOCKET_STATUS", flag);
    }
    if (payload.type == "admin") {
      let flag = true;

      commit("SET_SOCKET_STATUS", flag);
    }
    if (payload.type == "tpc") {
      let flag = true;

      commit("SET_SOCKET_STATUS", flag);
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

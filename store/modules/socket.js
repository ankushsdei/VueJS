/**
 ** Role Management module is handle all transaction i.e. related to the API Server calls
 *! Update if Role Module logic re-newed||Modified.
 *
 */
import Vue from "vue";

const state = {
  auth_response: "",
  isConnected: false,
  access_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbWl0QHNtYXJ0ZGF0YWluYy5uZXQiLCJwb3J0YWxfaWQiOiIxIiwicG9ydGFsIjoic3VwZXJhZG1pbiIsImlkIjoxLCJpYXQiOjE1ODc2MjkzMzl9.lcWpU8RySm6G4R55Yd5lUY4gFGnsT8nW3l6Y7F0_Eq4"
};

// mutations
const mutations = {
  /**
   * Socket Connect
   * @param state
   * @constructor
   */
  SOCKET_CONNECT(state) {
    state.isConnected = true;
  },

  /**
   * Auth Response
   * @param state
   * @param response
   * @constructor
   */
  AUTH_RESPONSE(state, response) {
    state.auth_response = response;
  }
};

// getters
const getters = {
  /**
   * Return If Socket is Connected or Not
   * @param state
   * @returns {boolean|(() => boolean)}
   */
  isSocketConnected(state) {
    return state.isConnected;
  },

  /**
   * Return Access Token
   * @param state
   * @returns {string}
   */
  getAccessToken(state) {
    return state.access_token;
  }
};

// actions
const actions = {
  /**
   * Connect Socket to Server
   * @param commit
   * @constructor
   */
  SOCKET_CONNECT({ commit }) {
    // Fired when the socket connects
    console.log("Socket Connected M1");
    commit("SOCKET_CONNECT", true);
  },

  /**
   * Auth Via Socket
   * @param commit
   * @constructor
   */
  SOCKET_LOGIN() {
    console.log("Sending Auth Request");
    let access_token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhbWl0QHNtYXJ0ZGF0YWluYy5uZXQiLCJwb3J0YWxfaWQiOiIxIiwicG9ydGFsIjoic3VwZXJhZG1pbiIsImlkIjoxLCJpYXQiOjE1ODc2MjkzMzl9.lcWpU8RySm6G4R55Yd5lUY4gFGnsT8nW3l6Y7F0_Eq4";
    let userDetails = {
      access_token
    };
    new Vue().$socket.emit("join", userDetails);
  },
  "SOCKET_join-response"({ commit }, data) {
    commit("AUTH_RESPONSE", data);
    console.log(data);
    console.log(data.success ? "successfully connected" : "could not connect");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

import Vue from "vue";
import Vuex from "vuex";

import auth from "./modules/auth";

/**
 * @use Import all module for vuex and register in Store
 * Common Module
 */
import jsons from "./modules/jsons";
import platformSocket from "./modules/innov-socket";

/**
 * Basic Socket Connection Management
 */
// import socket from "./modules/socket";

/**
 * @use Import all module for vuex and register in Store
 * Super Admin Portal
 */
import saDVIRChecklistManager from "./modules/super-admin/dvirChecklistManager";


Vue.use(Vuex);

// const debug = process.env.NODE_ENV !== 'production'
let stores = "";
  stores = {
    auth,
    jsons,
    platformSocket,
    saDVIRChecklistManager,
  };

/**
 * @desc Inject module in store
 */
export default new Vuex.Store({
  modules: stores
});

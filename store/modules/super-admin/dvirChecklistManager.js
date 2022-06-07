/**
 ** Vendor Management module is handle all transaction i.e. related to the API Server calls
 *! Update if Vendor Module logic re-newed||Modified.
 *
 */
import {
  getSocketAuthToken,
  getAuthToken,
  getBaseUrl,
  unauthorizedHandler,
  getPortalID,
  getLoggedInUserInfo
} from "@/plugins/Auth.js";
import axios from "axios";
import Vue from "vue";
import moment from "moment";

const state = {
  platform: "superadmin",
  isConnected: false,

  /** Listing Starts **/
  DVIRCheckListStats: [],
  DVIRChecklistTotal: 0,
  DVIRChecklistList: [],
  dvirChecklistListLoader: true,
  checklistNotes: [],
  dvirChecklistInfo: {
    name: "",
    lang: "",
    category: [
      {
        category: "",
        items: [
          {
            name: "",
            critical_leval: "",
            icon: "",
            large_icon: ""
          }
        ]
      }
    ],
    effective_date: ""
  },
  dvirChecklistInfoObj: {
    name: "",
    lang: "",
    category: [
      {
        category: "",
        items: [
          {
            name: "",
            critical_leval: "",
            icon: "",
            large_icon: ""
          }
        ]
      }
    ],
    effective_date: ""
  },
  templateFor: [
    {
      id: "forgot_password",
      value: "Forgot Password"
    }
  ],
  languages: [
    {
      id: "en",
      value: "English"
    },
    {
      id: "ar",
      value: "Arabic"
    }
  ],
  categories: [],
  criticalLevel: [],
  /** Listing Ends **/

  /** Log History Starts */
  dvirChecklistLogHistory: "",
  dvirChecklistLogHistoryCount: 1,
  /** Log History Ends */

  /** Staff Notes Starts **/
  emaiTemplateManagerNotes: [],
  /** Legal manager Notes Ends **/

  /** Legal manager Add Starts **/
  legalContractBasicInfo: "",
  /** Legal manager Add Ends **/

  /** Legal manager detail Start **/
  legalManagerInfo: {
    id: 0,
    relation_id: 0,
    code: 0,
    emp_type: 0,
    position: 0,
    email: "0",
    image: "",
    first_name: "",
    last_name: "",
    phone: "",
    dob: "",
    address: "",
    unit_number: "",
    gender: 1,
    status: true,
    created_by: 0,
    updated_by: "",
    lastloggedIn: "",
    createdAt: "",
    updatedAt: "",
    deletedAt: "",
    user_roles: [
      {
        id: 0,
        user_id: 0,
        role_id: 0,
        status: true,
        created_by: "",
        updated_by: "",
        createdAt: "",
        updatedAt: ""
      }
    ]
  }
  /** Staff Details Ends **/
};

// mutations
const mutations = {
  /** Listing Starts **/
  SET_DVIR_CHECKLIST_MANAGER_STATS(state, DVIRCheckListStats) {
    state.DVIRCheckListStats = DVIRCheckListStats;
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories;
  },
  SET_CRITICAL_LEVELS(state, criticalLevel) {
    state.criticalLevel = criticalLevel;
  },
  SET_DVIR_CHECKLIST_MANAGER_LIST(state, DVIRChecklistList) {
    state.DVIRChecklistList = DVIRChecklistList;
  },
  SET_DVIR_LIST_LOADER(state, flag) {
    state.dvirChecklistListLoader = flag;
  },

  SET_DVIR_CHECKLIST_MANAGER_TOTAL(state, DVIRChecklistTotal) {
    state.DVIRChecklistTotal = DVIRChecklistTotal;
  },
  SET_CHECKLIST_NOTES(state, checklistNotes) {
    state.checklistNotes = checklistNotes;
  },
  /** Listing Ends **/

  /** LEGAL_MANAGER Log History Section Starts **/
  SET_DVIR_CHECKLIST_LOG_HISTORY(state, dvirChecklistLogHistory) {
    state.dvirChecklistLogHistory = dvirChecklistLogHistory;
  },
  SET_DVIR_CHECKLIST_LOG_HISTORY_COUNT(state, dvirChecklistLogHistoryCount) {
    state.dvirChecklistLogHistoryCount = dvirChecklistLogHistoryCount;
  },
  /** Vendor Log History Section Ends **/

  /** Notes Section Starts **/
  SET_EMAIL_TEMPLATE_MANAGER_NOTES(state, emaiTemplateManagerNotes) {
    state.emaiTemplateManagerNotes = emaiTemplateManagerNotes;
  },
  /** Notes Section Ends **/

  /** Socket Section Starts **/
  SET_IS_CONNECTED(state, flag) {
    state.isConnected = flag;
  },
  /** Socket Section Ends **/

  /** Vendor Add Section Starts **/

  /** Template Manager detail Section Starts **/
  SET_DVIR_CHECKLIST_MANAGER_INFO(state, dvirChecklistInfo) {
    state.dvirChecklistInfo = dvirChecklistInfo;
  }
  /** Template Manager Details Section Ends **/
};

// getters
const getters = {
  /** Listing Starts **/
  getDVIRCheckListInfo() {
    return state.dvirChecklistInfo;
  },
  getLanguages() {
    return state.languages;
  },
  getCriticalLevel() {
    return state.criticalLevel;
  },
  getCategories() {
    return state.categories;
  },
  getTemplateForList(state) {
    return state.templateFor;
  },
  getDVIRCheckListStats(state) {
    return state.DVIRCheckListStats;
  },
  getDVIRChecklistList(state) {
    return state.DVIRChecklistList;
  },
  dvirChecklistListLoader(state){
    return state.dvirChecklistListLoader;
  },
  getEmailTemplateManagerTotal(state) {
    return state.emailTemplateManagerTotal;
  },
  /** Listing Ends **/

  /** Template Manager Log History Section Starts **/
  getDvirChecklistLogHistory(state) {
    return state.dvirChecklistLogHistory;
  },
  getDvirChecklistLogHistoryCount(state) {
    return state.dvirChecklistLogHistoryCount;
  },
  getDvirChecklistTotal(state) {
    return state.DVIRChecklistTotal;
  },
  /** Vendor Log History Section Ends **/

  /** Notes Section Starts **/
  getEmailTemplateManagerNotes(state) {
    return state.emaiTemplateManagerNotes;
  },
  /** Notes Section Ends **/

  /** Socket Section Starts **/
  isConnected(state) {
    return state.isConnected;
  },
  /** Socket Section Ends **/

  getLoggedInUserInfo(state) {
    return getLoggedInUserInfo(state.platform);
  },
  getChecklistNotes(state) {
    return state.checklistNotes;
  }
  /** Details Section Ends **/
};

// actions
const actions = {
  /**
   * Connect to server socket for super admin | Role Management ws
   * @param {*} state
   */
  socketConnect({ state }) {
    let access_token = getSocketAuthToken(state.platform);
    let payload = { access_token };
    this._vm.$socket.emit("join", payload);
  },

  /**
   * Cross Verify with serve response
   * @param {*} commit
   * @param {*} data
   */
  "vsocket-join-response"({ commit }, data) {
    commit("SET_IS_CONNECTED", data.success);
  },

  /**
   * disconnect socket for the module!
   */
  vsocketDisconnect({ commit }, flag) {
    commit("SET_IS_CONNECTED", flag);
  },

  // Emit Get Role Stats Event
  emitGetDVIRChecklistStatsEvent({ state }) {
    console.log("Asking for stats");
    let access_token = getSocketAuthToken(state.platform);
    let portal_id = getPortalID(state.platform);
    console.log(portal_id, state.platform);
    this._vm.$socket.emit("co-getDvirStats", {
      access_token,
      id: portal_id,
      portal: state.platform
    });
  },

  /**
   * Get Role Stats Data From Socket
   * @param commit
   * @param resp
   */
  "vsocket-co-getDvirStats"({ commit }, resp) {
    console.log("Stats Received");
    if (resp && resp.data) {
      const stats = resp.data;
      //Todo: API or Socket Code here
      console.log(stats);
      let data = [
        {
          title: "Active DVIR CheckList Templates",
          icon: "email-active-template.svg",
          colorClass: "",
          count: stats["active"] ? stats["active"] : 0,
          type: "active"
        },
        {
          title: "Inactive DVIR CheckList Templates",
          icon: "email-inactive-template.svg",
          colorClass: "",
          count: stats["inactive"] ? stats["inactive"] : 0,
          type: "inactive"
        },
        {
          title: "Total DVIR CheckList Templates",
          icon: "email--total-template.svg",
          colorClass: "",
          count: stats["inactive"] + stats["active"],
          type: ""
        }
      ];
      commit("SET_DVIR_CHECKLIST_MANAGER_STATS", data);
    } else {
      console.log("Fetching Stats Failed");
    }
  },

  // Fetch Admin form Server End
  emitGetDVIRChecklistListEvent({ commit, state }, data) {
    let access_token = getSocketAuthToken(state.platform);
    let portal_id = getPortalID(state.platform);
    let requestData = {
      search: data && data.search ? data.search : "",
      sort: "createdAt",
      sortOrder: "desc",
      page: data && data.page ? data.page : 0,
      limit: data && data.limit ? data.limit : 10,
      portal: state.platform,
      portal_id: portal_id,
      status: data && data.status ? data.status : ""
    };
    if (data && data.startDate && data.endDate) {
      requestData["date_from"] = mysqlDate(data.startDate);
      requestData["date_to"] = mysqlDate(data.endDate, true);
    }
    this._vm.$socket.emit("co-getDvirList", {
      access_token,
      id: portal_id,
      body: requestData
    });
    commit("SET_DVIR_LIST_LOADER", true);
  },

  "vsocket-co-getDvirList"({ commit }, resp) {
    console.log(resp);
    if (resp && resp.statusCode == 200) {
      // Update get using response meta
      let data = resp;
      console.log(data);
      // debugger;
      let DVIRManagerCheckList = [];
      if (resp.data && resp.data.rows && resp.data.rows.length > 0) {
        resp.data.rows.forEach(item => {
          try {
            DVIRManagerCheckList.push({
              id: item.id,
              name: item["name"],
              effective_date: moment(item["effective_date"]).format("DD/MM/YYYY"),
              status: item.status,
              language: item["lang"],

              createdBy: item["created_by"]
                ? item["created_by"]["first_name"] + " " + item["created_by"]["last_name"]
                : "-",
              createdByImage: item["created_by"] ? item["created_by"]["image"] : "",
              updatedByImage: item["updated_by"] ? item["updated_by"]["image"] : "",
              createdAt: moment(item.createdAt).format("DD/MM/YYYY hh:mm A"),
              lastUpdatedBy: item["updated_by"]
                ? item["updated_by"]["first_name"] + " " + item["updated_by"]["last_name"]
                : "",
              lastUpdatedAt: item.updatedAt
                ? moment(item.updatedAt).format("DD/MM/YYYY hh:mm A")
                : "",
              actions: ""
            });
          } catch (e) {
            console.log("Error @ Modifying Staff List Response ", e);
          } finally {
            console.log(DVIRManagerCheckList)
            commit("SET_DVIR_CHECKLIST_MANAGER_TOTAL", resp.data.count);
            commit("SET_DVIR_CHECKLIST_MANAGER_LIST", DVIRManagerCheckList);
          }
        });
    }
    else {
      commit("SET_DVIR_CHECKLIST_MANAGER_TOTAL", 0);
      commit("SET_DVIR_CHECKLIST_MANAGER_LIST", []);
    }
      console.log("Vendor List Receiving Complete");
    } else {
      console.log("Error While Receiving Vendor List");
    }
    setTimeout(() => {
      commit("SET_DVIR_LIST_LOADER", false);
    }, 600);
  },

  /**
   * Delete Email Template By Id
   *
   * @param commit
   * @param adminId
   */
  async actionOnDVIRCheckListById({ commit }, body) {
    let url = `/dvir/${body.id}/dvir`;
    let resp = await axios.delete(url, {
      data: {
        action: body.action,
        portal: state.platform,
        portal_id: getPortalID(state.platform)
      },
      headers: {
        Authorization: getAuthToken(state.platform)
      }
    });
    console.log(commit);
    return resp["data"];
  },

  /**
   * Save Email Template
   *
   * @param commit
   * @param profInfo
   * @returns {Promise<void>}
   */
  async saveEmailTemplateObject({ state }, body) {
    body.portal = state.platform;
    body.portal_id = getPortalID(state.platform);

    let url = `/emails/emails`;
    let resp = await axios.post(url, body, {
      headers: {
        Authorization: getAuthToken(state.platform)
      }
    });
    console.log(resp);
    return {
      statusCode: 200
    };
  },
  async getCategoryList({ commit, state }) {
    let resp = await axios.get(`/dvir/getdvir_category`, {
      headers: {
        Authorization: getAuthToken(state.platform)
      }
    });
    commit("SET_CATEGORIES", resp.data.data);
  },
  async getCriticalLevelList({ commit, state }) {
    let resp = await axios.get(`/dvir/getdvir_criticalleval`, {
      headers: {
        Authorization: getAuthToken(state.platform)
      }
    });
    commit("SET_CRITICAL_LEVELS", resp.data.data);
  },
  async createDvirChecklist({ state }, data) {
    data.body.portal = state.platform;
    let portal_id = getPortalID(state.platform);
    let resp;
    if (data.id) {
      resp = await axios.put(`/dvir/${data.id}/dvir`, data.body, {
        headers: {
          Authorization: getAuthToken(state.platform)
        }
      });
    } else {
      resp = await axios.post(`/dvir/${portal_id}/dvir`, data.body, {
        headers: {
          Authorization: getAuthToken(state.platform)
        }
      });
    }
    // commit("SET_STAFF_ASSIGN", resp.data);
    return resp.data;
  },
  /**
   * Update Email Template
   *
   * @param commit
   * @param profInfo
   * @returns {Promise<void>}
   */
  async updateEmailTemplateObject({ state }, body) {
    body.portal = state.platform;
    body.portal_id = getPortalID(state.platform);

    let url = `/emails/${body.id}/emails`;
    let resp = await axios.put(url, body, {
      headers: {
        Authorization: getAuthToken(state.platform)
      }
    });
    console.log(resp);
    return {
      statusCode: 200
    };
  },

  // Details Section Starts

  /**
   * Get Legal By Id
   *
   * @param state
   * @param email template id
   */
  async getChecklistById({ commit, state }, checklistId) {
    const headPayload = {
      headers: { Authorization: getAuthToken(state.platform) }
    };
    let url = `/dvir/${checklistId}/dvir`;
    const apiResponse = await axios
      .get(url, headPayload)
      .then(response => {
        let responseData = "";
        if (response.data.statusCode == 200) {
          responseData = response.data.data;
          console.log(responseData);
          let dvirCategory = [];
          if (responseData.dvir_categories) {
            responseData.dvir_categories.forEach(cat => {
              let dvirNewObj = {
                category: cat.category,
                edit: false,
                id: cat.id,
                items: []
              };
              cat.dvir_items.forEach(dvir => {
                let dvirItems = {
                  id: dvir.id,
                  name: dvir.name,
                  critical_leval: dvir.critical_leval,
                  icon: dvir.icon,
                  large_icon: dvir.large_icon
                }
                dvirNewObj.items.push(dvirItems);
              });
              dvirCategory.push(dvirNewObj)
            });
          }
          if (responseData.lang) {
            responseData.lang = state.languages.find(item => responseData.lang == item.value);
            // responseData.lang = state.languages.find(item => responseData.lang == item.id);
          }
          console.log(dvirCategory)
          responseData.category = dvirCategory;
          responseData.createdTime = moment(responseData.createdAt).format("HH:mm A");
          responseData.updatedTime = moment(responseData.updatedAt).format("HH:mm A");
          responseData.createdAt = moment(responseData.createdAt).format("DD/MM/YYYY");
          responseData.updatedAt = moment(responseData.updatedAt).format("DD/MM/YYYY");
         
          responseData.status = responseData.status ? "Active" : "Inactive";
          responseData.createdBy = responseData.created_by;
          responseData.modifiedBy = responseData.updated_by;
          if (responseData.created_by) {
            responseData.createdByImage = responseData.created_by.image;
            responseData.createdByName = `${responseData.created_by.first_name} ${responseData.created_by.last_name}`;
            responseData.createdByEmail = `${responseData.created_by.email}`;
            responseData.createdByPhone = `${responseData.created_by.phone}`;
          }
          if (responseData.updated_by) {
            responseData.modifiedByImage = responseData.updated_by.image;
            responseData.modifiedByName = `${responseData.updated_by.first_name} ${responseData.updated_by.last_name}`;
            responseData.modifiedByEmail = `${responseData.updated_by.email}`;
            responseData.modifiedByPhone = `${responseData.updated_by.phone}`;
          }
          commit("SET_DVIR_CHECKLIST_MANAGER_INFO", responseData);
        } else {
          responseData = response.data;
        }
        return responseData;
      })
      .catch(({ response }) => {
        unauthorizedHandler(response.data);
        return response.data;
      });
    return apiResponse;
  },
    // Fetch User Access Permission List
  async fetchUserAccessPermission({ state }, user_id) {
    console.log(state.platform);
    let url = `roles-staff/${user_id}/getUserAccess`;
    const userAccessData = await axios.get(getBaseUrl() + url);
    const userAccess = JSON.stringify(userAccessData.data.data);
    return userAccess;
  },
  async resetAssistantModel({ commit }) {
    commit("SET_DVIR_CHECKLIST_MANAGER_INFO", {
      name: "",
      lang: "",
      category: [
        {
          category: "",
          items: [
            {
              name: "",
              critical_leval: "",
              icon: "",
              large_icon: ""
            }
          ]
        }
      ],
      effective_date: ""
    });
  },

  /**
   * Get Log History
   * @param commit
   * @param data
   * @returns {any}
   */
   async getLogHistory({ commit }, data) {
    let url = `dvir/${data.id}/getLog`;
    let resp = await axios.post(url, data.body, {
      headers: {
        Authorization: getAuthToken(state.platform)
      }
    });
    const apiData = resp.data;
    let responseData = [];
    let count = 0;
    let logData = [];

    if (apiData.statusCode == 200 && apiData.data.count > 0) {
    
      count = apiData.data.count;
      let logCount = apiData.data.rows.length;
      let timestamp = [];
      let updatedAt = '';
      let check_data = ['dvir_id','created_by','updated_by','updatedAt',"createdAt"];
      for(let i = 0; i < logCount; i++){
        let item = apiData.data.rows[i];
        let itemCreatedAt = moment(item.createdAt).unix();
        
        if(!timestamp.includes(itemCreatedAt) && item.type == 1){
          timestamp.push(itemCreatedAt);  
          logData.push([item]);
        }else{
          if(item.type == 2){
            timestamp.push(updatedAt); 
            logData.push([item]);
          }else{
            let key = timestamp.indexOf(itemCreatedAt);
            logData[key].push(item);
          }
        }
      }

      logData.forEach(data => {
        
        if(data.length > 1){
          let actionDate = Vue.moment(data[0].createdAt).format("DD MMM YYYY");
          let activitiesData = [];
          data.forEach(item => {
              const data_changed = JSON.parse(item.data_changed);
              const previous_data_values = JSON.parse(item.previous_data_values);
              const data_values = JSON.parse(item.data_values);
              var fieldName = "";
              var previous_data = [];
              var current_data = [];
              var result = checkDataChanged(data_changed,check_data);

              if(result){       
                for (let field in data_changed) {
                  if (!['updatedat','createdat','portal_id', 'portal'].includes(field.toLowerCase()) && ![null, ""].includes(data_values[field])) {
                    fieldName = field
                    .replace(/_/g, " ")
                    .split(" ")
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                    .join(" ");
                    previous_data = previous_data_values[field];
                    current_data = data_values[field];
                    // previous_data = previous_data_values[field]
                    //   ? previous_data_values[field].toString().replaceAll("_", " ")
                    //   : previous_data_values[field];
                    // current_data = data_values[field]
                    //   ? data_values[field].toString().replaceAll("_", " ")
                    //   : data_values[field];
        
                    if (["dob","issued_on","exp_date","from","to","from_iso","to_iso","joining_date", "resignation_date", "relieving_date"].includes(field.toLowerCase())) {
                      previous_data = previous_data ? moment(previous_data).format("DD/MM/YYYY") : "";
                      current_data = current_data ? moment(current_data).format("DD/MM/YYYY") : "";
                    }
        
                    if (field.toLowerCase() == "working_since") {
                      previous_data = previous_data
                        ? moment(previous_data).format("D/M/YYYY, h:mm A")
                        : previous_data;
                      current_data = current_data
                        ? moment(current_data).format("D/M/YYYY, h:mm A")
                        : current_data;
                    }

                    switch (field.toLowerCase()) {
                      case 'dvir_id':
                        previous_data = previous_data ? previous_data.name:'';
                        current_data = current_data  ? current_data.name:'';
                        break;
                      case 'effective_date':
                          previous_data = previous_data ? moment(previous_data).format("DD/MM/YYYY"):'';
                          current_data = current_data  ? moment(current_data).format("DD/MM/YYYY"):'';
                          break;
                      case 'status':
                        previous_data = previous_data ? "Active" : "Inactive";
                        current_data = current_data ? "Active" : "Inactive";
                        break;
                      case 'icon': 
                        previous_data = previous_data ? `<img src=${previous_data} height="20" width="20"/>`: ''
                        current_data = current_data ? `<img src=${current_data} height="20" width="20"/>`: ''
                        break;
                      case 'large_icon': 
                        previous_data = previous_data ? `<img src=${previous_data} height="20" width="20"/>`: ''
                        current_data = current_data ? `<img src=${current_data} height="20" width="20"/>`: ''
                        break;
                      case 'created_by': 
                        if(previous_data && previous_data.image){
                          previous_data = previous_data ? `<p><img src="${previous_data.image}" height="50" width="50"/></p><div>${previous_data.first_name}${previous_data.last_name}</div> <div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                        }else{
                          previous_data = previous_data ? `<p><span class="initialletter">${getNameIntials(previous_data.first_name + ' ' + previous_data.last_name)} </span></p><div>${previous_data.first_name} ${previous_data.last_name}</div><div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                        }
                        if(current_data && current_data.image){
                          current_data = current_data ? `<p><img src="${current_data.image}" height="50" width="50"/></p><div>${current_data.first_name} ${current_data.last_name}</div><div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                        }else{
                          current_data = current_data ? `<p><span class="initialletter">${getNameIntials(current_data.first_name + ' ' + current_data.last_name)} </span></p><div>${current_data.first_name} ${current_data.last_name}</div><div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                        }
                        createdCount++;
                        console.log("createdCount",createdCount);
                      break;
                      case 'updated_by':
                        if(previous_data && previous_data.image){
                          previous_data = previous_data ? `<p><img src="${previous_data.image}" height="50" width="50"/></p><div>${previous_data.first_name}${previous_data.last_name}</div> <div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                        }else{
                          previous_data = previous_data ? `<p><span class="initialletter">${getNameIntials(previous_data.first_name + ' ' + previous_data.last_name)} </span></p><div>${previous_data.first_name} ${previous_data.last_name}</div><div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                        }
                        if(current_data && current_data.image){
                          current_data = current_data ? `<p><img src="${current_data.image}" height="50" width="50"/></p><div>${current_data.first_name} ${current_data.last_name}</div><div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                        }else{
                          current_data = current_data ? `<p><span class="initialletter">${getNameIntials(current_data.first_name + ' ' + current_data.last_name)} </span></p><div>${current_data.first_name} ${current_data.last_name}</div><div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                        } 
                        // previous_data = previous_data ? `<p><img src="${previous_data.image}" height="50" width="50"/></p><div>${previous_data.first_name}${previous_data.last_name}</div> <div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                        // current_data = current_data ? `<p><img src="${current_data.image}" height="50" width="50"/></p><div>${current_data.first_name} ${current_data.last_name}</div><div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                        break;
                      default:
                        previous_data = previous_data ? previous_data: "";
                        current_data = current_data  ? current_data : "";
                    }
                    if(field!= 'dvir_id'){
                    activitiesData.push({
                      field_name: fieldName,
                      old_Value: previous_data,
                      new_value: current_data
                    });
                  }
                  }
                }
              }
            })
          let dIndex = responseData.findIndex(x => x.date === actionDate);
          let itemTitle = (data[0].type == 1) ? 'Created following data' : (data[0].type == 2) ? 'Updated following data' : (data[0].type == 3) ? 'Deleted following data': ''; 
  
          if (dIndex == -1) {
            responseData.push({
              date: actionDate,
              data: [
                {
                  id: data[0].id,
                  title: itemTitle,
                  dateTime: Vue.moment(data[0].createdAt).format("D/M/YYYY, hh:mm:ss A"),
                  author: {
                    fullName: `${getLoggedInUserInfo(state.platform).fullName}`,
                    pic: `${getLoggedInUserInfo(state.platform).pic}`
                  },
                  activities: activitiesData,
                  type: data[0].type
                }
              ]
            });
          } else {
            responseData[dIndex].data.push({
              id: data[0].id,
              title: itemTitle,
              dateTime: Vue.moment(data[0].createdAt).format("D/M/YYYY, hh:mm:ss A"),
              author: {
                    fullName: `${getLoggedInUserInfo(state.platform).fullName}`,
                    pic: `${getLoggedInUserInfo(state.platform).pic}`
                  },
              activities: activitiesData,
              type: data[0].type
            });
          }
        }
        else if(data.length == 1)
        {
          const data_changed = JSON.parse(data[0].data_changed);
          const previous_data_values = JSON.parse(data[0].previous_data_values);
          const data_values = JSON.parse(data[0].data_values);
          let actionDate = Vue.moment(data[0].createdAt).format("DD MMM YYYY");
          let activitiesData = [];

          var result = checkDataChanged(data_changed,check_data);
          if(result){
            for (let field in data_changed) {
              if (!['updatedat','createdat','portal_id', 'portal'].includes(field.toLowerCase()) && ![null, ""].includes(data_values[field])) {
                let fieldName = field
                .replace(/_/g, " ")
                .split(" ")
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(" ");
                let previous_data = previous_data_values[field];
                let current_data = data_values[field];
              // let previous_data = previous_data_values[field]
              //   ? previous_data_values[field].toString().replaceAll("_", " ")
              //   : previous_data_values[field];
              // let current_data = data_values[field]
              //   ? data_values[field].toString().replaceAll("_", " ")
              //   : data_values[field];
  
                  if (["dob","issued_on","exp_date","from","to","from_iso","to_iso","joining_date", "resignation_date", "relieving_date"].includes(field.toLowerCase())) {
                    previous_data = previous_data ? moment(previous_data).format("DD/MM/YYYY") : "";
                    current_data = current_data ? moment(current_data).format("DD/MM/YYYY") : "";
                  }
  
                  if (field.toLowerCase() == "working_since") {
                    previous_data = previous_data
                      ? moment(previous_data).format("D/M/YYYY, h:mm A")
                      : previous_data;
                    current_data = current_data
                      ? moment(current_data).format("D/M/YYYY, h:mm A")
                      : current_data;
                  }
  
                  switch (field.toLowerCase()) {
                    case 'dvir_id':
                      previous_data = previous_data ? previous_data.name:'';
                      current_data = current_data  ? current_data.name:'';
                      break;
                    case 'effective_date':
                        previous_data = previous_data ? moment(previous_data).format("DD/MM/YYYY"):'';
                        current_data = current_data  ? moment(current_data).format("DD/MM/YYYY"):'';
                        break;
                    case 'status':
                      previous_data = previous_data ? "Active" : "Inactive";
                      current_data = current_data ? "Active" : "Inactive";
                      break;
                    case 'icon': 
                      previous_data = previous_data ? `<img src=${previous_data} height="20" width="20"/>`: ''
                      current_data = current_data ? `<img src=${current_data} height="20" width="20"/>`: ''
                      break;
                    case 'large_icon': 
                      previous_data = previous_data ? `<img src=${previous_data} height="20" width="20"/>`: ''
                      current_data = current_data ? `<img src=${current_data} height="20" width="20"/>`: ''
                      break;
                    case 'created_by': 
                      previous_data = previous_data ? `<p><img src="${previous_data.image}" height="50" width="50"/></p><div>${previous_data.first_name}${previous_data.last_name}</div> <div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                      current_data = current_data ? `<p><img src="${current_data.image}" height="50" width="50"/></p><div>${current_data.first_name} ${current_data.last_name}</div><div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                      break;
                    case 'updated_by': 
                      previous_data = previous_data ? `<p><img src="${previous_data.image}" height="50" width="50"/></p><div>${previous_data.first_name}${previous_data.last_name}</div> <div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                      current_data = current_data ? `<p><img src="${current_data.image}" height="50" width="50"/></p><div>${current_data.first_name} ${current_data.last_name}</div><div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
                      break;
                    default:
                      previous_data = previous_data ? previous_data: "";
                      current_data = current_data  ? current_data : "";
                  }
  
                activitiesData.push({
                  field_name: fieldName,
                  old_Value: previous_data,
                  new_value: current_data
                });
            }

          }
        }
        let dIndex = responseData.findIndex(x => x.date === actionDate);
        let itemTitle = (data[0].type == 1) ? 'Created following data' : (data[0].type == 2) ? 'Updated following data' : (data[0].type == 3) ? 'Deleted following data': ''; 
        if(activitiesData != ""){
          if (dIndex == -1) {
            responseData.push({
              date: actionDate,
              data: [
                {
                  id: data[0].id,
                  title: itemTitle,
                  dateTime: Vue.moment(data[0].createdAt).format("D/M/YYYY, hh:mm:ss A"),
                  author: {
                    fullName: `${getLoggedInUserInfo(state.platform).fullName}`,
                    pic: `${getLoggedInUserInfo(state.platform).pic}`
                  },
                  activities: activitiesData,
                  type: data[0].type
                }
              ]
            });
          } else {
            responseData[dIndex].data.push({
              id: data[0].id,
              title: itemTitle,
              dateTime: Vue.moment(data[0].createdAt).format("D/M/YYYY, hh:mm:ss A"),
              author: {
                    fullName: `${getLoggedInUserInfo(state.platform).fullName}`,
                    pic: `${getLoggedInUserInfo(state.platform).pic}`
                  },
              activities: activitiesData,
              type: data[0].type
            });
          }
        }
        }

      })
    }
    // if (apiData.statusCode == 200 && apiData.data.count > 0) {
    //   apiData.data.rows.forEach(item => {
    //     count = apiData.data.count;
    //     const data_changed = JSON.parse(item.data_changed);
    //     const previous_data_values = JSON.parse(item.previous_data_values);
    //     const data_values = JSON.parse(item.data_values);
    //     let actionDate = Vue.moment(item.createdAt).format("DD MMM YYYY");
    //     let activitiesData = [];
    //     for (let field in data_changed) {
    //       if (!['updatedat','createdat','portal_id', 'portal'].includes(field.toLowerCase()) && ![null, ""].includes(data_values[field])) {
    //         let previous_data = previous_data_values[field];
    //         let current_data = data_values[field];

    //         let fieldName = field
    //           .replace(/_/g, " ")
    //           .split(" ")
    //           .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    //           .join(" ");

    //         // previous_data = previous_data_values[field]
    //         //   ? previous_data_values[field].toString().replace(/_/g, " ")
    //         //   : "";
    //         // current_data = data_values[field]
    //         //   ? data_values[field].toString().replace(/_/g, " ")
    //         //   : "";
    //         switch (field.toLowerCase()) {
    //           case 'dvir_id':
    //             previous_data = previous_data ? previous_data.name:'';
    //             current_data = current_data  ? current_data.name:'';
    //             break;
    //           case 'effective_date':
    //               previous_data = previous_data ? moment(previous_data).format("DD/MM/YYYY"):'';
    //               current_data = current_data  ? moment(current_data).format("DD/MM/YYYY"):'';
    //               break;
    //           case 'status':
    //             previous_data = previous_data ? "Active" : "Inactive";
    //             current_data = current_data ? "Active" : "Inactive";
    //             break;
    //           case 'icon': 
    //             previous_data = previous_data ? `<img src=${previous_data} height="20" width="20"/>`: ''
    //             current_data = current_data ? `<img src=${current_data} height="20" width="20"/>`: ''
    //             break;
    //           case 'large_icon': 
    //             previous_data = previous_data ? `<img src=${previous_data} height="20" width="20"/>`: ''
    //             current_data = current_data ? `<img src=${current_data} height="20" width="20"/>`: ''
    //             break;
    //           case 'created_by': 
    //             previous_data = previous_data ? `<p><img src="${previous_data.image}" height="50" width="50"/></p><div>${previous_data.first_name}${previous_data.last_name}</div> <div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
    //             current_data = current_data ? `<p><img src="${current_data.image}" height="50" width="50"/></p><div>${current_data.first_name} ${current_data.last_name}</div><div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
    //             break;
    //           case 'updated_by': 
    //             previous_data = previous_data ? `<p><img src="${previous_data.image}" height="50" width="50"/></p><div>${previous_data.first_name}${previous_data.last_name}</div> <div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
    //             current_data = current_data ? `<p><img src="${current_data.image}" height="50" width="50"/></p><div>${current_data.first_name} ${current_data.last_name}</div><div> ${moment(data_values['createdAt']).format("DD/MM/YYYY")}</div>`: ''
    //             break;
    //           default:
    //             previous_data = previous_data ? previous_data: "";
    //             current_data = current_data  ? current_data : "";
    //         }
    //         activitiesData.push({
    //           field_name: fieldName,
    //           old_Value: previous_data,
    //           new_value: current_data
    //         });
    //       }
    //     }
    //     // for (var field in data_changed) {
    //     //   if (field != "updatedAt") {
    //     //     activitiesData.push({
    //     //       field_name: field,
    //     //       old_Value: previous_data_values[field],
    //     //       new_value: data_values[field]
    //     //     });
    //     //   }
    //     // }
    //     let dIndex = responseData.findIndex(x => x.date === actionDate);
    //     let itemTitle = (item.type == 1) ? 'Created following data' : (item.type == 2) ? 'Updated following data' : (item.type == 3) ? 'Deleted following data': ''; 

    //     if (dIndex == -1) {
    //       responseData.push({
    //         date: actionDate,
    //         data: [
    //           {
    //             id: item.id,
    //             title: itemTitle,
    //             dateTime: Vue.moment(item.createdAt).format("D/M/YYYY, h:mm A"),
    //             author: {
    //               fullName: `${getLoggedInUserInfo(state.platform).fullName}`,
    //               pic: `${getLoggedInUserInfo(state.platform).pic}`
    //             },
    //             type: item.type,
    //             activities: activitiesData
    //           }
    //         ]
    //       });
    //     } else {
    //       responseData[dIndex].data.push({
    //         id: item.id,
    //         title: itemTitle,
    //         dateTime: Vue.moment(item.createdAt).format("D/M/YYYY, h:mm A"),
    //         author: {
    //           fullName: `${getLoggedInUserInfo(state.platform).fullName}`,
    //           pic: `${getLoggedInUserInfo(state.platform).pic}`
    //         },
    //         type: item.type,
    //         activities: activitiesData
    //       });
    //     }
    //   });
    // }
    commit("SET_DVIR_CHECKLIST_LOG_HISTORY", responseData);
    commit("SET_DVIR_CHECKLIST_LOG_HISTORY_COUNT", count);
    return responseData;
  },

  /**
   * Fetch Server Notes related to the module
   * @param {*}  {state, commit}
   * @param {*} payload
   */
  async fetchNotes({ state, commit }, payload) {
    const headPayload = {
      headers: { Authorization: getAuthToken(state.platform) }
    };
    const apiResponse = await axios
      .post(getBaseUrl() + `dvir/listNotes`, payload, headPayload)
      .then(response => {
        const apiData = response.data;
        if (apiData.statusCode == 200) {
          let responseData = [];
          const rows = apiData.data.rows;
          if (rows.length > 0) {
            rows.forEach(item => {
              responseData.push({
                id: item.id,
                author: {
                  fullName: item.created_by.first_name + " " + item.created_by.last_name,
                  pic: item.created_by.image
                },
                note: item.notes,
                dateTime: moment(item.createdAt).format("DD/MM/YYYY hh:mm A"),
                flag: false
              });
            });
          }
          commit("SET_CHECKLIST_NOTES", responseData);
        } else {
          commit("SET_CHECKLIST_NOTES", []);
        }
        return apiData;
      })
      .catch(error => {
        unauthorizedHandler(error);
        return error;
      });
    return apiResponse;
  },

  /**
   * Role
   * @param {*} state
   */
  async removeNotes({ state }, payload) {
    const headers = { Authorization: getAuthToken(state.platform) };
    const apiResponse = await axios
      .delete(getBaseUrl() + `dvir/${payload.id}/notes`, {
        payload,
        headers,
        data: payload
      })
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        unauthorizedHandler(response.data);
        return response.data;
      });
    return apiResponse;
  },

  /**
   * Add New Notes related to the module
   * @param {*}  {state, commit}
   * @param {*} payload
   */
  async addNote({ state }, payload) {
    const headPayload = {
      headers: { Authorization: getAuthToken(state.platform) }
    };
    const requestPaylaod = {
      module: payload.module,
      notes: payload.notes,
      dvir_id: parseInt(payload.dvir_id)
    };
    const apiResponse = await axios
      .post(getBaseUrl() + `dvir/notes`, requestPaylaod, headPayload)
      .then(response => {
        const apiData = response.data;
        return apiData;
      })
      .catch(error => {
        unauthorizedHandler(error);
        return error;
      });
    return apiResponse;
  },

  /**
   * Update Notes
   * @param {*} state
   */
  async updateNotes({ state }, payload) {
    const headPayload = {
      headers: { Authorization: getAuthToken(state.platform) }
    };
    const requestPaylaod = {
      module: payload.module,
      notes: payload.note,
      dvir_id: payload.dvir_id
    };
    const apiResponse = await axios
      .put(getBaseUrl() + `/dvir/${payload.id}/notes`, requestPaylaod, headPayload)
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        unauthorizedHandler(response.data);
        return response.data;
      });
    return apiResponse;
  },

  /**
   * verify verification code
   * @param {*} state
   */

  async verificationCode({ state }, payload) {
    const headPayload = {
      headers: { Authorization: getAuthToken(state.platform) }
    };
    const apiResponse = await axios
      .post(getBaseUrl() + "roles-staff/verifyCode", payload, headPayload)
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        unauthorizedHandler(response.data);
        return response.data;
      });
    return apiResponse;
  },
  async commonUploadImage({ state }, body) {
    // Head Payload
    const headPayload = {
      headers: { Authorization: getAuthToken(state.platform) }
    };
    // URL
    let url = getBaseUrl() + `documents/commonUploadImage`;
    // Send Request
    let resp = await axios.post(url, body, headPayload);
    // Return Response
    return resp.data;
  },

  /**
   * If action yes then snd verification code
   * @param {*} state
   */

  async sendVerificationCode({ state }, obj) {
    const headPayload = {
      headers: { Authorization: getAuthToken(state.platform) }
    };
    const portalID = getPortalID(state.platform);
    console.log(portalID);
    const apiResponse = await axios
      .post(getBaseUrl() + `roles-staff/getAuthCode`, obj, headPayload)
      .then(response => {
        return response.data;
      })
      .catch(({ response }) => {
        unauthorizedHandler(response.data);
        return response.data;
      });
    return apiResponse;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

/**
 * MySQL date
 * @returns {string}
 */
function mysqlDate(date, endTimeFiller = false) {
  let resp = "";
  try {
    if (date) {
      if (endTimeFiller) {
        resp = moment(date)
          .endOf("day")
          .toString();
      } else {
        resp = moment(date)
          .startOf("day")
          .toString();
      }
    }
  } catch (e) {
    console.log("Error @ mySqlDate ", e);
  }
  return resp;
}
function getNameIntials(name){
  return name.split(' ').map(x => x.charAt(0)).join('').substr(0, 2).toUpperCase();
}

function checkDataChanged(dataChanged, checkData){
  for(let data in dataChanged){
    if(checkData.includes(data)){
      continue;
    }else{
      return true;
    }
  }
}
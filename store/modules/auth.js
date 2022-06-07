/**
 ** Auth module is handle all transaction i.e. related to the API Server calls
 *! Update if Auth logic re-newed||Modified.
 *
 */
import axios from "@/plugins/axios.js";
import {
  setItem,
  getItem,
  getAuthToken,
  getBaseUrl,
  unauthorizedHandler,
  getSocketAuthToken,
  getPortalID,
  getLoggedInUserID,
  getPortalCountryCurrencySymbol
} from "@/plugins/Auth.js";

const state = {
  userSuperAdmin: JSON.parse(getItem("innov-superadmin")),
  userAdmin: JSON.parse(getItem("innov-admin")),
  userTpc: JSON.parse(getItem("innov-tpc")),
  token: 123,
  countryListNav: [],
  notificationList: [],
  language: "en",
  country: "",
  // country: 229,
  clientSelected: false,
  userAccess: [],
  legalTemplate: "",
  portalCountry: "",
  portalStatus: false,
  portalCountryCurrency: "",
  portalCountryCurrencySymbol: "",
  portalCountryId: "",
  roleUpdated: false,
  isConnected: false,
  routeNext: "" // used when confirming leaving form in staff, wiot admin, reseller, tpc
};

// mutations
const mutations = {
  SET_AUTH(state, payload) {
    if (payload.type == "superadmin") {
      state.userSuperAdmin = payload.data;
    }
    if (payload.type == "admin") {
      state.userAdmin = payload.data;
    }
    if (payload.type == "tpc") {
      state.userTpc = payload.data;
    }
  },
  SET_COUNTRY_LIST_NAV(state, payload) {
    state.countryListNav = payload;
  },
  SET_NOTIFICATION_LIST(state, list) {
    state.notificationList = list;
  },
  SET_LANGUAGE(state, language) {
    state.language = language;
  },
  SET_COUNTRY(state, country) {
    state.country = country;
  },
  SET_CLIENT_SELECTED(state, clientSelected) {
    state.clientSelected = clientSelected;
  },
  SET_USER_ACCESS(state, userAccess) {
    state.userAccess = userAccess;
  },
  SET_LEGAL_TEMPLATE(state, legaltemplate) {
    state.legaltemplate = legaltemplate;
  },
  SET_PORTAL_COUNTRY(state, portalCountry) {
    state.portalCountry = portalCountry;
  },
  SET_PORTAL_STATUS(state, portalStatus) {
    console.log(portalStatus);
    state.portalStatus = portalStatus;
  },
  SET_PORTAL_COUNTRY_CURRENCY(state, portalCountryCurrency) {
    state.portalCountryCurrency = portalCountryCurrency;
  },
  SET_PORTAL_COUNTRY_ID(state, portalCountryId) {
    state.portalCountryId = portalCountryId;
  },
  SET_PORTAL_COUNTRY_CURRENCY_SYMBOL(state, portalCountryCurrencySymbol) {
    state.portalCountry = portalCountryCurrencySymbol;
  },
  SET_ROLE_UPDATE(state, roleUpdated) {
    state.roleUpdated = roleUpdated;
  },
  SET_IS_CONNECTED(state, flag) {
    state.isConnected = flag;
  },
  SET_NEXT(state, route) {
    state.routeNext = route;
  }
};

// getters
const getters = {
  getCurrency() {
    return getPortalCountryCurrencySymbol();
  },
  getCountryListNav(state) {
    return state.countryListNav;
  },
  getLanguage(state) {
    return state.language;
  },
  getCountry(state) {
    return state.country;
  },
  getClientSelected(state) {
    return state.clientSelected;
  },
  getUserAccess(state) {
    return state.userAccess;
  },
  getLegalTemplateUserId(state) {
    return state.legaltemplate;
  },
  getPortalCountry(state) {
    return state.portalCountry;
  },
  getPortalStatus(state) {
    alert();
    return state.portalStatus;
  },
  getNotificationList(state) {
    return state.notificationList;
  },
  
  getPortalCountryCurrency(state) {
    return state.portalCountryCurrency;
  },
  getPortalCountryCurrencySymbol(state) {
    return state.portalCountryCurrencySymbol;
  },
  getPortalCountryId(state) {
    return state.portalCountryId;
  },
  getRoleUpdate(state) {
    return state.roleUpdated;
  },
  isConnected(state) {
    return state.isConnected;
  },
  getNext(state) {
    return state.routeNext;
  },
  getCountryId(state){
    return state.country;
  }
};

// actions
const actions = {
  socketConnect({ state }, portal) {
    let access_token = getSocketAuthToken(state.platform ? state.platform : portal);
    let payload = { access_token };
    this._vm.$socket.emit("join", payload);
  },

  "vsocket-join-response"({ commit }, data) {
    console.log('connected')
    commit("SET_IS_CONNECTED", data.success);
  },

  vsocketDisconnect({ commit }, flag) {
    commit("SET_IS_CONNECTED", flag);
  },

  "vsocket-role-update"({ commit }) {
    commit("SET_ROLE_UPDATE", true);
  },

  setNoUpdateAvailable({ commit }) {
    commit("SET_ROLE_UPDATE", false);
  },

  setNext({ commit }, nextFunction) {
    commit("SET_NEXT", nextFunction);
  },

  updateLanguage({ commit }, lang) {
    commit("SET_LANGUAGE", lang);
    setItem("language", lang);
  },

  updateCountry({ commit }, country) {
    console.log("SET_COUNTRY", country);
    setItem("filter_country",country);
    commit("SET_COUNTRY", country);
  },

  updateClientSelected({ commit }, clientSelected) {
    console.log("updateClientSelected", clientSelected);
    commit("SET_CLIENT_SELECTED", clientSelected);
  },
  // Emit Get Role Stats Event
  emitTpcCommonNotificationsEvent({ state }, platform) {
    console.log('socket', state, platform)
    let access_token = getSocketAuthToken(platform);
    let portal_id = getPortalID(platform);
    this._vm.$socket.emit("tpc-notification-update", {
      access_token,
      id: portal_id,
      portal: platform
    });
  },
  
    /**
     * Get Role Stats Data From Socket
     * @param commit
     * @param resp
     */
    "vsocket-tpc-notification-update"({ commit }, resp) {
      // console.log("Notifications Received", resp);
      if (resp && resp.data) {
        commit("SET_NOTIFICATION_LIST", resp.data.location);
      } else {
        console.log("Fetching Stats Failed");
      }
    },

  getUser({ state }, type) {
    if (type == "superadmin") {
      return state.userSuperAdmin;
    }
    if (type == "admin") {
      return state.userAdmin;
    }
    if (type == "tpc") {
      return state.userTpc;
    }
  },

  async getUserNotification({ state }, payload) {
    console.log(state, payload);
    const headPayload = {
      headers: { Authorization: getAuthToken(payload) }
    };
    const apiResponse = await axios
      .get(getBaseUrl() + `trips-info/notification`, headPayload)
      .then(response => {
        console.log(response.data.data);
        return response.data.data.data;
        // let responseData = [];
        // if (response.data.data.length > 0) {
        //   response.data.data.forEach(item => {
        //    console.log('ih',item)
        //   });
        // commit("SET_SELECT_STATS", responseData);
        // }
      })
      .catch(error => {
        unauthorizedHandler(error);
        return error;
      });
    return apiResponse;
  },

  async login({ commit }, payload) {
    const postPayload = {
      email: payload.email,
      password: payload.password,
      portal: payload.portal
    };

    const apiResponse = await axios
      .post(getBaseUrl() + "auth/signin", postPayload)
      .then(async response => {
        let result = response.data;
        if (result.statusCode && result.statusCode === 200) {
          console.log(JSON.stringify(result));
          let user = {
            id: result.data.id,
            fullName: result.data.first_name + " " + result.data.last_name,
            email: result.data.email,
            pic: result.data.image,
            portal_id: result.data.portal_id,
            base_user_id: result.data.base_user_id,
            p_first_name: result.data.p_first_name,
            p_last_name: result.data.p_last_name,
            position:
              result.data.position && result.data.position.name ? result.data.position.name : "Dev",
            phone: result.data.phone,
            country: result.data.country
          };

          // core logic later need update in es6
          let localSession = "";
          if (payload.portal == "superadmin") {
            localSession = JSON.parse(getItem("innov-superadmin"));
            localSession.token = result.data.token;
            localSession.userInfo = user;
            localSession.unauthorized = false;
            localSession.theme = "pro-theme";
            setItem("innov-superadmin", JSON.stringify(localSession));
            setItem("portal", result.data.portal);
            setItem("portal-country", "AE");
            commit("SET_PORTAL_COUNTRY", "AE");
            setItem("portal_logo", "");
            setItem("portal_name", "Super Admin");
            setItem("identity", 1);
          } else if (payload.portal == "admin") {
            localSession = JSON.parse(getItem("innov-admin"));
            localSession.token = result.data.token;
            localSession.userInfo = user;
            localSession.unauthorized = false;
            localSession.theme = "light-theme";
            setItem("innov-admin", JSON.stringify(localSession));
            setItem("default-admin", JSON.stringify(localSession));

            // Get Country Info
            let url = `sa-admin/${user.portal_id}`;
            const tpcInfo = await axios.get(getBaseUrl() + url, {
              headers: { Authorization: "Bearer " + result.data.token }
            });
            setItem("portal", result.data.portal);
            setItem("parent_id", tpcInfo.data.data.parent_id);
            if (tpcInfo && tpcInfo.data && tpcInfo.data.data && tpcInfo.data.data.portal_country) {
              // if (tpcInfo && tpcInfo.data && tpcInfo.data.data && tpcInfo.data.data.company_country) {
              setItem("admin_countries", JSON.stringify(tpcInfo.data.data.countries));
              setItem("portal-country", tpcInfo.data.data.portal_country);
              // setItem("portal-country", tpcInfo.data.data.company_country);
              commit("SET_PORTAL_COUNTRY", tpcInfo.data.data.portal_country);
              // commit("SET_PORTAL_COUNTRY", tpcInfo.data.data.company_country);
              setItem("portal_logo", tpcInfo.data.data.company_logo);
              setItem("portal_name", tpcInfo.data.data.company_name);
            } else {
              setItem("portal-country", "AE");
              commit("SET_PORTAL_COUNTRY", "AE");
              setItem("portal_logo", "");
              // setItem("portal_logo", "@/assets/images/company-logo.png");
              setItem("portal_name", "Admin");
            }
            setItem("identity", JSON.stringify(tpcInfo.data.data.identity));
          } else if (payload.portal == "tpc") {
            localSession = JSON.parse(getItem("innov-tpc"));
            localSession.token = result.data.token;
            localSession.unauthorized = false;
            localSession.userInfo = user;
            localSession.theme = "dark-theme";
            setItem("innov-tpc", JSON.stringify(localSession));
            setItem("address",result.data.address)

            // Get Country Info
            let url = `ap-tpc/${user.portal_id}/transport_company`;
            const tpcInfo = await axios.get(getBaseUrl() + url, {
              headers: { Authorization: "Bearer " + result.data.token }
            });
            setItem("portal", result.data.portal);
            setItem("owner", result.data.is_owner);
            setItem("parent_id", tpcInfo.data.data.admin_id);
            console.log(JSON.stringify(tpcInfo));
            if(tpcInfo && tpcInfo.data && tpcInfo.data.data && tpcInfo.data.data.owner_id){
              setItem('owner_id',tpcInfo.data.data.owner_id.id)
            }
            if (tpcInfo && tpcInfo.data && tpcInfo.data.data && tpcInfo.data.data.company_country) {
              // if (tpcInfo && tpcInfo.data && tpcInfo.data.data && tpcInfo.data.data.company_country) {
              setItem("portal-country", tpcInfo.data.data.portal_country);
              // setItem("portal-country", tpcInfo.data.data.company_country);
              commit("SET_PORTAL_COUNTRY", tpcInfo.data.data.portal_country);
              // commit("SET_PORTAL_COUNTRY", tpcInfo.data.data.company_country);
              setItem("portal_logo", tpcInfo.data.data.logo);
              setItem("portal_name", tpcInfo.data.data.company_name);
            } else {
              setItem("portal-country", "AE");
              commit("SET_PORTAL_COUNTRY", "AE");
              // setItem("portal_logo", "@/assets/images/company-logo.png");
              setItem("portal_logo", "");
              setItem("portal_name", "Transport Company");
            }
            setItem("identity", JSON.stringify(tpcInfo.data.data.identity));
          }
          let countryCode = getItem('portal-country');
          // Get Currency Info
          let countryUrl = `country/${countryCode}/getCountryByCode`;
          const countryInfo = await axios.post(
            getBaseUrl() + countryUrl,
            {},
            {
              headers: { Authorization: "Bearer " + result.data.token }
            }
          );
          console.log(countryInfo)
          if (
            countryInfo &&
            countryInfo.data &&
            countryInfo.data.data &&
            countryInfo.data.data.currency
          ) {
            setItem("portal-currency", countryInfo.data.data.currency.toLowerCase());
            commit("SET_PORTAL_COUNTRY_CURRENCY", countryInfo.data.data.currency.toLowerCase());
          } else {
            setItem("portal-currency", "aed");
            commit("SET_PORTAL_COUNTRY_CURRENCY", "aed");
          }
          if (
            countryInfo &&
            countryInfo.data &&
            countryInfo.data.data &&
            countryInfo.data.data.symbol
          ) {
            setItem("portal-currency-symbol", countryInfo.data.data.symbol);
            commit("SET_PORTAL_COUNTRY_CURRENCY_SYMBOL", countryInfo.data.data.symbol);
          } else {
            setItem("portal-currency-symbol", "AED");
            commit("SET_PORTAL_COUNTRY_CURRENCY_SYMBOL", "AED");
          }
          if(countryInfo.data.data.sortname && payload.portal == 'admin'){
            setItem("portal-country", countryInfo.data.data.sortname);
            // setItem("portal-country", tpcInfo.data.data.company_country);
            commit("SET_PORTAL_COUNTRY", countryInfo.data.data.sortname);
          }
          if (
            countryInfo &&
            countryInfo.data &&
            countryInfo.data.data &&
            countryInfo.data.data.id
          ) {
            setItem("portal-country-id", countryInfo.data.data.id)
            commit("SET_PORTAL_COUNTRY_ID", countryInfo.data.data.id);
          }
          //  else {
            // setItem("portal-country-id", "usd");
            // commit("SET_PORTAL_COUNTRY_ID", "usd");
          // }

          let url = `roles-staff/${result.data.id}/getUserAccess`;
          const userAccessData = await axios.get(getBaseUrl() + url);
          const userAccess = JSON.stringify(userAccessData.data.data);

          console.log("userAccess ", JSON.stringify(userAccess));

          setItem("user-access", userAccess);
          commit("SET_USER_ACCESS", userAccess);

          setItem("is-first-time-login", true);
          setItem("portal-status", result.data.portalStatus);
          commit("SET_PORTAL_STATUS", result.data.portalStatus);

          // Commit the state
          commit("SET_AUTH", { type: payload.portal, data: localSession });
        } else {
          console.log("error handling");
        }
        // console.log(apiResponse);
        // console.log("result", result);
        return result;
      })
      .catch(error => {
        console.log(error);
        unauthorizedHandler(error.response);
        return error.response;
      });
    return apiResponse;
  },

  async virtualLoginOTPOnly({ state }, payload) {
    console.log(state.platform, payload);
    const headPayload = {
      headers: { Authorization: getAuthToken(payload.platform) }
    };
    const apiResponse = await axios
      .post(getBaseUrl() + "auth/generateSuperadminVirtualToken", payload.data, headPayload)
      .then(async response => {
        let result = response.data;
        if (result.statusCode && result.statusCode === 200) {
          console.log(result);
        } else {
          console.log("error handling");
        }
        return result;
      })
      .catch(({ response }) => {
        unauthorizedHandler(response);
        return response;
      });
    return apiResponse;
  },

  async virtualLoginOTP({ state }, payload) {
    console.log(state.platform);
    const headPayload = {
      headers: { Authorization: getAuthToken(payload.platform) }
    };
    const apiResponse = await axios
      .post(getBaseUrl() + "auth/generateSuperadminVirtualToken", payload.data, headPayload)
      .then(async response => {
        let result = response.data;
        if (result.statusCode && result.statusCode === 200) {
          console.log(result);
          let userBackup = "";
          let defaultAdminBackup = "";
          if (payload.data.portal == "admin" && payload.platform == "superadmin") {
            userBackup = JSON.stringify(JSON.parse(localStorage.getItem("innov-superadmin")));
            localStorage.setItem("virtual-superadmin-login-info", userBackup);
          } else if (payload.data.portal == "tpc" && payload.platform == "admin") {
            userBackup = JSON.stringify(JSON.parse(localStorage.getItem("innov-admin")));
            defaultAdminBackup = JSON.stringify(JSON.parse(localStorage.getItem("default-admin")));
            localStorage.setItem("virtual-admin-login-info", defaultAdminBackup);
          } else {
            userBackup = JSON.stringify(JSON.parse(localStorage.getItem("innov-admin")));
            defaultAdminBackup = JSON.stringify(JSON.parse(localStorage.getItem("default-admin")));
            localStorage.setItem("virtual-admin-login-info", defaultAdminBackup);
          }
          console.log(userBackup);
        } else {
          console.log("error handling");
        }
        return result;
      })
      .catch(({ response }) => {
        unauthorizedHandler(response);
        return response;
      });
    return apiResponse;
  },

  async virtualLogin({ commit }, payload) {
    console.log(payload)
    const headPayload = {
      headers: { Authorization: getAuthToken(payload.platform) }
    };
    const apiResponse = await axios
      .post(getBaseUrl() + "auth/verifyOTPSuperadminVirtualToken", payload.data, headPayload)
      .then(async response => {
        console.log(response)
        let result = response.data;
        console.log(response)
        if (result.statusCode && result.statusCode === 200 && result.data != null) {
          console.log(JSON.stringify(result));

          let resetSession = {
            theme: "",
            userInfo: "",
            token: ""
          };
          let allPortals = {
            superAdminPortal: "innov-superadmin",
            adminPortal: "innov-admin",
            tpcPortal: "innov-tpc"
          };
          let userBackup = "";
          if (payload.data.portal == "superadmin") {
            localStorage.setItem("innov-superadmin", JSON.stringify(resetSession));
            let portals = [allPortals.adminPortal, allPortals.tpcPortal];
            for (let portal of portals) {
              if (localStorage.getItem(portal)) localStorage.removeItem(portal);
            }
          } else if (payload.data.portal == "admin") {
            localStorage.setItem("innov-admin", JSON.stringify(resetSession));
            userBackup = localStorage.getItem("innov-superadmin");
            console.log("userBackup ", userBackup);
            let portals = [allPortals.superAdminPortal, allPortals.tpcPortal];
            for (let portal of portals) {
              if (localStorage.getItem(portal)) localStorage.removeItem(portal);
            }
          } else if (payload.data.portal == "tpc") {
            localStorage.setItem("innov-tpc", JSON.stringify(resetSession));
            let portals = [allPortals.superAdminPortal, allPortals.adminPortal];
            for (let portal of portals) {
              if (localStorage.getItem(portal)) localStorage.removeItem(portal);
            }
            userBackup = localStorage.getItem("innov-admin");
            setItem("innov-admin-backup", userBackup);
          }
          console.log(result)
          let user = {
            id: result.data.id,
            fullName: result.data.first_name + " " + result.data.last_name,
            email: result.data.email,
            pic: result.data.image,
            portal_id: result.data.portal_id,
            base_user_id: result.data.base_user_id,
            position:
              result.data.position && result.data.position.name ? result.data.position.name : "Dev",
            phone: result.data.phone,
            country: result.data.country
          };

          // core logic later need update in es6
          let localSession = "";
          if (payload.data.portal == "superadmin") {
            localSession = JSON.parse(getItem("innov-superadmin"));
            localSession.token = result.data.token;
            localSession.userInfo = user;
            localSession.unauthorized = false;
            localSession.theme = "pro-theme";
            setItem("innov-superadmin", JSON.stringify(localSession));
            setItem("portal", result.data.portal);
            setItem("portal-country", "AE");
            commit("SET_PORTAL_COUNTRY", "AE");
            setItem("portal_logo", "");
            setItem("portal_name", "Super Admin");
            setItem("identity", 1);
            // setItem("identity", JSON.stringify(tpcInfo.data.data.identity));
          } else if (payload.data.portal == "admin") {
            localSession = JSON.parse(getItem("innov-admin"));
            localSession.token = result.data.token;
            localSession.userInfo = user;
            localSession.unauthorized = false;
            localSession.theme = "light-theme";
            setItem("innov-admin", JSON.stringify(localSession));

            // Get Country Info
            let url = `sa-admin/${user.portal_id}`;
            const tpcInfo = await axios.get(getBaseUrl() + url, {
              headers: { Authorization: "Bearer " + result.data.token }
            });
            setItem("portal", "admin");
            setItem("isAdminVirtualLogin", "true");
            setItem("parent_id", tpcInfo.data.data.parent_id);
            if(tpcInfo && tpcInfo.data && tpcInfo.data.data && tpcInfo.data.data.owner_id){
              setItem('owner_id',tpcInfo.data.data.owner_id.id)
            }
            if (tpcInfo && tpcInfo.data && tpcInfo.data.data && tpcInfo.data.data.portal_country) {
              setItem("admin_countries", JSON.stringify(tpcInfo.data.data.countries));
              setItem("portal-country", tpcInfo.data.data.portal_country);
              // setItem("portal-country", tpcInfo.data.data.company_country);
              commit("SET_PORTAL_COUNTRY", tpcInfo.data.data.portal_country);
              // commit("SET_PORTAL_COUNTRY", tpcInfo.data.data.company_country);
              setItem("portal_logo", tpcInfo.data.data.company_logo);
              setItem("portal_name", tpcInfo.data.data.company_name);
            } else {
              setItem("portal-country", "AE");
              commit("SET_PORTAL_COUNTRY", "AE");
              setItem("portal_logo", "");
              // setItem("portal_logo", "@/assets/images/company-logo.png");
              setItem("portal_name", "Admin");
            }
            setItem("identity", JSON.stringify(tpcInfo.data.data.identity));
          } else if (payload.data.portal == "tpc") {
            localSession = JSON.parse(getItem("innov-tpc"));
            localSession.token = result.data.token;
            localSession.unauthorized = false;
            localSession.userInfo = user;
            localSession.theme = "dark-theme";
            setItem("innov-tpc", JSON.stringify(localSession));

            // Get Country Info
            console.log(user)
            let url = `ap-tpc/${user.portal_id}/transport_company`;
            const tpcInfo = await axios.get(getBaseUrl() + url, {
              headers: { Authorization: "Bearer " + result.data.token }
            });
            setItem("isVirtualLogin", "true");
            setItem("portal", "tpc");
            setItem("parent_id", tpcInfo.data.data.admin_id);
            console.log(JSON.stringify(tpcInfo));
            if (tpcInfo && tpcInfo.data && tpcInfo.data.data && tpcInfo.data.data.portal_country) {
              setItem("portal-country", tpcInfo.data.data.portal_country);
              // setItem("portal-country", tpcInfo.data.data.company_country);
              commit("SET_PORTAL_COUNTRY", tpcInfo.data.data.portal_country);
              // commit("SET_PORTAL_COUNTRY", tpcInfo.data.data.company_country);
              setItem("portal_logo", tpcInfo.data.data.logo);
              setItem("portal_name", tpcInfo.data.data.company_name);
            } else {
              setItem("portal-country", "AE");
              commit("SET_PORTAL_COUNTRY", "AE");
              setItem("portal_logo", "");
              // setItem("portal_logo", "@/assets/images/company-logo.png");
              setItem("portal_name", "Transport Company");
            }
            setItem("identity", JSON.stringify(tpcInfo.data.data.identity));
          }
          let countryCode = getItem('portal-country');
          // Get Currency Info
          let countryUrl = `country/${countryCode}/getCountryByCode`;
          const countryInfo = await axios.post(
            getBaseUrl() + countryUrl,
            {},
            {
              headers: { Authorization: "Bearer " + result.data.token }
            }
          );
          if (
            countryInfo &&
            countryInfo.data &&
            countryInfo.data.data &&
            countryInfo.data.data.currency
          ) {
            setItem("portal-currency", countryInfo.data.data.currency.toLowerCase());
            commit("SET_PORTAL_COUNTRY_CURRENCY", countryInfo.data.data.currency.toLowerCase());
          } else {
            setItem("portal-currency", "aed");
            commit("SET_PORTAL_COUNTRY_CURRENCY", "aed");
          }
          if (
            countryInfo &&
            countryInfo.data &&
            countryInfo.data.data &&
            countryInfo.data.data.symbol
          ) {
            setItem("portal-currency-symbol", countryInfo.data.data.symbol);
            commit("SET_PORTAL_COUNTRY_CURRENCY_SYMBOL", countryInfo.data.data.symbol);
          } else {
            setItem("portal-currency-symbol", "AED");
            commit("SET_PORTAL_COUNTRY_CURRENCY_SYMBOL", "AED");
          }
          if(countryInfo.data.data.sortname && payload.data.portal == 'admin'){
            setItem("portal-country", countryInfo.data.data.sortname);
            // setItem("portal-country", tpcInfo.data.data.company_country);
            commit("SET_PORTAL_COUNTRY", countryInfo.data.data.sortname);
          }
          if (
            countryInfo &&
            countryInfo.data &&
            countryInfo.data.data &&
            countryInfo.data.data.id
          ) {
            setItem("portal-country-id", countryInfo.data.data.id);
            commit("SET_PORTAL_COUNTRY_ID", countryInfo.data.data.id);
          } 
          // else {
            // setItem("portal-country-id", "usd");
            // commit("SET_PORTAL_COUNTRY_ID", "usd");
          // }

          let url = `roles-staff/${result.data.id}/getUserAccess`;
          const userAccessData = await axios.get(getBaseUrl() + url);
          const userAccess = JSON.stringify(userAccessData.data.data);

          console.log("userAccess ", JSON.stringify(userAccess));

          setItem("user-access", userAccess);
          commit("SET_USER_ACCESS", userAccess);

          setItem("is-first-time-login", true);

          // Commit the state
          commit("SET_AUTH", { type: payload.data.portal, data: localSession });
        } else {
          console.log("error handling");
        }
        // console.log(apiResponse)
        return result;
      })
      .catch(({ response }) => {
        // Set Backup Again
        setItem("innov-superadmin", localStorage.getItem("innov-superadmin-backup"));
        unauthorizedHandler(response);
        return response;
      });
    return apiResponse;
  },

  async uploadImage({ state }, data) {
    console.log(state.platform);
    console.log(data);
    let url = getBaseUrl() + `/documents/commonUploadImage`;
    let resp = await axios.post(url, JSON.stringify({ file: data.file }), {
      headers: {
        Authorization: getAuthToken(data.platform),
        "Content-Type": "application/json"
      }
    });
    return resp;
  },

  /**
   * Forgot Password
   * @param commit
   * @param payload
   * @returns {Promise<any>}
   */
  async forgotPassword({ commit }, payload) {
    console.log(commit);
    const apiResponse = await axios
      .post(getBaseUrl() + "auth/forgotPassword", payload)
      .then(response => {
        const result = response.data;
        return result;
      })
      .catch(({ response }) => {
        unauthorizedHandler(response);
        return response;
      });
    return apiResponse;
  },

  /**
   * Reset Password
   * @param commit
   * @param payload
   * @returns {Promise<any>}
   */
  async resetPassword({ commit }, payload) {
    console.log(commit);
    const apiResponse = await axios
      .post(getBaseUrl() + `roles-staff/${payload.token}/changePassword`, payload)
      .then(response => {
        const result = response.data;
        console.log(result)
        return result;
      })
      .catch(({ response }) => {
        unauthorizedHandler(response);
        return response;
      });
      console.log(apiResponse)
    return apiResponse;
  },

  async logout(_, reqPayload) {
    const headPayload = {
      headers: { Authorization: getAuthToken(reqPayload.platform) }
    };
    // clear all sessions first
    const lang = localStorage.getItem('language')
    localStorage.clear() // clear all things in local storage
    if (lang && lang !== 'en') localStorage.setItem('language', lang) // add language back
    const payload = {};
    const apiResponse = await axios
      .post(getBaseUrl() + "auth/signout", payload, headPayload)
      .then(response => {
        const result = response.data;
        return result;
      })
      .catch(({ response }) => {
        unauthorizedHandler(response.data);
        return response.data;
      })
    return apiResponse;
  },

  async getUserAccess({ commit }, portal) {
    let id = getLoggedInUserID(portal);
    let url = `roles-staff/${id}/getUserAccess`;
    const userAccessData = await axios.get(getBaseUrl() + url);
    const userAccess = JSON.stringify(userAccessData.data.data);
    setItem("user-access", userAccess);
    commit("SET_USER_ACCESS", userAccess);
  },

  async getCountryListFromAPI({ commit }) {
    const apiResponse = await axios
      .get(getBaseUrl() + "sa-admin/1/getActiveCountry")
      .then(response => {
        const result = response.data;
        if (result.statusCode == 200) {
          // Commit the state
          commit("SET_COUNTRY_LIST_NAV", result.data);
        } else {
          console.log("error handling");
        }
        return result.data;
      })
      .catch(({ response }) => {
        unauthorizedHandler(response);
        return response;
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

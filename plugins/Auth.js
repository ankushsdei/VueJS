/**
 * @uses: Auth module API's Request mapping
 *
 */

// Todo: revise as per needed
import config from '../../config/config';
const environment = process.env.NODE_ENV || "development";
const environmentConfig = config[environment];

// Get the Auth Token
export const getAuthToken = platform => {
  const sessionData = JSON.parse(localStorage.getItem("innov-" + platform));
  if (sessionData) {
    const userToken = sessionData.token ? sessionData.token : "";
    return "Bearer ".concat(userToken);
  }
};

export const isAuthorized = platform => {
  try {
    const item = JSON.parse(localStorage.getItem(`innov-${platform}`))
    return !!(item && !item.unauthorized && item.token)
  } catch { return false }
}

export const getAddress = () => {
  const item = localStorage.getItem("address");
  return item ? item : null;
};

// Get the Auth Token
export const getLoggedInUserID = platform => {
  const sessionData = JSON.parse(localStorage.getItem("innov-" + platform));
  const id = sessionData && sessionData.userInfo && sessionData.userInfo.id ? sessionData.userInfo.id : "";
  return id;
};

// Get the Auth Token
export const getLoggedInUserInfo = platform => {
  const sessionData = JSON.parse(localStorage.getItem("innov-" + platform));
  return sessionData.userInfo;
};

export const getBaseUserID = platform => {
  const sessionData = JSON.parse(localStorage.getItem("innov-" + platform));
  const base_user_id = sessionData && sessionData.userInfo && sessionData.userInfo.base_user_id ? sessionData.userInfo.base_user_id : "";
  return base_user_id;
};

// Get Portal Id
export const getPortalID = platform => {
  const sessionData = JSON.parse(localStorage.getItem("innov-" + platform));
  const portal_id = sessionData && sessionData.userInfo && sessionData.userInfo.portal_id ? sessionData.userInfo.portal_id : "";
  return portal_id;
};

// Get Portal Id
export const getPortalParentID = () => {
  const parentID = JSON.parse(localStorage.getItem("parent_id"));
  return parentID;
};

// Get Portal Country
export const getPortalCountry = () => {
  const countryCode = localStorage.getItem("portal-country");
  return countryCode ? countryCode : "USD";
};
export const getOwner = () => {
  const owner = localStorage.getItem("owner");
  return owner;
};

export const getIdentity = () => {
  const countryCode = localStorage.getItem("identity");
  return countryCode;
};
//Get Portal Countries
export const getPortalCountries = () => {
  const countries = JSON.parse(localStorage.getItem("admin_countries"));
  return countries;
};
export const getPortalStatus = () => {
  const portalStatus = JSON.parse(localStorage.getItem("portal-status"));
  return portalStatus;
};

export const getPortalCountryCurrency = () => {
  const countryCurrency = localStorage.getItem("portal-currency");
  return countryCurrency ? countryCurrency : "USD";
};

export const getPortalCountryCurrencySymbol = () => {
  const countryCurrencySymbol = localStorage.getItem("portal-currency-symbol");
  return countryCurrencySymbol ? countryCurrencySymbol : "$";
};

// Get Country Id
export const getCountryID = platform => {
  const sessionData = JSON.parse(localStorage.getItem("innov-" + platform));
  const country = sessionData && sessionData.userInfo && sessionData.userInfo.country ? sessionData.userInfo.country : "";
  return country;
};

// Get the Auth Token
export const getSocketAuthToken = platform => {
  let token = "";
  const sessionData = JSON.parse(localStorage.getItem("innov-" + platform));
  if (sessionData && sessionData.token) {
    token = sessionData.token ? sessionData.token : "";
  }
  return token;
};

// unauthorized Request Handler
export const unauthorizedHandler = error => {
  console.log("unauthorizedHandler");
  console.log(error);
  if (error && error.message === "Network Error") {
    // window.alertify('error', 'Server is down for maintenance!');
  }
  if (error && error.statusCode === 500) {
    setTimeout(() => {
      alert(error.data.message);
    });
  }
  if (error && error.statusCode === 400) {
    setTimeout(() => {
      alert(error.message);
    });
  }
  if (error && error.data && error.statusCode === 404) {
    setTimeout(() => {
      alert("Platform APIs " + error.statusText);
    });
  }
  if (error && error.statusCode === 403) {
    const lang = localStorage.getItem('language')
    localStorage.clear() // clear all things in local storage
    if (lang && lang !== 'en') localStorage.setItem('language', lang) // add language back
    window.location = "/";
    // console.log(new Error().stack)
    // alert(error.message);
    // localStorage.setItem("unauthorized", true);
  }
};

// Local Storage functions
export const getItem = key => localStorage.getItem(key);

export const setItem = (key, object) => {
  localStorage.setItem(key, object);
};

export const removeItem = key => localStorage.removeItem(key);

// 21-04-2020, new flow - tested - other revision - DONE
export const getBaseUrl = () => {
  const baseURL = environmentConfig.api_url;
  const port = environmentConfig.api_port;

  // Todo: update :
  // 20-04-2020, new flow - issue come backend need fix
  // 21-04-2020, new flow - tested
  //  Base URL platorm-{{module}}

  // if (platform === "super_admin") {
  //   port = 3000;
  // } else if (platform === "admin") {
  //   port = 3001;
  // } else {
  //   port = 3002;
  // }
  return [
    baseURL,
    port || null
  ].filter(f=>f).join(':') + '/'
};

export const getSocketUrl = () => {
  const baseURL = environmentConfig.socket_url;
  const port = environmentConfig.socket_port;
  return [
    baseURL,
    port || null
  ].filter(f=>f).join(':')+'/';
};

export const clear = () => localStorage.clear();

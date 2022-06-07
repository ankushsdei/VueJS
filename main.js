import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./directives/invalid-chars";
import "./directives/invalid-characters";
import "./validators/expiry-year";
import { ioConnection } from "./intercepted-io";

import vuetify from "@/plugins/vuetify";

import axios from "axios"; //Todo: No need remove later

// load the global components
import './layouts/index';
import "./components/elements/index";
import './components/skeleton/index';

// Plugins injector
import BootstrapVue from "bootstrap-vue/dist/bootstrap-vue.esm";
import VuePhoneNumberInput from "vue-phone-number-input";

// Import the styles directly. (Or you could add them via script tags.)
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
// import 'vue2-timepicker/dist/VueTimepicker.css'
import "vue-phone-number-input/dist/vue-phone-number-input.css";

// i18n
import i18next from "i18next";
import VueI18Next from "@panter/vue-i18next";

import VueSocketIO from "vue-socket.io";

import DateRangePicker from "@gravitano/vue-date-range-picker";
// import Datepicker from 'vuejs-datepicker';

import VeeValidate from "vee-validate";
// import lodash from "lodash";
// import VueLodash from "vue-lodash";
import NProgress from "vue-nprogress";
import Notifications from "vue-notification";
import VTooltip from "v-tooltip";
import Multiselect from "vue-multiselect";

import fullCalendar from "vue-fullcalendar";

import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import VueApexCharts from 'vue-apexcharts'
// register components and modules globally
Vue.use(NProgress);

Vue.use(require("vue-moment"));

const optionsFlash = {
  latencyThreshold: 200,
  router: true,
  http: false,
  parent: ".nprogress-container"
};

const nprogress = new NProgress(optionsFlash);

// const options = { name: "lodash", lodash: lodash }; // customize the way you want to call it

// Vue.use(VueLodash, options); // options is optional

Vue.use(VeeValidate, {
  inject: true,
  fieldsBagName: "veeFields"
});
import Vuelidate from "vuelidate";
Vue.use(Vuelidate);
// CKEditor
import CKEditor from "ckeditor4-vue";
Vue.use(CKEditor);

Vue.use(Notifications);

Vue.use(VTooltip);

Vue.use(BootstrapVue);

// Vue.use(VueParams);
Vue.use(VueI18Next);
// Vue.params.i18nextLanguage = "en";

Vue.use(DateRangePicker);

Vue.use(require("vue-shortkey"));
Vue.use(VueApexCharts)

// Vue.use(Datepicker);

Vue.component("multiselect", Multiselect);
Vue.component("vue-phone-number-input", VuePhoneNumberInput);

Vue.component("full-calendar", fullCalendar);
Vue.component('apexchart', VueApexCharts)

import translations from '@/translations'

import { loadAnimation } from 'lottie-web'
import { defineLordIconElement } from 'lord-icon-element'
// register lottie and define custom element
defineLordIconElement(loadAnimation)

const resources = {}
for (const transl in translations) resources[transl] = { translation: translations[transl] }
i18next.init({
  lng: "en",
  resources
});
const i18n = new VueI18Next(i18next);

// Core Setup
Vue.config.productionTip = false;

axios.defaults.baseURL = [
  process.env.VUE_APP_API_URL,
  process.env.VUE_APP_API_PORT || null
].filter(f=>f).join(':')+'/'

 //Todo: No need remove later

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: ioConnection,
    vuex: {
      store,
      actionPrefix: "vsocket-"
    }
  })
);

// Inject global components
import Breadcrumb from "./components/Breadcrumb";
import ActionCard from "./components/ActionCard";
import CollapseCard from "./components/CollapseCard";
import ActionModal from "./components/ActionModal";
import ActionModalNew from "./components/ActionModalNew";
import TableContainer from "./components/TableContainer";


Vue.component("breadcrumb", Breadcrumb);
Vue.component("action-card", ActionCard);
Vue.component("collapse-card", CollapseCard);
Vue.component("action-modal", ActionModal);
Vue.component("action-modal-new", ActionModalNew);
Vue.component("table-container", TableContainer);


Vue.filter("capitalize", function(value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter("t", value => {
  if (!value) return "";
  return i18n.t(value);
});

Vue.component(VueCropper);

// Maps
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";

// The following is the official VueLeaflet fix
// to solve issue with default marker icon missing (webpack messing around)
// https://vue2-leaflet.netlify.app/quickstart/#marker-icons-are-missing

Vue.use(turf);

import { Icon } from "leaflet";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});
// End of fix


import VueGeolocation from "vue-browser-geolocation";
Vue.use(VueGeolocation);

import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "",
    libraries: ["places,drawing,visualization,geometry"]
  }
  // autobindAllEvents: true,
  // installComponents: false
});
import VuePlaceAutocomplete from "vue-place-autocomplete";


Vue.use(VuePlaceAutocomplete);
window.Bus = new Vue();

new Vue({
  vuetify,
  nprogress,
  router: router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");

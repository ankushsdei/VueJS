<template>
  <header class="nav site-nav">
    <div class="d-flex w-100 p-3 align-items-center responsive-flex">
      <div class="col-sm-4 p-0 responsive-left-header">
        <div class="toggle-menu">
          <button @click="menuToggle()" class="transp-btn">
            <i class="innov-icon icon-nav-menu" />
            <!-- <i v-if="menuSlide" class="innov-icon icon-cancel" /> -->
            <!-- <i v-else class="innov-icon icon-nav-menu" /> -->
          </button>
        </div>
        <div class="platform-name row m-1" @click="navToHome()" style="cursor: pointer">
            <span>
            <img :src="portalLogo" alt style="width: 100px" />
            </span>
             <div class="col-6">
              <span>{{ portalName }}</span>
            </div>
          <!-- <span> -->
            <!-- VIjay This is the icon -->
            <!-- <span style="padding-left: 10px">{{ portalName }}</span> -->
            <!-- <span style="padding-left: 10px">R&P TRANSPORT COMPANY</span> -->
          <!-- </span> -->
        
        </div>
      </div>
      <div class="col-sm-8 p-0 responsive-right-header">
        <div class="site-menus responsive-site-menus">
          <div class="row justify-content-end align-items-center">
            <div
              class="bar-left resposive-bar-left position-relative"
              v-if="this.$route.name == 'trips-dispatch'"
            >
              <span class="header-search-icon"
                ><i class="fa fa-search"></i
              ></span>
              <input
                type="text"
                class="form-control padding-left-30"
                autocomplete="off"
                :placeholder="$t('type_to_search')"
                @keyup.enter="initList"
                v-model="tripSearch"
              />
            </div>
            <div :class="[portalName  == 'super_admin'? 'bar-left':'bar-left-none' ]" class="resposive-bar-left bothdropdowns-innav">
              <div class="d-flex dropdown-menu-outer">
                <div
                  class="d-flex align-items-center"
                  v-if="checkVirtualLogin()"
                  style="padding-right: 20px"
                >
                  <div class="site-primary-btn mt-0">
                    <button
                      type="submit"
                      class="btn mw-none"
                      @click="exitVirtualLogin"
                    >
                      Exit from Virtual Login
                    </button>
                  </div>
                </div>
                <div
                  class="d-flex align-items-center"
                  v-if="checkClientSelected()"
                  style="padding-right: 20px"
                >
                  <div class="site-primary-btn mt-0">
                    <button
                      type="submit"
                      class="btn mw-none"
                      @click="redirectToTPC"
                    >
                      Back to Manage Clients
                    </button>
                  </div>
                </div>
                <div
                  class="d-flex align-items-center country-dropitem"
                  v-if="platform_name == `super_admin`"
                >
                  <span>
                    <img src="@/assets/images/add-plus.svg" alt="add-icon" />
                  </span>
                  <div class="dropdown" v-if="countries.length > 0">
                    <multiselect
                      v-model="country"
                      class="country-multiselect"
                      placeholder="Choose country"
                      label="title"
                      track-by="sortname"
                      :options="countries"
                      :show-labels="false"
                      :searchable="false"
                      :hideSelected="true"
                      @select="changeCountry"
                    >
                      <template slot="singleLabel" slot-scope="props">
                        <i
                          v-if="props.option.name == 'All'"
                          class="innov-icon icon-globe ft-15 pr-1"
                        />
                        <i
                          v-else
                          :class="
                            'flag-icon flag-icon-' +
                            props.option.sortname.toLowerCase()
                          "
                        />
                        <span class="option__desc">
                          <span class="option__title">{{
                            props.option.name
                          }}</span>
                        </span>
                      </template>
                      <template slot="option" slot-scope="props">
                        <div class="option-wrapper">
                          <i
                            v-if="props.option.name == 'All'"
                            class="innov-icon icon-globe ft-15 pr-1"
                          />
                          <i
                            v-else
                            :class="
                              'flag-icon flag-icon-' +
                              props.option.sortname.toLowerCase()
                            "
                          />
                          <span class="option__title">{{
                            props.option.name
                          }}</span>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                </div>
                <div v-if="platform_name == 'transport_company'" class="dropdown d-flex align-items-center language-dropitem">
                  <span @click="getNotifications()" data-toggle="dropdown" id="notificationDropBox" class="header-notification">
                    <img src="@/assets/images/bell.svg" alt="bell-icon" />
                    <i v-if="showNotifyIcon" class="fa fa-circle" aria-hidden="true"></i>
                  </span>
                  <ul style="left:-187px !important; width:400px !important;transform: translate3d(-383px, 19px, 0px);
                      box-shadow: rgb(51 51 51 / 27%) -1.095px 6.914px 12.96px 3.04px;
                      max-height: 450px;
                      overflow-x: hidden;
                  " aria-labelledby="notificationDropBox" class="dropdown-menu drops dropdown-menu-media dropdown-menu-right">
                  <li class="dropdown-menu-header">
                    <h6 class="dropdown-header m-0 text-center"><span class="grey darken-2">NOTIFICATIONS</span></h6>
                  </li>
                  <li style="border-bottom: 1px solid #eee;" v-for="(noty,index) in notificationData" :key="index" class="scrollable-container media-list w-100 ps ps--active-y">
                    <a @click="redirectRoute(noty)" href="javascript:void(0)">
                          <div class="icon-notify bg-light-green">
                             <i v-if="noty.notif_type == 'alert'" class="innov-icon icon-alert"></i>
                             <i v-else-if="noty.notif_type == 'chat'" class="innov-icon icon-documents"></i>
                             <i v-else class="innov-icon icon-expenses"></i>
                          </div>
                          <div class="menu-info">
                              <h4>{{noty.message}}</h4>
                              <p v-if="noty.notif_type == 'chat'" class="message">
                                  {{noty.data.message.length > 50 ? `${noty.data.message.substring(0, 50)}...` : noty.data.message}}
                              </p>
                              <p v-else-if="noty.notif_type == 'expense'" class="message">
                                  {{currency}} {{noty.data.metadata.total}}
                              </p>
                              <p v-else-if="noty.notif_type == 'alert'" class="message">
                                  {{noty.data.metadata.label && noty.data.metadata.label.length > 50  ? `${noty.data.metadata.label.substring(0, 50)}...` : noty.data.metadata.location.label && noty.data.metadata.location.label.length > 50 ? `${noty.data.metadata.location.label.substring(0, 50)}...` : noty.data.metadata.label
                                  }}
                              </p>
                              <p v-else-if="noty.notif_type == 'violation'" class="message">
                                  {{noty.data? noty.data.location[0].coords.speed : ''
                                  }}
                              </p>
                              <p v-else-if="noty.notif_type == 'accident' || noty.notif_type == 'inspection'" class="message">
                                {{noty.data.location.address.length > 50 ? `${noty.data.location.address.substring(0, 50)}...` : noty.data.location.address
                                }}
                              </p>
                               <p v-else-if="noty.notif_type == 'wrong_pick_up'">
                                {{noty.data.trip_event_details ? noty.data.trip_event_details.location.address.length > 50 ? `${noty.data.trip_event_details.location.address.substring(0, 50)}...` : noty.data.trip_event_details.location.address: noty.data.location.address.length > 50 ? `${noty.data.location.address.substring(0, 50)}...` : noty.data.location.address
                                }}
                              </p>
                              <!-- <p v-else-if="noty.notif_type == 'wrong_pick_up'">
                                {{noty.data.trip_event_details.location.address.length > 50 ? `${noty.data.trip_event_details.location.address.substring(0, 50)}...` : noty.data.trip_event_details.location.address
                                }}
                              </p> -->
                          </div>
 
                      </a>
                      <div class="ps__rail-x" style="left: 0px; bottom: 0px;"><div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div></div><div class="ps__rail-y" style="top: 0px; right: 0px;"><div class="ps__thumb-y" tabindex="0" style="top: 0px;"></div></div></li>
                  <li class="dropdown-menu-footer"><a class="dropdown-item text-muted text-center" href="javascript:void(0)">Read all notifications</a></li>
                </ul>
                </div>
              </div>
            </div>
            <div class="bar-right">
              <div class="user-detail">
                <div class="d-flex justify-content-end">
                  <div class="name">
                    <span>{{ userData.userInfo.fullName }}</span>
                    <span>{{ userData.userInfo.position }}</span>
                  </div>
                  <div class="dropdown">
                    <a
                      :class="[ 'dropdown-toggle', $vuetify.rtl ? 'ml-3' : '' ]"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                    >
                      <span>
                        <img
                          v-if="userData.userInfo.pic"
                          :src="userData.userInfo.pic"
                          class="auth-img nav-img"
                          alt="profile"
                        />
                        <span v-else class="initialletter1">{{getNameIntials(userData.userInfo.fullName)}}</span>
                      </span>
                    </a>
                    <div
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <router-link
                        v-if="platform_name == `transport_company`"
                        to="/tpc-portal/transport-companies/Edit"
                        class="dropdown-item"
                      >
                        <!-- <i :class="'innov-icon icon-nav-logout'"></i> -->
                        Company Profile
                      </router-link>
                      <span class="language-a">
                        <a href="#"
                          ><i :class="'innov-icon icon-nav-languages'"></i>
                          Language</a
                        >
                        <ul class="languagerselector">
                          <li @click="changeLanguage(lang)" :key="ind" :value="lang.code" v-for="(lang,ind) in languages"><a href="#"> <img :src="require(`../../assets/images/${lang.flag}-flag.png`)"  alt="lang-img" /> {{lang.name}}</a></li>
                        </ul>
                      </span>
                      <router-link to="/logout" class="dropdown-item">
                        <i :class="'innov-icon icon-nav-logout'"></i>
                        {{ $t("log_out") }}
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import i18next from "i18next";
import { getItem,setItem } from "@/plugins/Auth";
import { EventBus } from "../../event-bus.js";
import moment from "moment";
export default {
  name: "Navigation",
  props: {},
  components: {},
  data() {
    return {
      menuSlide: false,
      showNotifyIcon: false,
      userData: {
        userInfo: {
          fullName: "",
          email: "",
          position: "",
          pic: "",
        },
      },
      notificationData : [],
      platform_name: "INNOVENT",
      country: {
        id: 101,
        sortname: "IN",
        name: "India",
        phonecode: 91,
      },
      language: {
        name: "English",
        code: "en",
        icon: "gb",
      },
      languages: [
        {
          name: "English",
          flag: 'english',
          code: "en",
          icon: "gb",
        },
        {
          name: "Arabic",
          flag: 'arabic',
          code: "ar",
          icon: "ar",
        },
      ],
      tripSearch: "",
      portalLogo: "",
      portalName: "",
    };
  },
  sockets: {
    // Disconnecting current socket
    disconnect() {
      console.log("Disconnect the real time socket in future!");
    }
  },
  watch: {
    countries: {
      deep: true,
      handler() {
        // Set Country Of Portal
        let countryCode = this.portalCountry;
        this.country = this.countries.filter(
          (s) => s.sortname === countryCode
        )[0];
      },
    },
    notificationList: {
      deep: true,
      handler() {
        this.showNotifyIcon = true;
      },
    },
  },
  beforeMount() {
    let tempLang = getItem("language") ? getItem("language") : "en";
    if (tempLang != "en") {
      this.language = this.languages.filter((s) => s.code === tempLang);
    }
  },
  mounted() {
    this.getCountryListFromAPI();
    let routerBasePlatform = this.$route.fullPath.split("/")[1];
    let userFor = routerBasePlatform.replace("-portal", "").replace("-", "");
    if (routerBasePlatform === "super-admin-portal") {
      this.platform_name = "super_admin";
    }
    if (routerBasePlatform === "admin-portal") {
      this.platform_name = "admin";
    }
    if (routerBasePlatform === "tpc-portal") {
      this.platform_name = "transport_company";
    }
    this.getUser(userFor).then((data) => {
      this.userData = data;
    });
    let platform = this.platform_name == 'admin'? 'admin' : this.platform_name == 'superadmin' ? 'superadmin': 'tpc' ;
    this.connect();
    this.emitTpcCommonNotificationsEvent(platform);
    this.$root.navToggle = () => {
      this.menuToggle();
    };
    this.portalLogo = getItem("portal_logo")
      ? getItem("portal_logo")
      : "";
      // : "@/assets/images/company-logo.png";
    this.portalName = getItem("portal_name");
  },
  computed: {
    ...mapGetters({
      countries: "auth/getCountryListNav",
      clientSelected: "auth/getClientSelected",
      portalCountry: "auth/getPortalCountry",
      notificationList: "auth/getNotificationList",
      currency: "auth/getCurrency",
    }),
  },
  methods: {
    ...mapActions({
      getUser: "auth/getUser",
      connect: "auth/socketConnect",
      emitTpcCommonNotificationsEvent: "auth/emitTpcCommonNotificationsEvent",
      getUserNotification: "auth/getUserNotification",
      getCountryListFromAPI: "auth/getCountryListFromAPI",
      updateLanguage: "auth/updateLanguage",
      updateCountry: "auth/updateCountry",
      updateClientSelected: "auth/updateClientSelected",
      virtualLoginOTPOnly: "auth/virtualLoginOTPOnly",
      virtualLogin: "auth/virtualLogin",
      fetchAdminList: "manageAdmin/fetchAdminList",
    }),
    getNotifications(){
      this.showNotifyIcon = false;
      let platform = this.platform_name == 'admin'? 'admin' : this.platform_name == 'superadmin' ? 'superadmin': 'tpc' ;
      this.getUserNotification(platform).then(notification => {
        this.notificationData = notification.notification_list;
      });
    },
    redirectRoute(notify){
      let date = moment(notify.updated_at).format('DD/MM/YYYY');
      let queryParams = date.split("/");
      console.log(queryParams)
      if(notify.notif_type == 'alert' || notify.notif_type == 'accident' || notify.notif_type == 'inspection'){
        this.$router.push({
          path: `/tpc-portal/trips-dispatch/View-Details/${notify.trip_id}/Alerts?day=${queryParams[0]}&month=${queryParams[1]}&year=${queryParams[2]}`,
        });
      }
      else if(notify.notif_type == 'expense'){
        this.$router.push({
          path: `/tpc-portal/trips-dispatch/View-Details/${notify.trip_id}/Expenses?day=${queryParams[0]}&month=${queryParams[1]}&year=${queryParams[2]}`,
        });
      }
      else if(notify.notif_type == 'chat'){
        this.$emit('showChatBox', true)
      }
      else if(notify.notif_type == 'violation'){
        this.$router.push({
          path: `/tpc-portal/fine`,
        });
      }
    },
    checkVirtualLogin() {
      let result = false;
      if (getItem("isVirtualLogin") || getItem("isAdminVirtualLogin")) {
        result = true;
      }
      return result;
    },

    exitVirtualLogin() {
      let obj = "";
      let prevUserInfo = '' ;
      let email = '';
      let id = '';
      if (localStorage.getItem("virtual-superadmin-login-info")) {
        prevUserInfo = JSON.parse(localStorage.getItem("virtual-superadmin-login-info")) ;
        email = prevUserInfo.userInfo.email;
        id = prevUserInfo.userInfo.portal_id;
        obj = {
          data: {
            portal: "superadmin",
            portal_id: id,
            email: email,
          },
          platform: this.platform_name == 'admin'? 'admin' : this.platform_name == 'superadmin' ? 'superadmin': 'tpc' ,
        };
      } 
      else{
        prevUserInfo = JSON.parse(localStorage.getItem("virtual-admin-login-info")) ;
        email = prevUserInfo.userInfo.email;
        id = prevUserInfo.userInfo.portal_id;
        obj = {
          data: {
            portal: "admin",
            portal_id: id,
            email: email,
          },
          platform: this.platform_name == 'admin'? 'admin' : this.platform_name == 'superadmin' ? 'superadmin': 'tpc' ,
        };
      }
      this.virtualLoginOTPOnly(obj)
        .then((resp) => {
          if (resp && resp.statusCode === 200) {
            obj.data.otp = "202021";
            this.virtualLogin(obj)
              .then((resp2) => {
                if (resp2 && resp2.statusCode === 200) {
                  this.apiProcessing = false;
                  this.modalScreen = "otp";
                  setItem("isVirtualLogin", '');
                  setItem("isAdminVirtualLogin", '');
                  if (obj.data.portal === "superadmin") {
                    setItem("virtual-superadmin-login-info", '');
                    window.location.href = "/super-admin-portal/dashboard";
                  } else if (obj.data.portal === "admin") {
                    setItem("virtual-admin-login-info", '');
                    window.location.href = "/admin-portal/dashboard";
                  } else if (obj.data.portal === "tpc") {
                    window.location.href = "/tpc-portal/dashboard";
                  }
                } else {
                  this.$notify({
                    group: "notify-portal",
                    type: "warning",
                    title: "Information",
                    text:
                      resp2 && resp2.data && resp2.data.message
                        ? resp2.data.message
                        : "Some error occurred. Please try again.",
                  });
                }
              })
              .catch((err) => {
                this.$root.$emit(
                  "bv::hide::modal",
                  "action-modal",
                  "#action-modal"
                );
                this.$notify({
                  group: "notify-portal",
                  type: "warning",
                  title: "Information",
                  text: err,
                });
              });
          } else {
            this.$notify({
              group: "notify-portal",
              type: "warning",
              title: "Information",
              text:
                resp && resp.data && resp.data.message
                  ? resp.data.message
                  : "Some error occurred. Please try again.",
            });
          }
        })
        .catch((err) => {
          this.$root.$emit("bv::hide::modal", "action-modal", "#action-modal");
          this.$notify({
            group: "notify-portal",
            type: "warning",
            title: "Information",
            text: err,
          });
        });
    },

    navToHome() {
      // this.updateClientSelected(false);
      // window.location.href = "/tpc-portal/manage-clients";
      // this.$router.push({
      //   path: "/tpc-portal/manage-clients"
      // });
      if (this.platform_name === "super_admin") {
        this.$router.push({
          path: "/super-admin-portal/dashboard",
        });
      } else if (this.platform_name === "admin") {
        this.$router.push({
          path: "/admin-portal/dashboard",
        });
      } else if (this.platform_name === "transport_company") {
        this.$router.push({
          path: "/tpc-portal/dashboard",
        });
      }
    },

    checkClientSelected() {
      let clientSelected = false;
      if (this.$route.fullPath.indexOf("manage-clients/dashboard") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/group") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/concierge") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/vippax") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/school") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/business") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/student") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/guardian") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/passenger") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/business-client") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/trip") > -1) {
        clientSelected = true;
      }
      return clientSelected;
    },

    redirectToTPC() {
      // this.updateClientSelected(false);
      window.location.href = "/tpc-portal/manage-clients";
      // this.$router.push({
      //   path: "/tpc-portal/manage-clients"
      // });
    },

    /**
     * Change Language
     */
    changeLanguage(event) {
      i18next.changeLanguage(event.code); // Change Language Globally
      this.updateLanguage(event.code);
      EventBus.$emit("LanguageChange", event.code);
      // this.$i18n.i18next.changeLanguage(this.language.code); // Change Language Locally
      // this.$router.go();
    },

    /**
     * Update Country In Session
     * @param event
     */
    changeCountry(event) {
      if( 
          ( this.$route.path == "/super-admin-portal/admin/accounts" || 
            this.$route.path == "/super-admin-portal/accounts" ) && 
            event.id){
          this.fetchAdminList({
          identity: 1,
          // country: this.getCountryId ? this.getCountryId : "",
          country: event.id ? event.id : "",
        });
      }
      this.updateCountry(event.id);
    },

    menuToggle() {
      console.log(window.innerWidth);
      if (window.innerWidth <= 767) {
        this.menuSlide = !this.menuSlide;
        this.$root.menuToggle(this.menuSlide);
      }
    },

    /**
     * Search listing
     * @param event
     */
    initList() {
      EventBus.$emit("initList", this.tripSearch);
    },

    getNameIntials(name){
      return name.split(' ').map(x => x.charAt(0)).join('').substr(0, 2).toUpperCase();
    },
  },
};
</script>
<style lang="scss" scoped>
.dropdown-menu-header .dropdown-header{
     font-size: 13px;
    font-weight: bold;
    min-width: 270px;
    /* border-bottom: 1px solid #eee; */
    text-align: center;
    padding: 4px 0 6px 0;
}
.scrollable-container > a {
    padding: 7px 11px;
    text-decoration: none;
    -moz-transition: 0.5s;
    -o-transition: 0.5s;
    -webkit-transition: 0.5s;
    transition: 0.5s;
    display: block;
}
.scrollable-container > a .icon-notify {
    width: 36px;
    height: 36px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    display: inline-block;
    background-color: #1a73e8 !important;
}
.scrollable-container > a .menu-info{
    display: inline-block;
    position: relative;
    top: 3px;
    left: 5px;
}
.scrollable-container > a .menu-info > h4{
    margin: 0;
    font-size: 13px;
    color: #333;
    font-weight: bold;
}
.scrollable-container > a .menu-info  .message{
    margin: 0;
    font-size: 11px;
    color: #aaa;
}
.scrollable-container > a .icon-notify > i{
   line-height: 1.4;
}
   
.bar-left {
  padding-right: 20px;
  min-width: 190px;

  .d-flex {
    span:first-child {
      margin-right: 20px;
    }

    span:last-child {
      margin-left: 20px;
    }

    //.language-dropdown {
    //  padding: 7px 20px;
    //  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    //  border-radius: 2px;
    //}
  }
}
.bar-left-none {
  padding-right: 20px;
  min-width: 0;
}

.user-detail {
  .name {
    display: flex;
    flex-direction: column;
    text-align: right;
    margin-right: 10px;
    border-left: 2px solid #f0f0f0;
    padding-left: 20px;

    span:first-child {
      color: #727272;
      font-size: 14px;
      font-weight: 600;
    }

    span:last-child {
      color: #b4b4b4;
      font-size: 13px;
    }
  }
}
// Todo: Check mange Style
.nav-img {
  width: 45px;
  height: 45px;
}
.initialletter1 {
  display: inline-block;
  width: 36px;
  height: 36px;
  background-color: #41c7db;
  margin-right: 10px;
  border-radius: 100%;
  text-align: center;
  color: #ffffff;
  line-height: 36px;
  font-size: 16px;
  font-weight: 600;
  min-width: 36px;
}
</style>

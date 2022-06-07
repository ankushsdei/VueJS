<template>
  <div class="w-100 overflow-main" :class="{ 'isRTL arabic-theme': isRTL }">
    <nprogress-container></nprogress-container>
    <notifications group="notify-portal" />
    <Portal v-if="authorized_routes">
      <router-view />
    </Portal>
    <v-app  v-else>
      <router-view />
    </v-app>
    <div class="main-overlay" :class="{ show: showOverlay }" ref="main_overlay"></div>
  </div>
</template>
<script>
// Todo: Use Later
// import Full from "./layouts/Full";
import Portal from "./layouts/Portal";
import NprogressContainer from "../node_modules/vue-nprogress/src/NprogressContainer";
import { mapGetters, mapActions } from "vuex";
import "./directives/format-amount";
import "./directives/initials";
import LanguageHelper from '@/helpers/lang'
import i18next from 'i18next'

export default {
  name: "Innovent",
  components: {
    Portal,
    NprogressContainer: NprogressContainer
  },
  data() {
    return {
      isRTL: false,
      platform: "",
      showOverlay: false
    };
  },
  computed: {
    ...mapGetters({
      lang: "auth/getLanguage"
    }),
    authorized_routes () {
      const { access } = this.$route.meta
      if (access) {
        switch (access) {
          case 'public': return false
        }
      }
      return true
    }
  },
  watch: {
    lang: {
      immediate: true,
      handler: 'langChanged'
    },
    $route() {
      this.showOverlay = false;
    }
  },
  mounted() {
    this.$root.$on("bv::dropdown::show", () => {
      this.showOverlay = true;
    });
    this.$root.$on("bv::dropdown::hide", () => {
      this.showOverlay = false;
    });
  },
  beforeMount() {
    this.langChanged()
    this.platform = this.$route.meta.platform
  },
  methods: {
    ...mapActions('auth', [ 'updateLanguage' ]),
    langChanged () {
      const lang = LanguageHelper.vuetifyLang
      this.$vuetify.lang.current = lang
      i18next.changeLanguage(lang)
      this.updateLanguage(lang)
      if (lang == 'ar') {
        this.isRTL = true
        this.$vuetify.rtl = true
        document.getElementById('bootstrap').setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-v4-rtl/4.5.2-1/js/bootstrap.min.js')
        document.getElementById('bootstrapcss').setAttribute('href', 'https://cdn.rtlcss.com/bootstrap/v4.5.3/css/bootstrap.min.css')
      } else {
        this.isRTL = false;
        this.$vuetify.rtl = false
        document.getElementById('bootstrap').setAttribute('src', 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js')
        document.getElementById('bootstrapcss').setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css')
      }
    },
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
@import "./assets/css/theme";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

/* Tooltip Style Start*/
.tooltip {
  display: block !important;
  z-index: 10000;

  .tooltip-inner {
    background: #f4f7fa;
    color: #727272;
    border-radius: 2px;
    padding: 5px 10px 4px;
    border: 1px solid #d0ddf4;
    border-radius: 3px;
  }

  .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: #d0ddf4;
    z-index: 1;
  }

  &[x-placement^="top"] {
    margin-bottom: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 0 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      bottom: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="bottom"] {
    margin-top: 5px;

    .tooltip-arrow {
      border-width: 0 5px 5px 5px;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      top: -5px;
      left: calc(50% - 5px);
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  &[x-placement^="right"] {
    margin-left: 5px;

    .tooltip-arrow {
      border-width: 5px 5px 5px 0;
      border-left-color: transparent !important;
      border-top-color: transparent !important;
      border-bottom-color: transparent !important;
      left: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &[x-placement^="left"] {
    margin-right: 5px;

    .tooltip-arrow {
      border-width: 5px 0 5px 5px;
      border-top-color: transparent !important;
      border-right-color: transparent !important;
      border-bottom-color: transparent !important;
      right: -5px;
      top: calc(50% - 5px);
      margin-left: 0;
      margin-right: 0;
    }
  }

  &.popover {
    $color: #f9f9f9;

    .popover-inner {
      background: $color;
      color: black;
      padding: 24px;
      border-radius: 1px;
      box-shadow: 0 5px 30px rgba(black, 0.1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }

  &[aria-hidden="true"] {
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.15s, visibility 0.15s;
  }

  &[aria-hidden="false"] {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.15s;
  }
}

/* Tooltip Style End*/
@import "assets/css/style.css";
@import "assets/css/custom.css";

// Global CSS for icon only
// Todo: shift in correct place once done
.innov-icon {
  font-size: 25px;
}

.active .innov-icon {
  color: #713ced;
}
.innov-icon {
  color: #caced3;
}

.nprogress-custom-parent {
  position: unset;
}
#nprogress {
  .bar {
    background: #623cea;
  }
  .spinner {
    display: none;
  }
}

.isRTL {
  @font-face {
    font-family: "Tajawal";
    src: url("./assets/fonts/arabic-font/Tajawal-Regular.woff") format("woff");
    font-weight: normal;
    font-style: normal;
  }

  direction: rtl !important;
  text-align: right !important;
  font-family: "Tajawal" !important;

  .list-group {
    padding-inline-start: 0;
  }

  .sidebar .list-group-item.active::after {
    right: -9px;
    border-radius: 7px 0px 0px 7px;
  }

  .add-btn span:last-child {
    margin-left: 0;
    margin-right: 10px;
  }

  .stats-container .border-box .count-box .count-label span:first-child {
    text-align: right;
  }

  .stats-container .border-box .count-box .icon {
    margin-right: 0px;
    margin-left: 10px;
  }

  .stats-container .border-box .selection-one > img {
    margin-right: 0px;
    margin-left: 8px;
  }

  .login-section-btn {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
  }

  .steps-bar ul li:before {
    right: 35px;
  }

  .toggle-switch label {
    margin-left: 10px;
  }

  .site-primary-btn {
    flex-direction: row-reverse;
    justify-content: flex-start;
  }

  img.auth-img {
    margin-left: 10px;
    margin-right: 0;
  }

  .role-filter-table .role-image-td p,
  .role-filter-table .table p,
  .role-filter-table table,
  .role-filter-table .table tbody td span {
    text-align: right;
  }

  .action-toggle-detail {
    display: flex !important;
    align-items: center !important;
  }

  span.action-toggle-detail i.icon-detail-hide {
    transform: rotate(180deg);
  }

  span.action-toggle-detail i {
    margin-left: 5px;
  }

  ul.table-actions-wrapper.custom-table-actions-wrapper {
    left: 62px;
    right: auto !important;
  }

  ul.table-actions-wrapper.custom-table-actions-wrapper li label {
    margin-right: 8px;
    margin-left: 0;
  }

  .action-card.custom-action-card .official-details .field-row:first-child {
    border-left: 1px solid #d0ddf4;
    border-right: none;
  }

  .action-card.custom-action-card .official-details .field-row .border-icon {
    margin-left: 10px;
    margin-right: 0;
  }
  .slick-slide {
    float: right !important;
  }
  .nav-sub-tabs .info-content-tab .info-icon-data:first-child {
    margin-right: 20px;
    margin-left: 0;
  }
  .nav-sub-tabs .info-content-tab .info-icon-data {
    margin-right: 30px;
    margin-left: 0;
  }
  .info-icon-data.custom-info-icon-data .big-icon,
  .info-icon-data.custom-info-icon-data img,
  .admin-account-icon-data .info-icon-data .account-icon-image {
    right: -30px;
    left: auto !important;
  }
  .comment-section .title span:last-child {
    margin-right: 6px;
    margin-left: 0;
  }
  .all-tabs.arrow-fix-design li i.innov-icon {
    margin-right: 0;
    margin-left: 5px;
  }
  .all-tabs ul li:first-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .send-icon.set-location {
    left: 25px;
    right: auto !important;
    transform: rotate(180deg);
  }
  .log-history-tab h2.main-heading1 img {
    margin-right: 0;
    margin-left: 10px;
  }
  .info-content-tab1 .info-icon-data1:before,
  .info-content-tab1 .info-icon-rule1:before .info-icon-new-data:before {
    right: -24px;
    left: auto !important;
    width: 27%;
    height: 50px;
  }
  .role-filter-table .table thead th,
  .role-filter-table .table tbody th,
  .role-filter-table .table tbody td,
  .created-role-dv h2 {
    text-align: right;
  }

  .tabs-content h2 span i.fa {
    margin-right: 0;
    margin-left: 5px;
    cursor: pointer;
  }
  ul {
    padding-inline-start: 0px;
  }
  .nav-tabs li.nav-item.active:first-child a {
    border-top-right-radius: 0px;
    border-top-left-radius: 25px !important;
  }
  .nav-tabs .nav-item.active a::after {
    left: -20px;
    right: auto;
  }
  .nav-tabs .nav-item:first-child:after {
    left: -10px;
    right: auto;
  }
  .profile-section img {
    margin: 0 0 0 10px !important;
  }
  .sidemenu-tooltip {
    right: 78px;
    left: auto !important;
  }
  .sidemenu-tooltip::after {
    right: auto !important;
    left: 100%;
    border-left-color: #623cea;
    border-right-color: transparent !important;
  }
  .sidemenu-tooltip span {
    padding: 10px !important;
  }
  .seperate-info span {
    text-align: left !important;
  }
  .comment-section .show-comment .comment-user-bar .left .name {
    margin-left: 10px !important;
    margin-right: 10px;
  }
  .comment-section .show-comment .comment-user-bar .left .name > span:first-child,
  .created-image-role p,
  .description,
  .inner-p {
    text-align: right !important;
  }
  .nav-tabs .nav-item.active a::before {
    right: -20px;
    left: auto !important;
  }
  .nav-tabs .nav-item.active:before {
    right: -10px;
    left: auto !important;
  }
  .nav-tabs .nav-item.active:after {
    left: -10px;
    right: auto !important;
  }
  .added-info .nav-tabs li:last-child .nav-link.active,
  .nav-tabs.slider-tabs .slick-track .slick-slide:last-child .nav-item.active a {
    border-top-left-radius: 0px !important;
    border-top-right-radius: 25px !important;
  }
  .nav-tabs.slider-tabs .slick-track .slick-slide:first-child .nav-item.active a {
    border-top-right-radius: 0px !important;
    border-top-left-radius: 25px !important;
  }
  .icon-search {
    margin-left: 0 !important;
    transform: rotate(180deg);
  }
  .stats-container .clickable .border-box.inactive,
  .stats-container .clickable .border-box.inactive:hover {
    border-right: 4px solid #da4336;
    border-left: transparent !important;
  }
  .stats-container .border-box,
  .stats-container .border-box:hover {
    border-right: 4px solid #3ba006;
    border-left: none !important;
  }
  .stats-container .clickable .border-box.free,
  .stats-container .clickable .border-box.free:hover {
    border-right: 4px solid #41c7db;
    border-left: none !important;
  }
  .transport-dashboard-section .info-icon-data img.info-style-r-center {
    right: -18px;
    left: auto !important;
  }
  .nav-sub-tabs .info-content-tab .info-icon-data span:last-child,
  .content-with-image.content-no-image .box-4 .inner-span-con:first-child span:first-child {
    text-align: left !important;
  }
  .content-with-image.content-no-image .info-icon-data i.custom-i {
    right: -26px;
    left: auto !important;
  }
  .box-4 .flex-outer .inner-span-con span:last-child,
  .box-4 .flex-outer .inner-span-con:last-child {
    margin-right: 10px !important;
    text-align: left;
  }
  .flex-outer .inner-span-con span:last-child {
    margin-left: 10px;
    margin-right: 0 !important;
  }
  .bar-left .d-flex span:last-child {
    margin-right: 20px;
    margin-left: 0 !important;
    text-align: right;
  }
  .info-content-tab.custom-info-content-tab
    .flex-row.custom-info-content-inner
    .info-icon-data:first-child {
    margin-left: 0;
    margin-right: 30px;
  }
  .editable-list-info .flex-row .data-head span:last-child {
    margin-right: 5px;
    margin-left: 0 !important;
  }
  .editable-list-info .data-row .data-title .active-data img {
    margin-left: 6px;
    margin-right: 0 !important;
  }
  .form-group label:before {
    margin-left: 6px;
    margin-right: 0 !important;
  }
  .card-body-content1,
  .reported-tabs .card-header p,
  .history-collapse-data h2,
  .rights-access-user-table .tabs-inner-content p,
  .log-history-tab h2.main-heading1,
  .custom-user-multiselect .multiselect__option {
    text-align: right !important;
  }
  .info-icon-new-data {
    margin-right: 30px;
    margin-left: 0 !important;
  }
  .bar-left .d-flex span:first-child {
    margin-left: 20px;
    margin-right: 0 !important;
  }
  .user-detail .dropdown .dropdown-menu.show {
    right: auto !important;
    left: 0 !important;
  }
  .user-detail .dropdown .dropdown-menu a.dropdown-item i {
    margin-left: 10px;
    margin-right: 0 !important;
  }
  .box-content {
    margin-right: 15px;
    margin-left: 0 !important;
  }
  .radio-span {
    margin-right: 5px;
    margin-left: 0 !important;
  }
  .available_assets .fa {
    padding-left: 5px;
    padding-right: 0 !important;
  }
  .draggable-row {
    padding-left: 20px;
    padding-right: 0 !important;
  }
  .drag-row-action {
    margin-left: 25px !important;
  }
  // .border-box-outer .border-box {
  //     padding-left: 8rem;
  //     padding-right: 10px!important;
  // }
  .vacation-dv2,
  .vacation-dv1 {
    text-align: left;
  }
  .attendence-data-icon .seperate-info p {
    margin: 0 !important;
    text-align: left;
  }
  .official-details .field-row .border-icon {
    margin-left: 10px;
    margin-right: 0 !important;
  }
  @media (min-width: 768px) {
    /* Modify this based on column def */

    .custom-gutter > [class*="col-"] {
      padding-right: 5px;
      padding-left: 5px;
    }

    .custom-gutter > [class*="col-"]:first-child {
      padding-right: 15px;
    }

    .custom-gutter > [class*="col-"]:last-child {
      padding-left: 15px;
    }
    .border-box-main > [class*="border-"] {
      padding-right: 7.5px !important;
      padding-left: 7.5px !important;
    }

    .border-box-main > [class*="border-"]:first-child {
      padding-right: 15px !important;
    }

    .border-box-main > [class*="border-"]:last-child {
      padding-left: 15px !important;
    }

    .two-row.border-box-main > [class*="border-"]:nth-child(3) {
      padding-right: 15px !important;
    }

    .two-row.border-box-main > [class*="border-"]:nth-child(4) {
      padding-right: 7.5px !important;
    }

    .three-row.border-box-main > [class*="border-"]:nth-child(4) {
      padding-right: 15px !important;
    }

    .three-row.border-box-main > [class*="border-"]:nth-child(6) {
      padding-right: 7.5px !important;
    }
  }
}
</style>

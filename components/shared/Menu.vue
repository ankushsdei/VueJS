<template>
  <div class="row">
    <ul class="list-group">
      <template v-for="(menu, index) in navMenu">
        <li
          class="list-group-item test border-0"
          v-if="menu.noLink && !(menu.child && !menu.child.filter(d => d.isDisplay).length)"
          :key="'li_' + index"
          :class="isActiveMenu(menu)"
        >
          <i
            :class="
              'innov-icon icon-nav-' + menu.icon + ' ' + (menu.customClass ? menu.customClass : '')
            "
          ></i>
          <span v-show="false" class="menu-title sidemenu-tooltip">
            <span :class="[menu.child && menu.child.length ? 'activelable' : '']">{{
              $t(menu.title)
            }}</span>
            <ul class="">
              <!--<router-link>{{ $t(menu.title) }}</router-link>-->
              <li
                :style="[!submenu.isDisplay ? { height: '0px', padding: '0px' } : {}]"
                v-for="(submenu, ind) in menu.child"
                :key="ind"
              >
                <router-link
                  v-if="submenu.isDisplay"
                  @click.native="setActive(menu.title)"
                  :to="submenu.to"
                >
                  {{ submenu.title }}
                </router-link>
              </li>
            </ul>
          </span>
        </li>
        <template v-if="!menu.noLink">
          <router-link
            :key="'r_' + index"
            class="list-group-item menu-link-item border-0"
            tag="li"
            :to="menu.to"
            v-on:click.native="toggleNav()"
          >
            <!-- {{ menu }} -->
            <template v-if="menu.useSVG">
              <img :src="getMenuIcon(menu.icon)" width="100%" class="inactive-icon" />
              <img :src="getMenuIcon(menu.icon, true)" width="100%" class="active-icon" />
            </template>
            <fleet-animated-icon
              v-else-if="menu.useAnimated"
              :name="menu.icon"
              :stroke="$route.path == $router.resolve(menu.to).href ? 80 : 40"
              :style="`transform:${$route.path == $router.resolve(menu.to).href ? 'scale(1.4)' : 'none'}`"
            />
              <!-- :trigger="$route.path == $router.resolve(menu.to).href ? 'loop' : 'loop-on-hover'" -->
            <i v-else
              :class="
                'innov-icon icon-nav-' +
                  menu.icon +
                  ' ' +
                  (menu.customClass ? menu.customClass : '')
              "
            ></i>
            <span v-show="false" class="menu-title sidemenu-tooltip">
              <span :class="[menu.child && menu.child.length ? 'activelable' : '']">{{
                $t(menu.title)
              }}</span>
              <ul class="">
                <!--<router-link>{{ $t(menu.title) }}</router-link>-->
                <li
                  :style="[!submenu.isDisplay ? { height: '0px', padding: '0px' } : {}]"
                  v-for="(submenu, ind) in menu.child"
                  :key="ind"
                >
                  <router-link
                    v-if="submenu.isDisplay"
                    @click.native="setActive(menu.title)"
                    :to="submenu.to"
                  >
                    {{ submenu.title }}
                  </router-link>
                </li>
              </ul>
            </span>
          </router-link>
        </template>
      </template>
    </ul>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { ICONS } from '../elements/AnimatedIcon'


export default {
  name: "Menu",
  data() {
    return {
      isModulePermit: '',
      parentActive: false,
      currentPage: "",
      isActive: false,
      /**
       * Todo:  Must come from store or vuex dynamic accroding to
       * Super Admin | Admin | (Transport Companies)
       * RML logic to be here
       */
      navMenu: [],
      portal: ""
    };
  },
  sockets: {
    // Disconnecting current socket
    disconnect() {
      console.log("Disconnect the real time socket in future!");
    },
    connect() {
      console.log("Connected the real time socket in future!");
    }
  },
  watch: {
    isUpdateAvailable: {
      // This will let Vue know to look inside the array
      deep: true,
      // We have to move our method to a handler field
      handler() {
        if (this.isUpdateAvailable) {
          let routerBasePlatform = this.$route.fullPath.split("/")[1];
          if (routerBasePlatform === "super-admin-portal") {
            this.portal = "superadmin";
          }
          if (routerBasePlatform === "admin-portal") {
            this.portal = "admin";
          }
          if (routerBasePlatform === "tpc-portal") {
            this.portal = "tpc";
          }
          console.log("Connect Called");
          this.getUserAccess(this.portal);
          this.setNoUpdateAvailable();
        }
      }
    },
    userAccess: {
      // This will let Vue know to look inside the array
      deep: true,
      // We have to move our method to a handler field
      handler(value) {
        console.log(value)
        // Reset the Menu
        this.upMenus(this.isModulePermit = 2);
      }
    }
  },
  mounted() {
    // console.log(userAccess)
    this.upMenus(this.isModulePermit = 1);
    if (!this.isConnected) {
      let routerBasePlatform = this.$route.fullPath.split("/")[1];
      if (routerBasePlatform === "super-admin-portal") {
        this.portal = "superadmin";
      }
      if (routerBasePlatform === "admin-portal") {
        this.portal = "admin";
      }
      if (routerBasePlatform === "tpc-portal") {
        this.portal = "tpc";
      }
      console.log("Connect Called");
      this.connect(this.portal);
    }
  },
  computed: {
    ...mapGetters({
      // Basic
      userAccess: "auth/getUserAccess",
      isConnected: "auth/isConnected",
      isUpdateAvailable: "auth/getRoleUpdate"
    })
  },
  methods: {
    ...mapActions({
      connect: "auth/socketConnect",
      setNoUpdateAvailable: "auth/setNoUpdateAvailable",
      getUserAccess: "auth/getUserAccess"
    }),
    getMenuIcon (icon, active) {
      try {
        const _icon = require(`@/assets/images/Sidebar/${icon}${active ? '-active' : ''}.svg`)
        return _icon
      } catch { return '' }
    },
    isActiveMenu(menu) {
      return menu.child.some(item => item.to === this.$route.fullPath) ? "active" : "";
    },
    toggleNav() {
      this.$root.navToggle();
    },

    setActive(item) {
      this.currentPage = item;
    },

    checkUserAccess(module_code) {
      // let isExist = true;
      let isPermitted = false;
      try {
        let tempUserAcc = this.isModulePermit == 1 ? JSON.parse(localStorage.getItem("user-access")): JSON.parse(this.userAccess);
        // console.log(tempUserAcc, this.isModulePermit)
        // let tempUserAcc = JSON.parse(localStorage.getItem("user-access"));
        tempUserAcc.forEach(item => {
          let tempFeature = item.feature && item.feature != "[]" ? JSON.parse(item.feature) : [];
          if (
            module_code &&
            item.code &&
            item.code.toLowerCase() === module_code.toLowerCase() &&
            tempFeature &&
            tempFeature.length > 0
          ) {
            isPermitted = true;
          }
          // if (module_code && item.code && item.code.toLowerCase() === module_code.toLowerCase()) {
          //   isExist = true;
          // }
        });
      } catch (ex) {
        console.log(ex);
      }
      // return !isExist || isPermitted;
      return isPermitted;
    },

    checkClientSelected() {
      let clientSelected = false;
      let isPassenger = false;
      let isEntity = false;
      let isGroup = false;
      let isBusiness = false;
      let isSchool = false;
      if (this.$route.fullPath.indexOf("manage-clients/dashboard") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/school") > -1) {
        // isEntity = true;
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/business") > -1) {
        clientSelected = true;
        // isBusiness = true;
        // isEntity = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/vippax") > -1) {
        clientSelected = true;
        // isBusiness = true;
        // isEntity = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/concierge") > -1) {
        clientSelected = true;
        // isBusiness = true;
        // isEntity = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/group/business") > -1) {
        clientSelected = true;
        // isBusiness = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/group/school") > -1) {
        clientSelected = true;
        // isSchool = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/student") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/guardian") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/passenger") > -1) {
        // isPassenger = true;
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/business-client") > -1) {
        clientSelected = true;
      }
      if (this.$route.fullPath.indexOf("manage-clients/trips") > -1) {
        clientSelected = true;
      }
      let route = "";
      if (localStorage.getItem("customer_type") == 1) {
        isBusiness = true;
      }
      if (localStorage.getItem("customer_type") == 2) {
        isSchool = true;
      }
      if (localStorage.getItem("customer_account_type") == 1) {
        isGroup = true;
        route = `/tpc-portal/manage-clients/group/${
          isBusiness ? "business" : "school"
        }/dashboard/${localStorage.getItem("customer_id")}`;
      }
      if (localStorage.getItem("customer_account_type") == 2) {
        isEntity = true;
        route = `/tpc-portal/manage-clients/${
          isBusiness ? "business" : "school"
        }/dashboard/${localStorage.getItem("customer_id")}`;
      }
      if (localStorage.getItem("customer_account_type") == 3) {
        isPassenger = true;
        route = "/tpc-portal/manage-clients/passenger/dashboard/" + localStorage.getItem("pax_id");
      }
      return {
        clientSelected: clientSelected,
        isPassenger: isPassenger,
        isEntity: isEntity,
        isBusiness: isBusiness,
        isSchool: isSchool,
        isGroup: isGroup,
        route: route
      };
    },

    upMenus() {
      // Todo: update its must from apis
      let themeChecker = "";
      let routerBasePlatform = this.$route.fullPath.split("/")[1];
      if (routerBasePlatform === "super-admin-portal") {
        themeChecker = JSON.parse(localStorage.getItem("innov-superadmin")).theme;
      }
      if (routerBasePlatform === "admin-portal") {
        themeChecker = JSON.parse(localStorage.getItem("innov-admin")).theme;
      }
      if (routerBasePlatform === "tpc-portal") {
        themeChecker = JSON.parse(localStorage.getItem("innov-tpc")).theme;
      }
      let tempNavMenu = [];
      // Super Admin
      if (themeChecker == "pro-theme") {
        tempNavMenu = [
          {
            title: "home",
            to: "/super-admin-portal/dashboard",
            icon: "dashboard",
            isDisplay: true
          },
          // {
          //   title: "sales",
          //   to: "/super-admin-portal/sales",
          //   icon: "sales",
          //   isDisplay: this.checkUserAccess("sales")
          // },
          {
            title: "vendor_management",
            to: "/super-admin-portal/vendor-management",
            icon: "vendor",
            isDisplay: this.checkUserAccess("vendors")
          },
          {
            title: "wiot_admin",
            to: "/super-admin-portal/admin/accounts",
            icon: "staff-accounts",
            isDisplay: this.checkUserAccess("wiot_admin")
          },
          {
            title: "reseller_admin",
            to: "/super-admin-portal/accounts",
            icon: "admin-accounts",
            isDisplay: this.checkUserAccess("reseller")
          },

          // {
          //   title: "wiot_staff",
          //   to: "/super-admin-portal/staff-management",
          //   icon: "roles",
          //   isDisplay: this.checkUserAccess("staff"),
          // },
          // {
          //   title: "role_management",
          //   to: "/super-admin-portal/role-management",
          //   icon: "role-management",
          //   isDisplay: this.checkUserAccess("roles"),
          // },
          {
            title: "finance",
            to: "/super-admin-portal/finance",
            icon: "finance",
            noLink: true,
            isDisplay:
              this.checkUserAccess("payroll") ||
              this.checkUserAccess("payable") ||
              this.checkUserAccess("receivable"),
            child: [
              {
                title: this.$i18n.t("payroll"),
                to: "/super-admin-portal/finance/payroll",
                icon: "email-template",
                isDisplay: this.checkUserAccess("payroll")
              },
              {
                title: this.$i18n.t("payables"),
                to: "/super-admin-portal/finance/payables",
                icon: "email-template",
                isDisplay: this.checkUserAccess("payable")
              },
              {
                title: this.$i18n.t("receivables"),
                to: "/super-admin-portal/finance/receivables",
                icon: "email-template",
                isDisplay: this.checkUserAccess("receiveable")
              }
            ]
          },
          {
            title: "hr",
            to: "/super-admin-portal/emp-type",
            icon: "hr",
            noLink: true,
            isDisplay:
              this.checkUserAccess("labour_category") ||
              this.checkUserAccess("staff") ||
              this.checkUserAccess("roles"),
            child: [
              {
                title: this.$i18n.t("role_management"),
                to: "/super-admin-portal/role-management",
                icon: "role-management",
                isDisplay: this.checkUserAccess("roles")
              },
              {
                title: this.$i18n.t("wiot_staff"),
                to: "/super-admin-portal/staff-management",
                icon: "roles",
                isDisplay: this.checkUserAccess("staff")
              },
              {
                title: this.$i18n.t("labour_category"),
                to: "/super-admin-portal/emp-type",
                icon: "hr",
                isDisplay: this.checkUserAccess("labour_category")
              }
            ]
          },
          {
            title: "legal",
            to: "/super-admin-portal/legal-manager",
            icon: "legal-manager",
            isDisplay: this.checkUserAccess("legal_manager")
          },
          {
            title: "auto_emails",
            to: "/super-admin-portal/email-template-manager",
            icon: "auto-emails",
            isDisplay: this.checkUserAccess("email")
          },
          // {
          //   title: "fee_management",
          //   to: "/super-admin-portal/fee-management",
          //   icon: "transport-type-manager",
          //   isDisplay: this.checkUserAccess("fee_management"),
          // },
          {
            title: "rules_and_regulations",
            to: "/super-admin-portal/hos-rule-engine",
            icon: "role-management",
            noLink: true,
            isDisplay:
              this.checkUserAccess("hos_management") ||
              this.checkUserAccess("dvir_management") ||
              this.checkUserAccess("vehicles"),
            child: [
              {
                title: this.$i18n.t("hos_preset"),
                to: "/super-admin-portal/hos-rule-engine",
                icon: "email-template",
                isDisplay: this.checkUserAccess("hos_management")
              },
              {
                title: this.$i18n.t("dvir_preset"),
                to: "/super-admin-portal/dvir-checklist-manager",
                icon: "email-template",
                isDisplay: this.checkUserAccess("dvir_management")
              },
              {
                title: this.$i18n.t("vehicle_preset"),
                to: "/super-admin-portal/vehicle-manager",
                icon: "transport-type-manager",
                isDisplay: this.checkUserAccess("vehicles")
              }
            ]
          },
          {
            title: "maintenance_preset",
            to: "/super-admin-portal/maintenance",
            icon: "maintenace-preset",
            isDisplay: this.checkUserAccess("maintenance_preset")
          },

          // {
          //   title: "WioT Support",
          //   to: "/super-admin-portal/support",
          //   icon: "support",
          //   isDisplay: this.checkUserAccess("wiot_support")
          // },
          {
            title: "service_setup",
            to: "/super-admin-portal/manage-currencies-taxes",
            icon: "wealth",
            noLink: true,
            // isDisplay: this.checkUserAccess("service_setup"),
            isDisplay:
              this.checkUserAccess("currency") || this.checkUserAccess("transport_type_manager") || this.checkUserAccess("fee_management"),
            child: [
              {
                title: this.$i18n.t("currency_management"),
                to: "/super-admin-portal/manage-currencies-taxes",
                icon: "wealth",
                isDisplay: this.checkUserAccess("currency")
              },
              {
                title: this.$i18n.t("transport_type_manager"),
                to: "/super-admin-portal/transport-type-manager",
                icon: "transport-type-manager",
                isDisplay: this.checkUserAccess("transport_type_manager")
              },
              {
                title: this.$i18n.t("fee_management"),
                to: "/super-admin-portal/fee-management",
                icon: "transport-type-manager",
                isDisplay: this.checkUserAccess("fee_management")
              }
            ]
          },
          {
            title: "hardware_type_manager",
            to: "/super-admin-portal/hardware-type-manager",
            icon: "hardware",
            isDisplay: this.checkUserAccess("hardware_software")
          },
          // {
          //   title: "bi_reports",
          //   to: "/super-admin-portal/report",
          //   icon: "reports",
          //   isDisplay: this.checkUserAccess("bi_reports")
          // },
          {
            title: "admin_portal.faq",
            to: "/super-admin-portal/faq",
            icon: "faq",
            isDisplay: this.checkUserAccess("faq")
          },
          {
            title: "admin_portal.content_management",
            to: "/super-admin-portal/content-management",
            icon: "email-template",
            // isDisplay: true,
            isDisplay: this.checkUserAccess("content_management")
          },
          {
            title: "language_management",
            to: "/super-admin-portal/language-management",
            icon: "languages",
            isDisplay: this.checkUserAccess("language_management")
          },
          {
            title: "wiot_support",
            to: "/super-admin-portal/support-tickets",
            icon: "newspaper",
            // isDisplay: true
            isDisplay: this.checkUserAccess("wiot_support")
          },
          {
            title: "log_out",
            to: "/logout",
            icon: "logout",
            isDisplay: true
          }
        ];
        // Admin
      } else if (themeChecker == "light-theme") {
        tempNavMenu = [
          {
            title: "home",
            to: "/admin-portal/dashboard",
            icon: "dashboard",
            isDisplay: true
          },
          {
            title: "sales",
            to: "/admin-portal/sales",
            icon: "sales",
            isDisplay: this.checkUserAccess("sales")
          },
          {
            title: "transport_companies",
            to: "/admin-portal/transport-companies",
            icon: "international-logistics-delivery-truck-symbol-with-world-grid-behind",
            isDisplay: this.checkUserAccess("manage_transport_company")
          },
          {
            title: "vendor_management",
            to: "/admin-portal/vendor-management",
            icon: "vendor",
            isDisplay: this.checkUserAccess("vendors")
          },
          {
            title: "hardware_type_manager",
            to: "/admin-portal/hardware-type-manager",
            icon: "hardware",
            isDisplay: this.checkUserAccess("hardware_software")
          },
          // Path Start
          {
            title: "reseller_admin",
            to: "/admin-portal/accounts",
            icon: "admin-accounts",
            isDisplay: this.checkUserAccess("reseller")
          },
          // {
          //   title: "Staff",
          //   to: "/admin-portal/staff-management",
          //   icon: "roles",
          //   isDisplay: this.checkUserAccess("staff"),
          // },
          // {
          //   title: "role_management",
          //   to: "/admin-portal/role-management",
          //   icon: "role-management",
          //   isDisplay: this.checkUserAccess("roles"),
          // },
          {
            title: "finance",
            to: "/admin-portal/finance",
            icon: "finance",
            noLink: true,
            isDisplay:
              this.checkUserAccess("payroll") ||
              this.checkUserAccess("payable") ||
              this.checkUserAccess("receivable"),
            child: [
              {
                title: this.$i18n.t("payroll"),
                to: "/admin-portal/finance/payroll",
                icon: "email-template",
                isDisplay: this.checkUserAccess("payroll")
              },
              {
                title: this.$i18n.t("payables"),
                to: "/admin-portal/finance/payables",
                icon: "email-template",
                isDisplay: this.checkUserAccess("payable")
              },
              {
                title: this.$i18n.t("receivables"),
                to: "/admin-portal/finance/receivables",
                icon: "email-template",
                isDisplay: this.checkUserAccess("receiveable")
              }
            ]
          },
          {
            title: "hr",
            to: "/admin-portal/emp-type",
            icon: "hr",
            noLink: true,
            isDisplay:
              this.checkUserAccess("labour_category") ||
              this.checkUserAccess("staff") ||
              this.checkUserAccess("roles"),
            child: [
              {
                title: this.$i18n.t("role_management"),
                to: "/admin-portal/role-management",
                icon: "role-management",
                isDisplay: this.checkUserAccess("roles")
              },
              {
                title: this.$i18n.t("staff_management"),
                to: "/admin-portal/staff-management",
                icon: "roles",
                isDisplay: this.checkUserAccess("staff")
              },
              {
                title: this.$i18n.t("labour_category"),
                to: "/admin-portal/emp-type",
                icon: "hr",
                isDisplay: this.checkUserAccess("labour_category")
              }
            ]
          },
          {
            title: "legal",
            to: "/admin-portal/legal-manager",
            icon: "legal-manager",
            isDisplay: this.checkUserAccess("legal_manager")
          },
          {
            title: "auto_emails",
            to: "/admin-portal/email-template-manager",
            icon: "auto-emails",
            isDisplay: this.checkUserAccess("email")
          },

          {
            title: "rules_and_regulations",
            to: "/admin-portal/hos-rule-engine",
            icon: "role-management",
            noLink: true,
            // isDisplay: true,
            // isDisplay:
            //   this.checkUserAccess("reules_regulation") || this.checkUserAccess("rules_regulation"),
            isDisplay:
              this.checkUserAccess("hos_management") ||
              this.checkUserAccess("maintenance_preset") ||
              this.checkUserAccess("violation_rule_engine") ||
              this.checkUserAccess("dvir_management"),
            child: [
              {
                title: this.$i18n.t("hos_preset"),
                to: "/admin-portal/hos-rule-engine",
                icon: "email-template",
                isDisplay: this.checkUserAccess("hos_management")
              },
              {
                title: this.$i18n.t("dvir_preset"),
                to: "/admin-portal/dvir-checklist-manager",
                icon: "email-template",
                isDisplay: this.checkUserAccess("dvir_management")
              },
              {
                title: this.$i18n.t("violation_preset"),
                to: "/admin-portal/violation-rule-engine",
                icon: "surface1",
                isDisplay: this.checkUserAccess("violation_rule_engine")
              },
              {
                title: this.$i18n.t("maintenance_preset"),
                to: "/admin-portal/management-rule",
                icon: "email-template",
                isDisplay: this.checkUserAccess("maintenance_preset")
              }
            ]
          },
          {
            title: "Fines",
            to: "/admin-portal/fine",
            icon: "fine",
            isDisplay: this.checkUserAccess("violation_fine")
          },
          // {
          //   title: "WioT Support",
          //   to: "/admin-portal/support",
          //   icon: "email-template",
          //   isDisplay: this.checkUserAccess("wiot_support")
          // },
          // {
          //   title: "bi_reports",
          //   to: "/admin-portal/report",
          //   icon: "email-template",
          //   isDisplay: this.checkUserAccess("bi_reports")
          // },
          {
            title: "admin_portal.faq",
            to: "/admin-portal/faq",
            icon: "faq",
            // isDisplay: true
            isDisplay: this.checkUserAccess("faq")
          },
          {
            title: "admin_portal.content_management",
            to: "/admin-portal/content-management",
            icon: "email-template",
            // isDisplay: true,
            isDisplay: this.checkUserAccess("content_management")
          },
          {
            title: "language_management",
            to: "/admin-portal/language-management",
            icon: "email-template",
            isDisplay: this.checkUserAccess("language_management")
          },
          {
            title: "fee_management",
            to: "/admin-portal/fee-management",
            icon: "transport-type-manager",
            isDisplay: this.checkUserAccess("fee_management")
          },
          {
            title: "wiot_support",
            to: "/admin-portal/support-tickets",
            icon: "newspaper",
            // isDisplay: true
            isDisplay: this.checkUserAccess("wiot_support")
          },
          {
            title: "log_out",
            to: "/logout",
            icon: "logout",
            isDisplay: true
          }
        ];
        // TPC
      } else {
        if (this.checkClientSelected().isPassenger && this.checkClientSelected().clientSelected) {
          let route = this.checkClientSelected().route;
          tempNavMenu = [
            {
              title: "Manage Passengers",
              to: route,
              icon: "stickman-1",
              isDisplay: this.checkUserAccess("manage_passenger")
            },
            {
              title: "Manage Trips",
              to: "/tpc-portal/manage-clients/trip",
              icon: "support-1",
              isDisplay: this.checkUserAccess("manage_passenger")
            }
          ];
        } else if (
          this.checkClientSelected().isEntity &&
          this.checkClientSelected().clientSelected
        ) {
          let route = this.checkClientSelected().route;
          // let route = '/tpc-portal/manage-clients/'
          if (this.checkClientSelected().isBusiness) {
            tempNavMenu = [
              {
                title: "Manage Entity",
                to: route,
                icon: "user1",
                isDisplay: this.checkUserAccess("manage_entity")
              },
              {
                title: "Manage VIP Pax",
                to: "/tpc-portal/manage-clients/vippax",
                icon: "student",
                isDisplay: this.checkUserAccess("manage_passenger")
              },
              {
                title: "Manage Concierge",
                to: "/tpc-portal/manage-clients/concierge",
                icon: "guardian1",
                isDisplay: this.checkUserAccess("manage_passenger")
              },
              {
                title: "Manage Passengers",
                to: "/tpc-portal/manage-clients/passenger",
                icon: "stickman-1",
                isDisplay: this.checkUserAccess("manage_passenger")
              },
              {
                title: "Manage Trips",
                to: "/tpc-portal/manage-clients/trip",
                icon: "support-1",
                isDisplay: this.checkUserAccess("manage_passenger")
              }
            ];
          } else {
            tempNavMenu = [
              {
                title: "Manage Entity",
                to: route,
                icon: "user1",
                isDisplay: this.checkUserAccess("manage_entity")
              },
              {
                title: "Manage Students",
                to: "/tpc-portal/manage-clients/student",
                icon: "student",
                isDisplay: this.checkUserAccess("manage_passenger")
              },
              {
                title: "Manage Guardians",
                to: "/tpc-portal/manage-clients/guardian",
                icon: "guardian1",
                isDisplay: this.checkUserAccess("manage_passenger")
              },
              {
                title: "Manage Passengers",
                to: "/tpc-portal/manage-clients/passenger",
                icon: "stickman-1",
                isDisplay: this.checkUserAccess("manage_passenger")
              },
              {
                title: "Manage Trips",
                to: "/tpc-portal/manage-clients/trip",
                icon: "support-1",
                isDisplay: this.checkUserAccess("manage_passenger")
              }
            ];
          }
        } else if (
          this.checkClientSelected().isGroup &&
          this.checkClientSelected().clientSelected
        ) {
          let route = this.checkClientSelected().route;
          if (this.checkClientSelected().isBusiness) {
            tempNavMenu = [
              {
                title: "Manage Groups",
                to: route,
                icon: "user1",
                isDisplay: this.checkUserAccess("manage_client")
              },
              {
                title: "Manage Business",
                to: "/tpc-portal/manage-clients/business",
                icon: "school-1",
                isDisplay: this.checkUserAccess("manage_entity")
              },
              {
                title: "Manage VIP Pax",
                to: "/tpc-portal/manage-clients/vippax",
                icon: "student",
                isDisplay: this.checkUserAccess("manage_passenger")
              },
              {
                title: "Manage Concierge",
                to: "/tpc-portal/manage-clients/concierge",
                icon: "guardian1",
                isDisplay: this.checkUserAccess("manage_passenger")
              },
              {
                title: "Manage Passengers",
                to: "/tpc-portal/manage-clients/passenger",
                icon: "stickman-1",
                isDisplay: this.checkUserAccess("manage_passenger")
              },
              {
                title: "Manage Trips",
                to: "/tpc-portal/manage-clients/trip",
                icon: "support-1",
                isDisplay: this.checkUserAccess("manage_passenger")
              }
              //
              // {
              //   title: "Manage Business Clients",
              //   to: "/tpc-portal/manage-clients/business-client",
              //   icon: "email-template",
              //   isDisplay: this.checkUserAccess("manage_passenger")
              // }
            ];
          } else {
            tempNavMenu = [
              {
                title: "Manage Groups",
                to: route,
                icon: "user1",
                isDisplay: this.checkUserAccess("manage_client")
              },
              {
                title: "Manage Schools",
                to: "/tpc-portal/manage-clients/school",
                icon: "school-1",
                isDisplay: this.checkUserAccess("manage_entity")
              },
              {
                title: "Manage Students",
                to: "/tpc-portal/manage-clients/student",
                icon: "student",
                isDisplay: this.checkUserAccess("manage_passenger")
              },
              {
                title: "Manage Guardians",
                to: "/tpc-portal/manage-clients/guardian",
                icon: "guardian1",
                isDisplay: this.checkUserAccess("manage_passenger")
              },
              {
                title: "Manage Passengers",
                to: "/tpc-portal/manage-clients/passenger",
                icon: "stickman-1",
                isDisplay: this.checkUserAccess("manage_passenger")
              },
              {
                title: "Manage Trips",
                to: "/tpc-portal/manage-clients/trip",
                icon: "support-1",
                isDisplay: this.checkUserAccess("manage_passenger")
              }
              // {
              //   title: "Manage Business Clients",
              //   to: "/tpc-portal/manage-clients/business-client",
              //   icon: "email-template",
              //   isDisplay: this.checkUserAccess("manage_passenger")
              // }
            ];
          }
        } else {
          tempNavMenu = [
            {
              title: "home",
              to: "/tpc-portal/dashboard",
              icon: "dashboard",
              isDisplay: true
            },
            {
              title: "trip_dispatch",
              to: "/tpc-portal/trips-dispatch",
              icon: "transport-type-manager",
              isDisplay: this.checkUserAccess("trip_dispatch")
            },
            {
              title: "live-map",
              to: "/tpc-portal/live",
              icon: ICONS.MAP,
              useAnimated: true,
              isDisplay: this.checkUserAccess("live_map")
            },
            // {
            //   title: "live-map",
            //   to: "/tpc-portal/live",
            //   icon: "map-outline",
            //   useSVG: true,
            //   isDisplay: this.checkUserAccess("trip_dispatch")
            // },
            {
              title: 'activites',
              to: '/tpc-portal/activities',
              icon: ICONS.TRACK_ORDER,
              useAnimated: true,
              isDisplay: this.checkUserAccess('activity')
            },
            // {
            //   title: "dvir_preset",
            //   to: "/tpc-portal/dvir-checklist-manager",
            //   icon: "dvir",
            //   isDisplay: this.checkUserAccess("dvir_management")
            // },
            // {
            //   title: "hos_preset",
            //   to: "/tpc-portal/hos-rule-engine",
            //   icon: "email-template",
            //   isDisplay: this.checkUserAccess("hos_management")
            // },
            {
              title: "manage_client",
              to: "/tpc-portal/manage-clients",
              icon: "support",
              isDisplay: this.checkUserAccess("manage_client")
            },
            {
              title: "vendor_management",
              to: "/tpc-portal/vendor-management",
              icon: "vendor",
              isDisplay: this.checkUserAccess("vendors")
            },
            {
              title: "Hardware Manager",
              to: "/tpc-portal/hardware-type-manager",
              icon: "hardware",
              isDisplay: this.checkUserAccess("hardware_software")
            },
            {
              title: "manage_driver",
              to: "/tpc-portal/manage-drivers",
              icon: "taxi-driver",
              isDisplay: this.checkUserAccess("manage_driver")
            },
            {
              title: "manage_assistant",
              to: "/tpc-portal/manage-assistants",
              icon: "icon-manage-assistants",
              isDisplay: this.checkUserAccess("manage_assistant")
            },
            // {
            //   title: "Manage Vehicles",
            //   to: "/tpc-portal/vehicle-manager",
            //   icon: "vehicle",
            //   customClass: "nav-sm-icon",
            //   isDisplay: this.checkUserAccess("manage_vehicle")
            // },
            {
              title: "manage_vehicles",
              to: "/tpc-portal/manage-vehicle",
              icon: "vehicle",
              customClass: "nav-sm-icon",
              isDisplay: this.checkUserAccess("manage_vehicle")
            },
            {
              title: "rules_and_regulations",
              to: "/tpc-portal/management-rule",
              icon: "role-management",
              noLink: true,
              isDisplay:
                this.checkUserAccess("hos_management") ||
                this.checkUserAccess("maintenance_preset") ||
                this.checkUserAccess("maintenance_management") || 
                this.checkUserAccess("violation_rule_engine") ||
                this.checkUserAccess("dvir_management") ,
              child: [
                {
                  title: this.$i18n.t("hos_preset"),
                  to: "/tpc-portal/hos-rule-engine",
                  icon: "email-template",
                  isDisplay: this.checkUserAccess("hos_management")
                },
                {
                  title: "Maintenance Rule",
                  to: "/tpc-portal/management-rule",
                  icon: "vehicle",
                  // isDisplay: true,
                  isDisplay: this.checkUserAccess("maintenance_preset")
                },
              
                {
                  title: this.$i18n.t("violations_rule_engine"),
                  to: "/tpc-portal/violation-rule-engine",
                  icon: "surface1",
                  isDisplay: this.checkUserAccess("violation_rule_engine")
                },

                {
                  title: this.$i18n.t("dvir_preset"),
                  to: "/tpc-portal/dvir-checklist-manager",
                  icon: "dvir",
                  isDisplay: this.checkUserAccess("dvir_management")
                },
              ]
            },
            {
                title: "Maintenance Management",
                to: "/tpc-portal/maintenance-management",
                icon: "vehicle",
                customClass: "nav-sm-icon",
                // icon: "branches",
                // isDisplay: true,
                isDisplay: this.checkUserAccess("maintenance_management")
            },
            // {
            //   title: "Manage Maintenance",
            //   to: "/tpc-portal/management-rule",
            //   icon: "icon-branches",
            //   // customClass: "nav-sm-icon",
            //   noLink: true,
            //   isDisplay:
            //     this.checkUserAccess("maintenance_preset") ||
            //     this.checkUserAccess("maintenance_management"),
            //   child: [
            //     {
            //       title: "Maintenance Rule",
            //       to: "/tpc-portal/management-rule",
            //       icon: "vehicle",
            //       // isDisplay: true,
            //       isDisplay: this.checkUserAccess("maintenance_preset")
            //     },
            //     {
            //       title: "Maintenance Management",
            //       to: "/tpc-portal/maintenance-management",
            //       icon: "vehicle",
            //       // isDisplay: true,
            //       isDisplay: this.checkUserAccess("maintenance_management")
            //     }
            //   ]
            // },
            // {
            //   title: "staff_management",
            //   to: "/tpc-portal/staff-management",
            //   icon: "roles",
            //   isDisplay: this.checkUserAccess("staff"),
            // },
            // {
            //   title: "role_management",
            //   to: "/tpc-portal/role-management",
            //   icon: "role-management",
            //   isDisplay: this.checkUserAccess("roles"),
            // },
            {
              title: "legal",
              to: "/tpc-portal/legal-manager",
              icon: "legal-manager",
              isDisplay: this.checkUserAccess("legal_manager")
            },
            {
              title: "finance",
              to: "/tpc-portal/finance",
              icon: "finance",
              noLink: true,
              isDisplay:
                this.checkUserAccess("payroll") ||
                this.checkUserAccess("payable") ||
                this.checkUserAccess("receiveable"),
              child: [
                {
                  title: this.$i18n.t("payroll"),
                  to: "/tpc-portal/finance/payroll",
                  icon: "email-template",
                  isDisplay: this.checkUserAccess("payroll")
                },
                {
                  title: this.$i18n.t("payables"),
                  to: "/tpc-portal/finance/payables",
                  icon: "email-template",
                  isDisplay: this.checkUserAccess("payable")
                },
                {
                  title: this.$i18n.t("receivables"),
                  to: "/tpc-portal/finance/receivables",
                  icon: "email-template",
                  isDisplay: this.checkUserAccess("receiveable")
                }
              ]
            },
            {
              title: "auto_emails",
              to: "/tpc-portal/email-template-manager",
              icon: "auto-emails",
              isDisplay: this.checkUserAccess("email")
            },
            {
              title: "manage_branches",
              to: "/tpc-portal/manage-branches",
              icon: "company",
              isDisplay: this.checkUserAccess("manage_branches")
            },
            {
              title: "manage_stations",
              to: "/tpc-portal/manage-stations",
              icon: "company",
              isDisplay: this.checkUserAccess("manage_stations")
            },
            {
              title: "geo_fences",
              to: "/tpc-portal/geo-fence",
              icon: "geofence",
              isDisplay: this.checkUserAccess("geo_fence")
            },
            {
              title: "savedplaces",
              to: "/tpc-portal/saved-places",
              icon: "saved-places",
              isDisplay: this.checkUserAccess("saved_places")
            },
            {
              title: "hr",
              to: "/tpc-portal/emp-type",
              icon: "hr",
              noLink: true,
              isDisplay:
                this.checkUserAccess("labour_category") ||
                this.checkUserAccess("staff") ||
                this.checkUserAccess("roles"),
              child: [
                {
                  title: this.$i18n.t("role_management"),
                  to: "/tpc-portal/role-management",
                  icon: "role-management",
                  isDisplay: this.checkUserAccess("roles")
                },
                {
                  title: this.$i18n.t("staff_management"),
                  to: "/tpc-portal/staff-management",
                  icon: "roles",
                  isDisplay: this.checkUserAccess("staff")
                },
                {
                  title: this.$i18n.t("labour_category"),
                  to: "/tpc-portal/emp-type",
                  icon: "hr",
                  isDisplay: this.checkUserAccess("labour_category")
                }
              ]
            },
            // {
            //   title: "WioT Support",
            //   to: "/tpc-portal/help-support",
            //   icon: "taxi-driver",
            //   isDisplay: this.checkUserAccess("wiot_support")
            // },
            // {
            //   title: "violations_rule_engine",
            //   to: "/tpc-portal/violation-rule-engine",
            //   icon: "surface1",
            //   isDisplay: this.checkUserAccess("violation_rule_engine")
            // },
            {
              title: "Fines",
              to: "/tpc-portal/fine",
              icon: "fine",
              isDisplay: this.checkUserAccess("violation_fine")
            },
            {
              title: "wiot_support",
              to: "/tpc-portal/support-tickets",
              icon: "newspaper",
              // isDisplay: true
              isDisplay: this.checkUserAccess("wiot_support")
            },
            {
              title: "reports",
              to: "/tpc-portal/reports",
              icon: "vendor",
              isDisplay: true
              // isDisplay: this.checkUserAccess("vendors")
            },
            {
              title: "log_out",
              to: "/logout",
              icon: "logout",
              isDisplay: true
            }
          ];
        }
      }
      this.navMenu = tempNavMenu.filter(item => item.isDisplay === true);
    }
  }
};
</script>
<style lang="scss" scoped>
.list-group-item {
  cursor: pointer;
}
.list-group-item {
  img {
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
  }
  &:hover,
  &:active {
    img {
      font-size: 150% !important;
      -webkit-transition: all 0.5s;
      transition: all 0.5s;
    }
  }
}
/*i.innov-icon:before {*/
/*  color: #caced3 !important;*/
/*}*/
</style>

<style lang="scss">
.list-group-item.menu-link-item {
  &.active {
    img.inactive-icon { display: none !important; }
  }
  &:not(.active) {
    img.active-icon { display: none !important; }
  }
}
</style>
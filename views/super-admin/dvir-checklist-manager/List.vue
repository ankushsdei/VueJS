<template>
  <div class="admin-account-list w-100">
    <div class="d-flex page-action-header justify-content-between">
      <breadcrumb :breadcrumbs="breadcrumbs" />
      <div class="page-actions d-flex">
        <addbutton v-if="checkUserAccess('add')" :addAction="addAction"></addbutton>
      </div>
    </div>
    <div class>
      <div class="stats-container mt-2">
        <!-- <SimpleAnalytics v-if="checkUserAccess('stats')" :analyticsData="dvirCheckListStats" :classs="'col'" /> -->
      </div>
      <div class="info-content-tab1">
        <div class="role-table" v-if="checkUserAccess('list')">
          <table-container
            class="table-collapse-type"
            :activeFunctions="{ dateFilter: true, keywordSearch: true }"
            :searchFilter="searchFilter"
            :dateFilter="doFilter"
          >
            <b-table
              show-empty
              responsive
              :items="dvirChecklistList"
              :tbody-tr-class="rowClass"
              :fields="fields"
              :current-page="currentPage"
              :per-page="perPage"
              :filter="filter"
              :filterIncludedFields="filterOn"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              :sort-direction="sortDirection"
              @filtered="onFiltered"
              :busy="dvirChecklistListLoader"
            >
              <template v-slot:cell(id)="row">
                <span @click="row.toggleDetails" class="action-toggle-detail">
                  {{ row.item.id }}
                </span>
              </template>
              <template v-slot:cell(effective_date)="{ item }">
                <div class="d-flex align-items-center">
                  <p>
                    <img
                      :src="require(`@/assets/images/calendar-sm.svg`)"
                      class="mr-1"
                      :alt="item.effective_date"
                    />
                  </p>
                  <p>
                    <span>{{ item.effective_date }}</span>
                  </p>
                </div>
              </template>
              <template v-slot:cell(createdBy)="row">
                <div v-if="row.item.createdBy && row.item.createdAt">
                  <p>
                    <img
                      v-if="row.item.createdByImage"
                      :src="row.item.createdByImage"
                      class="auth-img"
                      :alt="row.item.createdBy"
                    />
                    <span v-else class="initialletter">{{getNameIntials(row.item.createdBy)}}</span>
                  </p>
                  <p>
                    {{ row.item.createdBy }}
                    <span>{{ row.item.createdAt }}</span>
                  </p>
                </div>
              </template>
              <template v-slot:cell(language)="{ item }">
                <span v-if="item.language == 'en' || item.language == 'English'"> English </span>
                <span v-else> Arabic </span>
              </template>
              <template v-slot:cell(lastModified)="row">
                <div v-if="row.item.lastUpdatedBy && row.item.lastUpdatedAt">
                  <p>
                    <img
                      v-if="row.item.updatedByImage"
                      :src="row.item.updatedByImage"
                      class="auth-img"
                      :alt="row.item.lastUpdatedBy"
                    />
                    <span v-else class="initialletter">{{getNameIntials(row.item.lastUpdatedBy)}}</span>
                  </p>
                  <p>
                    {{ row.item.lastUpdatedBy }}
                    <span>{{ row.item.lastUpdatedAt }}</span>
                  </p>
                </div>
              </template>
              <template v-slot:cell(status)="{ item }">
                <span v-if="item.status" class="span-green">
                  <i class="innov-icon icon-active-record fnt-18 pr-1" /> Active
                </span>
                <span v-else class="span-red">
                  <i class="innov-icon icon-inactive-record fnt-18 pr-1" />
                  Inactive
                </span>
              </template>

              <template v-slot:cell(actions)="{ item }">
                <div
                  @click="actionOpen(item)"
                  :class="item.actions ? 'action-btn action-btn-active' : 'action-btn'"
                >
                  <i class="innov-icon icon-action-option" />
                </div>
                <div class="custom-wrapper-show" :class="{ show: item.actions }">
                  <ul class="table-actions-wrapper custom-table-actions-wrapper">
                    <li
                      v-for="(action, index) in rowActions"
                      :key="index"
                      @click="action.callback(item)"
                    >
                      <template v-if="item.status">
                        <i :class="'innov-icon icon-' + action.icon"></i>
                        <label>{{ action.title }}</label>
                      </template>
                      <template v-else>
                        <div v-if="action.title == 'Deactivate'">
                          <i :class="'innov-icon icon-active-record'"></i>
                          <label>{{ $t("active") }}</label>
                        </div>
                        <div v-else>
                          <i :class="'innov-icon icon-' + action.icon"></i>
                          <label>{{ $t(action.title) }}</label>
                        </div>
                      </template>
                    </li>
                  </ul>
                </div>
              </template>
              <template v-slot:table-busy>
                <div class="table-loader">
                  <content-loader
                    width="100"
                    height="30"
                    :speed="1"
                    primaryColor="#727272"
                    secondaryColor="#ecebeb"
                  >
                    <circle cx="76" cy="48" r="9" />
                    <circle cx="13" cy="18" r="10" />
                    <circle cx="49" cy="17" r="10" />
                    <circle cx="84" cy="16" r="10" />
                  </content-loader>
                </div>
              </template>
            </b-table>
            <div
              v-if="dvirChecklistTotal > perPage"
              class="admin-new-pagination role-table-pagination"
            >
              <b-pagination
                v-model="currentPage"
                :total-rows="dvirChecklistTotal"
                :per-page="perPage"
                align="fill"
                size="sm"
                class="my-0"
                @change="showPage"
              ></b-pagination>
            </div>
            <action-modal :modalIcon="modalIcon" :modalAction="modalAction">
              <!-- Todo: optimize later :) All Action Logic here -->
              <div v-if="modalScreen == 'msg'" class="action-confirmation action-popup-confirm">
                <h2>
                  {{ $t("deactivate_model_popup") }} {{ $t(modalAction) }}
                  {{ $t("this") }}
                </h2>
                <div class="modal-footer action-modal-footer">
                  <button @click="$bvModal.hide('action-modal')" class="btn site-grey-btn">
                    No
                  </button>
                  <button
                    @click="onDelete()"
                    :disabled="apiProcessing"
                    class="btn site-grey-btn site-primary-btn"
                    :class="'action-modal-btn-' + modalAction"
                  >
                    {{ apiProcessing ? "Processing..." : "Yes" }}
                  </button>
                </div>
              </div>
              <div v-if="modalScreen == 'otp'" class="action-pin-confirmation master-confirmation">
                <h2>Please enter Master PIN to proceed</h2>
                <form v-on:submit.prevent="validateOtpBeforeSubmit" autocomplete="off">
                  <div class="delete-popup-input">
                    <input type="text" v-model="pin.digit_1" class="form-control" maxlength="1" />
                    <input type="text" v-model="pin.digit_2" class="form-control" maxlength="1" />
                    <input type="text" v-model="pin.digit_3" class="form-control" maxlength="1" />
                    <input type="text" v-model="pin.digit_4" class="form-control" maxlength="1" />
                    <input type="text" v-model="pin.digit_5" class="form-control" maxlength="1" />
                    <input type="text" v-model="pin.digit_6" class="form-control" maxlength="1" />
                    <!-- Add invalid like msg -->
                    <div v-if="false" class="invalid-feedback">
                      Enter Pin First!
                    </div>
                  </div>
                  <div class="modal-footer action-modal-footer">
                    <input
                      type="button"
                      @click="$bvModal.hide('action-modal')"
                      class="btn site-grey-btn"
                      value="Cancel"
                    />
                    <button
                      type="submit"
                      :disabled="apiProcessing"
                      class="btn site-grey-btn site-primary-btn"
                    >
                      {{ apiProcessing ? "Processing..." : modalAction | capitalize }}
                    </button>
                  </div>
                  <p class="action-info">
                    We have shared a 6 digits PIN to your email
                    <strong>{{ userInfo.email }}</strong> and on your phone
                    <strong>{{ userInfo.phone }}</strong
                    >. Please enter the PIN to <strong>{{ modalAction }}</strong> this record.
                  </p>
                </form>
              </div>
            </action-modal>
          </table-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import addbutton from "@/components/ui/addbutton";
// import SimpleAnalytics from "@/components/SimpleAnalytics";

export default {
  name: "sa-dcm-dashboard",
  components: {
    addbutton,
    // SimpleAnalytics
  },
  props: {},
  data() {
    return {
      cust_range: ["01/09/2018", "01/10/2018"],
      cust_range_options: {
        timePicker: false,
        startDate: new Date(),
        endDate: new Date()
      },
      customRangeFlag: false,
      permission_list: "",
      breadcrumbs: [
        {
          title: this.$i18n.t("dashboard_name"),
          link: "super-admin-portal/dashboard",
          active: false
        },
        {
          title: this.$i18n.t("dvir.dvir_checklist"),
          link: "super-admin-portal/dvir-checklist-manager",
          active: true
        }
      ],
      fields: [
        { key: "id", label: this.$i18n.t("id"), sortable: true },
        {
          key: "name",
          label: this.$i18n.t("dvir.checklist_name"),
          sortable: false
        },
        {
          key: "effective_date",
          label: this.$i18n.t("dvir.effective_from"),
          sortable: true
        },
        {
          key: "createdBy",
          label: this.$i18n.t("created_by"),
          sortable: true,
          tdClass: "role-image-td"
        },
        {
          key: "language",
          label: this.$i18n.t("language"),
          sortable: true
        },
        {
          key: "lastModified",
          label: this.$i18n.t("last_modified"),
          sortable: true,
          tdClass: "role-image-td"
        },
        {
          key: "status",
          label: this.$i18n.t("status"),
          sortable: true
        },
        {
          key: "actions",
          label: this.$i18n.t("action"),
          tdClass: "",
          sortable: false
        }
      ],
      currentPage: 1,
      perPage: 10,
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      currentItem: "",
      rowActions: [
        {
          title: this.$i18n.t("profile"),
          icon: "profile",
          callback: this.actionProfile,
          action: "profile"
        },
        {
          title: this.$i18n.t("edit"),
          icon: "edit",
          callback: this.actionEdit,
          action: "edit"
        },
        {
          title: this.$i18n.t("deactivate"),
          icon: "deactivate",
          callback: this.actionDeactivate,
          action: "activate_deactivate"
        },
        {
          title: this.$i18n.t("log_history"),
          icon: "log-history",
          callback: this.actionLogHistory,
          action: "logs"
        },
        {
          title: this.$i18n.t("delete"),
          icon: "delete",
          callback: this.actionDelete,
          action: "delete"
        }
      ],
      modalAction: "", // delete | deactivate etc..
      modalScreen: "", // msg | otp
      modalIcon: "",
      apiProcessing: false,
      actionItem: "",
      pin: {
        digit_1: "",
        digit_2: "",
        digit_3: "",
        digit_4: "",
        digit_5: "",
        digit_6: ""
      },
      actionType: ""
    };
  },
  sockets: {
    // Disconnecting current socket
    disconnect() {
      console.log("Disconnect the real time socket in future!");
    }
  },
  mounted() {
    this.connect();
    this.emitGetDVIRChecklistStatsEvent();
    this.emitGetDVIRChecklistListEvent();
    this.$root.actionClose = () => {
      this.actionClose();
    };
    this.fetchUserAccess().then(() => {
      this.rowActions = this.rowActions.filter(item => this.checkUserAccess(item.action) === true);
    });
    this.$root.$on("analytics-update", this.updateAnalytics);
  },
  computed: {
    ...mapGetters({
      dvirCheckListStats: "saDVIRChecklistManager/getDVIRCheckListStats",
      dvirChecklistList: "saDVIRChecklistManager/getDVIRChecklistList",
      dvirChecklistListLoader: "saDVIRChecklistManager/dvirChecklistListLoader",
      dvirChecklistTotal: "saDVIRChecklistManager/getDvirChecklistTotal",
      userInfo: "saDVIRChecklistManager/getLoggedInUserInfo",
      language: "auth/getLanguage",
    }),
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
    }
  },
  watch: {
    dvirChecklistList: {
      // This will let Vue know to look inside the array
      deep: true,
      // We have to move our method to a handler field
      handler() {}
    },
    language() {
      this.fields = [
        { key: "id", label: this.$i18n.t("id"), sortable: true },
        {
          key: "name",
          label: this.$i18n.t("dvir.checklist_name"),
          sortable: false
        },
        {
          key: "effective_date",
          label: this.$i18n.t("dvir.effective_from"),
          sortable: true
        },
        {
          key: "createdBy",
          label: this.$i18n.t("created_by"),
          sortable: true,
          tdClass: "role-image-td"
        },
        {
          key: "language",
          label: this.$i18n.t("language"),
          sortable: true
        },
        {
          key: "lastModified",
          label: this.$i18n.t("last_modified"),
          sortable: true,
          tdClass: "role-image-td"
        },
        {
          key: "status",
          label: this.$i18n.t("status"),
          sortable: true
        },
        {
          key: "actions",
          label: this.$i18n.t("action"),
          tdClass: "",
          sortable: false
        }

      ];
      this.rowActions = [
        {
          title: this.$i18n.t("profile"),
          icon: "profile",
          callback: this.actionProfile,
          action: "profile"
        },
        {
          title: this.$i18n.t("edit"),
          icon: "edit",
          callback: this.actionEdit,
          action: "edit"
        },
        {
          title: this.$i18n.t("deactivate"),
          icon: "deactivate",
          callback: this.actionDeactivate,
          action: "activate_deactivate"
        },
        { 
          title: this.$i18n.t("log_history"),
          icon: "log-history",
          callback: this.actionLogHistory,
          action: "logs"
        },
        {
          title: this.$i18n.t("delete"),
          icon: "delete",
          callback: this.actionDelete,
          action: "delete"
        }

      ];
    }
  },
  methods: {
    ...mapActions({
      connect: "saDVIRChecklistManager/socketConnect",
      emitGetDVIRChecklistStatsEvent: "saDVIRChecklistManager/emitGetDVIRChecklistStatsEvent",
      emitGetDVIRChecklistListEvent: "saDVIRChecklistManager/emitGetDVIRChecklistListEvent",
      actionOnDVIRCheckListById: "saDVIRChecklistManager/actionOnDVIRCheckListById",
      verificationCode: "saDVIRChecklistManager/verificationCode",
      sendVerificationCode: "saDVIRChecklistManager/sendVerificationCode",
      fetchUserAccessPermission: "saDVIRChecklistManager/fetchUserAccessPermission",
    }),

    /**
     * @desc: For styling requirements
     * @param: item : Object, type: String
     * @return: String
     * */
    rowClass(item, type) {
      try {
        if (this.dvirChecklistList && this.dvirChecklistList.length > 0 && item) {
          const index = this.dvirChecklistList.findIndex(x => {
            return x.id === item.id;
          });
          if (type) {
            // because index start from 0 :)
            return index % 2 == 0 ? "row-odd" : "row-even";
          }
        }
      } catch (e) {
        console.log("Error @ row class ", e);
      }
    },

    /**
     * @desc: Table Action Open
     * @param: item: Object
     * @return: None
     * */
    actionOpen(item) {
      item.actions = !item.actions;
      console.log(item);
      this.$root.switchOverlay();
    },

    /**
     * @desc: Table Action Open
     * @param: None
     * @return: None
     * */
    actionClose() {
      this.dvirChecklistList.forEach(item => {
        item.actions = false;
      });
      this.$root.switchOverlay();
    },

    /**
     * @desc: Role List Filter
     * @param: filteredItems: Array
     * @return: None
     * */
    onFiltered(filteredItems) {
      console.log("onFiltered ", filteredItems);
      this.currentPage = 1;
      // let days = this.cust_range[2];
      // this.emitGetDVIRChecklistListEvent({
      //   search: this.filter ? this.filter : "",
      //   page: this.currentPage ? this.currentPage : 1,
      //   startDate: days ? this.cust_range[0] : "",
      //   endDate: days ? this.cust_range[1] : ""
      // });
    },

    searchFilter(keywords) {
      this.filter = keywords;
      let days = this.cust_range[2];
      this.emitGetDVIRChecklistListEvent({
        search: this.filter ? this.filter : "",
        page: this.currentPage ? this.currentPage : 1,
        startDate: days ? this.cust_range[0] : "",
        endDate: days ? this.cust_range[1] : ""
      });
    },

    /**
     * @desc: Show Page
     * @param: page
     * @return: None
     * */
    showPage(page) {
      this.currentPage = page;
      let days = this.cust_range[2];
      this.emitGetDVIRChecklistListEvent({
        search: this.filter ? this.filter : "",
        page: this.currentPage ? this.currentPage : 1,
        startDate: days ? this.cust_range[0] : "",
        endDate: days ? this.cust_range[1] : ""
      });
    },

    doFilter(event) {
      this.cust_range[0] = event[0];
      this.cust_range[1] = event[1];
      this.cust_range[2] = event[2];

      this.toDateFilter = this.cust_range[0];
      this.fromDateFilter = this.cust_range[1];
      let days = this.cust_range[2];

      this.emitGetDVIRChecklistListEvent({
        search: this.filter ? this.filter : "",
        page: this.currentPage ? this.currentPage : 1,
        startDate: days ? this.cust_range[0] : "",
        endDate: days ? this.cust_range[1] : ""
      });
    },

    /**
     * @desc: Action Profile
     * @param: item: Object
     * @return: None
     * */
    actionProfile(item) {
      this.actionClose();
      this.$router.push({
          path: "/super-admin-portal/dvir-checklist-manager/detail/" + item.id
      });
    },

    /**
     * @desc: Open Add New Role
     * @param: item: Object
     * @return: None
     * */
    actionEdit(item) {
      this.actionClose();
      this.$router.push({
          path: "/super-admin-portal/dvir-checklist-manager/edit/" + item.id
      });
    },

    /**
     * @desc: Action Deactive
     * @param: item: Object
     * @return: None
     * */
    actionDeactivate(item) {
      this.actionClose();
      this.currentItem = item;
      this.actionItem = item;
      this.modalAction = item.status ? "deactivate" : "activate";
      this.modalScreen = "msg";
      this.modalIcon = item.status ? "deactivate" : "active-record";
        // Load Data if any
      this.$root.$emit("bv::show::modal", "action-modal", "#action-modal");
    },

     /**
     * @desc: Action Log History
     * @param: item: Object
     * @return: None
     * */
    actionLogHistory(item) {
      this.actionClose();
      this.$router.push({
        path: "/super-admin-portal/dvir-checklist-manager/detail/" + item.id + "/log-history"
      });
    },

    /**
     * @desc: Action Delete
     * @param: None
     * @return: None
     * */
    actionDelete(item) {
      this.actionClose();
      this.modalAction = "delete";
      this.modalScreen = "msg";
      this.modalIcon = "delete";
      this.actionItem = item;
      this.currentItem = item;
      this.actionType = "delete";
      // Load Data if any
      this.$root.$emit("bv::show::modal", "action-modal", "#action-modal");
    },

    /**
     * @desc: Add Action
     * @param: None
     * @return: None
     * */
    addAction() {
      this.$router.push({ path: "/super-admin-portal/dvir-checklist-manager/add" });
    },

    /**
     * @desc: Delete Role Action
     * @param: row: Object
     * @return: None
     * */
    onDelete() {
      this.apiProcessing = true;
      if (this.modalAction == "delete") {
        this.sendVerificationCode({
          module: "dvir"
        })
          .then(response => {
            if (response.statusCode == 200) {
              this.apiProcessing = false;
              // Send OTP on email || phone Code here
              this.modalScreen = "otp";
              this.$notify({
                group: "notify-portal",
                type: "success",
                title: "Information",
                text: "6 digits PIN send successfully."
              });
            }
          })
          .catch(error => {
            this.$notify({
              group: "notify-portal",
              type: "error",
              title: "Information",
              text: error
            });
          });
      } else {
        this.actionOnItem();
      }
    },

    validateOtpBeforeSubmit() {
      this.onOTPConfirm();
    },

    onOTPConfirm() {
      let fullCode = this.pin.digit_1
        .concat(this.pin.digit_2)
        .concat(this.pin.digit_3)
        .concat(this.pin.digit_4)
        .concat(this.pin.digit_5)
        .concat(this.pin.digit_6);
      const payload = {
        code: fullCode
      };
      this.apiProcessing = true;
      this.verificationCode(payload)
        .then(response => {
          if (response && response.statusCode == 200) {
            this.actionOnItem();
          } else {
            this.apiProcessing = false;
            this.$notify({
              group: "notify-portal",
              type: "error",
              title: "Information",
              text: response.message
            });
          }
        })
        .catch(error => {
          this.apiProcessing = false;
          this.$notify({
            group: "notify-portal",
            type: "error",
            title: "Information",
            text: error
          });
        });
    },

    actionOnItem() {
      this.actionOnDVIRCheckListById({
        id: this.currentItem.id,
        action: this.modalAction
      })
        .then(response => {
          this.apiProcessing = false;
          if (response.statusCode == 200) {
            this.emitGetDVIRChecklistStatsEvent();
            this.emitGetDVIRChecklistListEvent();
            this.apiProcessing = false;
            this.$notify({
              group: "notify-portal",
              type: "success",
              title: "Information",
              text: "Action completed successfully."
            });
            this.resetPin();
            this.$root.$emit("bv::hide::modal", "action-modal", "#action-modal");
          } else {
            this.$notify({
              group: "notify-portal",
              type: "error",
              title: "Information",
              text: response.message
            });
          }
        })
        .catch(error => {
          this.apiProcessing = false;
          this.$notify({
            group: "notify-portal",
            type: "error",
            title: "Information",
            text: error
          });
        });
    },
    /**
     * Update analytics
     *
     * @param status
     */
    updateAnalytics(status) {
      let days = this.cust_range[2];
      this.emitGetDVIRChecklistListEvent({
        search: this.filter ? this.filter : "",
        page: this.currentPage ? this.currentPage : 1,
        startDate: days ? this.cust_range[0] : "",
        endDate: days ? this.cust_range[1] : "",
        status: this.getAnalyticsStatus(status)
      });
    },
    /**
     * Fetch analytics status value
     *
     * @param status
     * @returns {string|number}
     */
    getAnalyticsStatus(status) {
      if (status && status.type == "active") {
        return "1";
      } else if (status && status.type == "inactive") {
        return "0";
      } else {
        return "";
      }
    },
    checkUserAccess(permission) {
      let isPermitted = false;
      if (
        this.permission_list &&
        permission &&
        this.permission_list.toLowerCase().indexOf(permission.toLowerCase()) > -1
      ) {
        isPermitted = true;
      }
      return isPermitted;
    },

    async fetchUserAccess() {
      if (this.userInfo && this.userInfo.id) {
        let userAccessPermission = await this.fetchUserAccessPermission(this.userInfo.id);
        let module_code = "dvir_management";
        try {
          if (userAccessPermission && userAccessPermission.length > 0) {
            userAccessPermission = JSON.parse(userAccessPermission);
            userAccessPermission.forEach(item => {
              if (item.code.toLowerCase() == module_code.toLowerCase()) {
                this.permission_list = item.feature;
              }
            });
          }
        } catch (ex) {
          console.log(ex);
        } finally {
          console.log("this.permission_list ", this.permission_list);
        }
      }
    },
    getNameIntials(name){
      return name.split(' ').map(x => x.charAt(0)).join('').substr(0, 2).toUpperCase();
    },
    resetPin(){
      this.pin.digit_1 = "";
      this.pin.digit_2 = "";
      this.pin.digit_3 = "";
      this.pin.digit_4 = "";
      this.pin.digit_5 = "";
      this.pin.digit_6 = "";
    },
  }
};
</script>
<style lang="scss" scoped>
.role-image-td div {
  display: flex;
  cursor: pointer;
}
.table-loader {
  width: 50px;
  margin: 0px auto;
}
.icon-document:before,
.icon-nav-taxi-driver:before {
  color: #2abed5;
}
.border-box-main {
  .border-box-outer {
    width: 23%;
  }
  .border-box-outer.border-box-last {
    width: 31%;
  }
}
.profile-section {
  display: flex;
  img {
    margin: 0 10px 0 0;
  }
}
</style>

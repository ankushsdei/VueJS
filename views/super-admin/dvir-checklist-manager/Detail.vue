<template>
  <div class="admin-account-list w-100">
    <div class="d-flex page-action-header justify-content-between">
      <breadcrumb :breadcrumbs="breadcrumbs" />
    </div>
    <div class>
      <div class="row">
        <div class="col-sm-12 col-md-3" :class="isProfileEdit ? 'detail-info' : ''">
          <action-card
            title="basic_information"
            :cardActions="profileActions"
            v-if="!isProfileEdit"
          >
            <div class="w-100">
              <div class="fill-info">
                <div class="view-data">
                  <label>{{ $t("name") }}</label>
                  <p>{{ dvirChecklistInfo.name }}</p>
                </div>
                <div class="view-data">
                   <label>{{ $t("language") }}</label>
                  <p>
                    {{ dvirChecklistInfo.lang.value}}
                    <!-- {{ dvirChecklistInfo.lang.id == "en" ? "English" : "Arabic" }} -->
                  </p>
                </div>
                <div class="view-data">
                  <label>{{ $t("effective_date") }}</label>
                  <p>
                    {{ dvirChecklistInfo["effective_date"] | moment("DD/MM/YYYY") }}
                  </p>
                </div>
              </div>
            </div>
          </action-card>

          <action-card
            title="Basic Information"
            :cardActions="updateProfileActions"
            v-if="isProfileEdit"
          >
            <div class="fill-info">
              <form>
                <div class="col-12">
                  <div class="row mt-3">
                    <div class="col-xl-12 col-sm-12 text-left responsive-main-space">
                      <label>{{ $t("name") }}</label>
                      <div class="custom-input">
                        <input
                          type="text"
                          class="form-control"
                          :placeholder="$t('admin_portal.enter_name_here')"
                          v-model="dvirChecklistInfo.name"
                          v-validate="'required'"
                          name="templateName"
                          ref="templateName"
                          :class="{ 'is-invalid': errors.has('templateName') }"
                          autocomplete="off"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col-xl-12 col-sm-12 text-left responsive-main-space">
                      <label>{{ $t("language") }}</label>
                      <multiselect
                        v-model="dvirChecklistInfo.lang"
                        :placeholder="$t('select_language')"
                        label="Language"
                        track-by="id"
                        :options="languages"
                        :searchable="false"
                        :show-labels="false"
                        v-validate="'required'"
                        v-bind:name="'languages'"
                        v-bind:ref="'languages'"
                        class="drop-multiselect-auth-img"
                        :class="{ 'is-invalid': errors.has('languages') }"
                      >
                        <template slot="singleLabel" slot-scope="props">
                          <span class="option__desc">
                            <span class="option__title">{{ props.option.value | capitalize }}</span>
                          </span>
                        </template>
                        <template slot="option" slot-scope="props">
                          <div class="option-wrapper">
                            <span class="option__title">{{ props.option.value | capitalize }}</span>
                          </div>
                        </template>
                      </multiselect>
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col-xl-12 col-sm-12 text-left responsive-main-space">
                      <label>{{ $t("effective_date") }}</label>
                      <datepicker
                        v-model="dvirChecklistInfo.effective_date"
                        class="custom-input"
                        name="effective_date"
                        ref="effective_date"
                        format="dd/MM/yyyy"
                        :class="{ 'is-invalid': errors.has('effective_date') }"
                        autocomplete="off"
                      ></datepicker>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </action-card>

            <collapse-card :initAction="otherAction">
            <div class="m-1">
              <label class="mb-1 text-muted">Created by</label>
              <div class="row">
                <div
                  class="col-8 mb-2 pb-0"
                  v-if="dvirChecklistInfo.created_by && dvirChecklistInfo.created_by.email"
                >
                  <ProfileChip
                    :image="dvirChecklistInfo.createdByImage"
                    :name="dvirChecklistInfo.createdByName"
                    :email="dvirChecklistInfo.createdByEmail"
                    :phone="dvirChecklistInfo.createdByPhone"
                  />
                </div>
                <div class="col-4 mb-2 pb-0 text-right">
                  <!-- <label class="text-muted">Date Created</label> -->
                  <div>{{ dvirChecklistInfo.createdAt }}</div>
                  <div>{{ dvirChecklistInfo.createdTime }}</div>
                </div>
              </div>
              <div class="mt-3"  v-if="dvirChecklistInfo.updated_by">
                <label class="mb-1 text-muted">Modified by</label>
                <div class="row">
                  <div
                    class="col-8 mb-2 pb-0"
                    v-if="dvirChecklistInfo.modifiedByName && dvirChecklistInfo.modifiedByEmail"
                  >
                    <ProfileChip
                      :image="dvirChecklistInfo.modifiedByImage"
                      :name="dvirChecklistInfo.modifiedByName"
                      :email="dvirChecklistInfo.modifiedByEmail"
                      :phone="dvirChecklistInfo.modifiedByPhone"
                    />
                  </div>
                  <div class="col-4 mb-2 pb-0 text-right">
                    <!-- <label class="text-muted">Last Updated</label> -->
                    <div>{{ dvirChecklistInfo.updatedAt }}</div>
                    <div>{{ dvirChecklistInfo.updatedTime }}</div>
                  </div>
                </div>
              </div>
            </div>
          </collapse-card>
        </div>
        <div class="col-md-9 col-sm-12 pl-sm-0 for-responsive-left email-left-panel">
          <div class="added-info">
            <div class="row flex-column m-0 box-container">
              <OuterTab :headerMenu="headerMenu">
                <router-view></router-view>
              </OuterTab>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import OuterTab from "@/components/super-admin/TabStyle1";
import { mapActions, mapGetters } from "vuex";
import Datepicker from "vuejs-datepicker";

export default {
  components: {
    OuterTab,
    Datepicker
  },
  data() {
    return {
      disabledDates: {
        from: new Date(),
        to: new Date(1900, 0, 1)
      },
      breadcrumbs: [
        {
          title: "dashboard_name",
          link: "super-admin-portal/dashboard",
          active: false
        },
        {
          title: "DVIR Checklist Manager",
          link: "super-admin-portal/dvir-checklist-manager",
          active: true
        },
        {
          title: "view_profile",
          link: "super-admin-portal/dvir-checklist-manager",
          active: false
        }
      ],
      headerMenu: [
        {
          title: "dvir.dvir_detail",
          icon: "template-details",
          componentRouter: "sa-dcm-admin-detail-dashboard",
          active: true,
          callBack: this.openTabSection,
          action: "profile"
        },
        {
          title: "log_history",
          icon: "log-history",
          componentRouter: "sa-dcm-admin-log-detail-history",
          active: false,
          callBack: this.openTabSection,
          action: "logs"
        }
      ],
      componentRouter: "tp-etm-admin-detail-dashboard",
      profileActions: [
        {
          title: "Edit",
          icon: "pencil",
          iconLib: true,
          active: true,
          callBack: this.editProfile,
          action: 'edit'
        }
      ],
      updateProfileActions: [
        {
          title: "Save",
          icon: "floppy-o",
          iconLib: true,
          active: true,
          callBack: this.saveProfile
        }
      ],
      companyAction: {
        title: "Company Information",
        icon: "arrow-gray.png"
      },
      otherAction: {
        title: "Other Information",
        icon: "arrow-gray.png"
      },
      dvirCheckListId: "",
      isProfileEdit: false,
      permission_list: ""
    };
  },
  created() {
    // active current tab according to router
    let routerName = this.$route.meta.baseRouter[0];
    this.componentRouter = routerName;
    this.openTabSection(routerName);
    this.dvirCheckListId = this.$route.params.id;
    this.checklistById(this.$route.params.id);
  },
  mounted(){
    this.fetchUserAccess().then(() => {
      this.headerMenu = this.headerMenu.filter(item => this.checkUserAccess(item.action) === true);
      this.profileActions = this.profileActions.filter(item => this.checkUserAccess(item.action) === true);
    });
  },
  computed: {
    ...mapGetters({
      dvirChecklistInfo: "saDVIRChecklistManager/getDVIRCheckListInfo",
      languages: "saDVIRChecklistManager/getLanguages",
      templateForList: "saDVIRChecklistManager/getTemplateForList",
      userInfo: "saDVIRChecklistManager/getLoggedInUserInfo"
    })
  },
  methods: {
    ...mapActions({
      checklistById: "saDVIRChecklistManager/getChecklistById",
      updateEmailTemplateObject: "saDVIRChecklistManager/updateEmailTemplateObject",
      createDvirChecklist: "saDVIRChecklistManager/createDvirChecklist",
      fetchUserAccessPermission: "saDVIRChecklistManager/fetchUserAccessPermission",
    }),

    /**
     * Edit Profile
     */
    editProfile() {
      this.isProfileEdit = true;
    },
    /**
     * Save Profile
     */
    async saveProfile() {
      let result = this.$validator.validateAll();
      if (result) {
        try {
          this.processing = true;
          let data = {
            name: this.dvirChecklistInfo.name,
            lang: this.dvirChecklistInfo.lang ? this.dvirChecklistInfo.lang.value : "",
            // lang: this.dvirChecklistInfo.lang.id,
            effective_date: this.dvirChecklistInfo.effective_date
            // id: this.dvirChecklistInfo.id
          };
          let response = await this.createDvirChecklist({ body: data, id: this.$route.params.id });
          if (response && response.statusCode == 200) {
            this.isProfileEdit = false;
            this.$notify({
              group: "notify-portal",
              type: "success",
              title: "Information",
              text: "DVIR Checklist Updated Successfully."
            });
            this.checklistById(this.$route.params.id);
          } else {
            this.$notify({
              group: "notify-portal",
              type: "error",
              title: "Information",
              text: "Some error occurred. Please try again."
            });
          }
        } catch (error) {
          console.log(error);
          this.$notify({
            group: "notify-portal",
            type: "error",
            title: "Information",
            text: "Some error occurred. Please try again."
          });
        } finally {
          this.processing = false;
        }
      }
    },

    /**
     * Open Tab Section
     * @param customRoute
     */
    openTabSection(customRoute) {
      console.log(customRoute);
      /**
       * Todo: When Call API then load when received init data
       * code data loader as well
       */
      this.headerMenu.forEach(menu => {
        menu.active = menu.componentRouter == customRoute ? true : false;
      });

      if (this.componentRouter != customRoute) {
        // Get Tab push router componentRouter Load
        this.componentRouter = customRoute;
        this.$router.push({ name: customRoute });
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
          console.log(this.permission_list);
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.form-container {
}

.innov-icon {
  font-size: 20px !important;
}

.profile-info {
  .box-container {
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

    .head {
      background: #f0f7fc;
      padding: 20px;
      color: #4d4f5c;
      font-size: 14px;
      font-weight: 600;
      border-bottom: 1px solid #e4ebf7;
      box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.04);
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 69px;

      .edit-icon {
        background: #fff;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid #e4ebf7;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
  }

  .fill-info {
    padding: 20px 5px;
    color: #808080;
    background: #fff;

    .gender-bar {
      display: flex;
      border-radius: 4px;
      overflow: hidden;
      background: #ebebeb;

      .gender-option {
        flex: 0 0 50%;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          margin-right: 8px;
        }

        &.active {
          background: #2abed5;
          color: #fff;
        }
      }
    }
  }

  .steps-bar {
    ul {
      li {
        border: none;
        background: none;
        position: relative;
        flex-grow: 1;
        display: flex;
        padding: 0;

        a {
          color: #a1a0ae;
          display: flex;
          flex-direction: column;
          font-size: 12px;
          align-items: center;
          z-index: 2;

          &:hover {
            text-decoration: none;
          }

          .icon {
            background: #ebebeb;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 6px;
          }
        }

        &.active {
          a {
            color: #4d4f5c;
            display: flex;
            flex-direction: column;
            font-size: 12px;

            .icon {
              background: #623cea;
              width: 38px;
              height: 38px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          &:before {
            background: #b09df4;
          }
        }

        &.done {
          &:before {
            background: #623cea;
          }

          a {
            color: #4d4f5c;
            display: flex;
            flex-direction: column;
            font-size: 12px;

            .icon {
              background: #623cea;
              width: 38px;
              height: 38px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }

        &:last-child {
          flex-grow: 0;

          &:before {
            display: none;
          }
        }

        &:before {
          content: "";
          position: absolute;
          width: 100%;
          left: 35px;
          top: 18px;
          height: 4px;
          background: #ebebeb;
        }
      }
    }
  }
}
.submenu-item {
  li {
    padding-top: 2px;
    color: rgb(92, 200, 219);
  }
}
.second-item-list {
  display: flex;
  justify-content: flex-end;
}
</style>

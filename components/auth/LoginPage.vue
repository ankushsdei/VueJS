<template>
  <div class="login-container">
    <div class="container">
      <div class="row login-inner-con">
        <div class="col-lg-5 col-md-6 login-background">
          <div class="row mt-2">
            <div class="col text-center">
              <h1>Innovent - {{ $t("login") }}</h1>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col">
              <div class="d-flex align-items-center">
                <div class="dropdown login-multiselect">
                  <label for="language">{{ $t("select_language") }}</label>
                  <multiselect
                    v-model="language"
                    placeholder="Choose Language"
                    label="title"
                    track-by="code"
                    id="language"
                    class="language-multiselect"
                    :options="languages"
                    :show-labels="false"
                    :searchable="false"
                    :hideSelected="true"
                    @select="changeLanguage"
                  >
                    <template slot="singleLabel" slot-scope="props">
                      <i :class="'flag-icon flag-icon-' + props.option.icon" />
                      <span class="option__desc">
                        <span class="option__title">{{ $t(props.option.name.toLowerCase()) }}</span>
                      </span>
                    </template>
                    <template slot="option" slot-scope="props">
                      <div class="option-wrapper">
                        <i :class="'flag-icon flag-icon-' + props.option.icon" />
                        <span class="option__title" style="padding-left: 15px;">
                          {{ $t(props.option.name.toLowerCase()) }}
                        </span>
                      </div>
                    </template>
                  </multiselect>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col">
              <label for="portal">{{ $t("select_module") }}</label>
              <select
                type="text"
                id="portal"
                v-model="portal"
                name="portal"
                class="form-control"
                @change="updateLoginInfo"
              >
                <option :value="'super-admin-portal'">Super Admin</option>
                <option :value="'admin-portal'">Admin</option>
                <option :value="'tpc-portal'">Transport Companies</option>
              </select>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col">
              <label for="email">{{ $t("email") }}</label>
              <input
                type="text"
                id="email"
                v-model="email"
                name="email"
                class="form-control"
                :ref="'email'"
                v-validate="'required|email'"
                autocomplete="off"
                :class="{ 'is-invalid': (submitted && !email) || errors.has('email') }"
              />
              <div v-show="(submitted && !email) || errors.has('email')" class="invalid-feedback">
                {{ $t("email_required") }}
              </div>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col">
              <label for="password">{{ $t("password") }}</label>
              <input
                type="password"
                v-model="password"
                name="password"
                id="password"
                class="form-control"
                v-validate="'required'"
                :ref="'password'"
                autocomplete="off"
                :class="{ 'is-invalid': (submitted && !password) || errors.has('password') }"
                @keyup.enter="visitPlatform"
              />
              <div
                v-show="(submitted && !password) || errors.has('password')"
                class="invalid-feedback"
              >
                {{ $t("password_required") }}
              </div>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col text-right login-section-btn">
              <router-link to="/forgot-password" class="btn btn-link">
                {{ $t("forgot_password") }}
              </router-link>
              <b-button
                variant="primary"
                :disabled="loading"
                @click="visitPlatform"
                style="width: 150px;"
              >
                <img
                  v-if="loading"
                  src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
                />
                <span v-else>{{ $t("login") }}</span>
              </b-button>
            </div>
          </div>
        </div>
        <div>
          <button
            v-shortkey="['f8']"
            @shortkey="autoFill()"
            class="btn btn-primary"
            style="display: none"
          >
            Open
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import i18next from "i18next";
export default {
  name: "login",
  data() {
    return {
      email: "", // samit@smartdatainc.net
      password: "", // 12345678
      portal: "super-admin-portal",
      submitted: false,
      loading: false,
      language: {
        name: "English",
        code: "en",
        icon: "gb"
      },
      languages: [
        {
          name: "English",
          code: "en",
          icon: "gb"
        },
        {
          name: "Arabic",
          code: "ar",
          icon: "ar"
        }
      ],
      // TODO: check to moving portal names as constants throughout
      allPortals: {
        superAdminPortal: "innov-superadmin",
        adminPortal: "innov-admin",
        tpcPortal: "innov-tpc"
      }
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.updateLoginInfo();
  },
  methods: {
    ...mapActions({
      login: "auth/login",
      updateLanguage: "auth/updateLanguage"
    }),

    autoFill() {
      if (this.portal == "super-admin-portal") {
        this.email = "samit@yopmail.com";
        this.password = "12345678";
      } else if (this.portal == "admin-portal") {
        this.email = "samit.sdei@gmail.com";
        this.password = "12345678";
      } else {
        console.log("set to tpc");
        this.email = "samit.sdei@gmail.com";
        this.password = "12345678";
      }
    },

    removePortalInfo(portals) {
      for (let portal of portals) {
        if (localStorage.getItem(portal)) localStorage.removeItem(portal);
      }
    },

    /**
     * Change Language
     */
    changeLanguage(event) {
      i18next.changeLanguage(event.code);
      this.updateLanguage(event.code);
      // this.$i18n.i18next.changeLanguage(this.language.code);
    },

    /**
     * Update Login Info
     */
    updateLoginInfo() {
      console.log("updateLoginInfo ", this.portal);
      let localSession = {
        theme: "",
        userInfo: "",
        token: ""
      };
      console.log("updateLoginInfo portal " + this.portal);
      if (this.portal == "super-admin-portal") {
        console.log("set to super-admin");
        localSession.theme = "pro-theme";
        localStorage.setItem("innov-superadmin", JSON.stringify(localSession));
        this.email = ""; // samit@yopmail.com
        this.password = ""; // 12345678
        this.removePortalInfo([this.allPortals.adminPortal, this.allPortals.tpcPortal]);
      } else if (this.portal == "admin-portal") {
        console.log("set to admin");
        localSession.theme = "light-theme";
        localStorage.setItem("innov-admin", JSON.stringify(localSession));
        this.email = ""; // samit.sdei@gmail.com
        this.password = ""; // 12345678
        this.removePortalInfo([this.allPortals.superAdminPortal, this.allPortals.tpcPortal]);
      } else {
        console.log("set to tpc");
        localSession.theme = "dark-theme";
        localStorage.setItem("innov-tpc", JSON.stringify(localSession));
        this.email = ""; // samit.sdei@gmail.com
        this.password = ""; // 12345678
        this.removePortalInfo([this.allPortals.superAdminPortal, this.allPortals.adminPortal]);
      }
    },

    /**
     * Visit Platform
     * @returns {Promise<void>}
     */
    async visitPlatform() {
      let result = await this.$validator.validateAll();
      if (result) {
        this.submitted = true;
        this.loading = true;
        setTimeout(async () => {
          const payload = {
            email: this.email,
            password: this.password,
            portal:
              this.portal == "super-admin-portal"
                ? "superadmin"
                : this.portal == "admin-portal"
                ? "admin"
                : "tpc",
            id: ""
          };
          this.login(payload)
            .then(resp => {
              console.log("resp", resp);
              let response = "";
              if (!resp.statusCode) {
                response = resp.data;
              } else {
                response = resp;
              }
              if (response.statusCode == 200) {
                this.$notify({
                  group: "notify-portal",
                  type: "success",
                  title: "Information",
                  text: response.message
                });
                window.location.href = "/" + this.portal + "/dashboard";
              } 
              else if (response.statusCode == 400) {
                this.$notify({
                  group: "notify-portal",
                  type: "error",
                  title: "Information",
                  text: response.message
                });
              } 
              else {
                this.$notify({
                  group: "notify-portal",
                  type: "error",
                  title: "Information",
                  text: response.message
                });
              }
              this.loading = false;
            })
            .catch(error => {
              this.$notify({
                group: "notify-portal",
                type: "error",
                title: "Information",
                text: error
              });
              this.loading = false;
            });
        }, 1500);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/*.multiselect__select {*/
/*  width: 220px !important;*/
/*}*/
/*.multiselect__tags {*/
/*  width: 210px;*/
/*}*/
</style>

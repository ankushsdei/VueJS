<template>
  <div class="login-container">
    <div class="container">
      <div class="row login-inner-con">
        <div class="col-lg-5 col-md-6 login-background">
          <div class="row mt-2">
            <div class="col text-center">
              <h1>Innovent - {{ $t("reset_password") }}</h1>
            </div>
          </div>
          <div class="row mt-4">
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
              />
              <div
                v-show="(submitted && !password) || errors.has('password')"
                class="invalid-feedback"
              >
                {{ $t("password_required") }}
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col">
              <label for="confPassword">{{ $t("confirm_password") }}</label>
              <input
                type="password"
                v-model="confPassword"
                name="confPassword"
                id="confPassword"
                class="form-control"
                v-validate="'required|confirmed:password'"
                :ref="'confPassword'"
                autocomplete="off"
                data-vv-as="password"
                :class="{
                  'is-invalid': (submitted && !confPassword) || errors.has('confPassword')
                }"
              />
              <div
                v-show="(submitted && !confPassword) || errors.has('confPassword')"
                class="invalid-feedback"
              >
                {{ $t("conf_password_required") }}
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col text-right login-section-btn">
              <b-button
                variant="primary"
                :disabled="loading"
                @click="updatePassword"
                style="width: 150px;"
              >
                <span>{{ $t("update") }}</span>
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "reset-password",
  data() {
    return {
      portal: "",
      key: "",
      password: "",
      confPassword: "",
      email: "",
      submitted: false,
      loading: false,
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
    this.portal = this.getPortal();
    this.removePortalInfo([
      this.allPortals.superAdminPortal,
      this.allPortals.tpcPortal,
      this.allPortals.adminPortal
    ]);
    if ("key" in this.$route.query) {
      this.key = this.$route.query.key;
    }
  },
  methods: {
    ...mapActions({
      resetPassword: "auth/resetPassword",
      login: "auth/login"
    }),
    removePortalInfo(portals) {
      for (let portal of portals) {
        if (localStorage.getItem(portal)) localStorage.removeItem(portal);
      }
    },

    /**
     * Update password
     * @returns {Promise<void>}
     */
    async updatePassword() {
      let result = await this.$validator.validateAll();
      if (result) {
        this.submitted = true;
        this.loading = true;
        setTimeout(async () => {
          const payload = {
            token: this.key,
            password: this.password,
            confirm_password: this.confPassword
          };
          this.resetPassword(payload)
            .then(response => {
              console.log(response)
              if (response.statusCode == 200) {
                this.email = response.message.email;
                this.$notify({
                  group: "notify-portal",
                  type: "success",
                  title: "Information",
                  text: "Password has been updated successfully!"
                });
                this.updateLoginInfo();
                const payload = {
                  email: this.email,
                  password: this.password,
                  portal: this.portal
                };
                this.login(payload)
                  .then(resp => {
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
                    let portal = this.portal == "superadmin"
                      ? "super-admin-portal"
                      : this.portal == "admin"
                      ? "admin-portal"
                      : "tpc-portal";
                      window.location.href = "/" + portal + "/dashboard";
                    } else {
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

                // this.login(payload).then((res) => {
                //   console.log(res);
                //   if(res.statusCode == 400){

                //   }
                //   else{
                //   let portal =
                //     this.portal == "superadmin"
                //       ? "super-admin-portal"
                //       : this.portal == "admin"
                //       ? "admin-portal"
                //       : "tpc-portal";
                //       console.log(portal)
                //   window.location.href = "/" + portal + "/dashboard";
                //   }
                // });
              } else {
                this.$notify({
                  group: "notify-portal",
                  type: "error",
                  title: "Information",
                  text: "Please try again"
                });
              }
              this.loading = false;
            })
            .catch(error => {
              this.$notify({
                group: "notify-portal",
                type: "error",
                title: "Information",
                text: "Please try again"
              });
              console.log("error", error);
              this.loading = false;
            });
        }, 1500);
      }
    },
    /**
     * Get current portal
     *
     * @returns {string}
     */
    getPortal() {
      let portal = "";
      if (this.$route.name == "a-reset-password") {
        portal = "admin";
      } else if (this.$route.name == "tpc-reset-password") {
        portal = "tpc";
      } else {
        portal = "superadmin";
      }
      return portal;
    },
    /**
     * Update Login Info
     */
    updateLoginInfo() {
      let localSession = {
        theme: "",
        userInfo: "",
        token: ""
      };
      console.log("updateLoginInfo portal " + this.portal);
      if (this.portal == "superadmin") {
        console.log("set to super-admin");
        localSession.theme = "pro-theme";
        localStorage.setItem("innov-superadmin", JSON.stringify(localSession));
        this.removePortalInfo([this.allPortals.adminPortal, this.allPortals.tpcPortal]);
      } else if (this.portal == "admin") {
        console.log("set to admin");
        localSession.theme = "light-theme";
        localStorage.setItem("innov-admin", JSON.stringify(localSession));
        this.removePortalInfo([this.allPortals.superAdminPortal, this.allPortals.tpcPortal]);
      } else {
        console.log("set to tpc");
        localSession.theme = "dark-theme";
        localStorage.setItem("innov-tpc", JSON.stringify(localSession));
        this.removePortalInfo([this.allPortals.superAdminPortal, this.allPortals.adminPortal]);
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>

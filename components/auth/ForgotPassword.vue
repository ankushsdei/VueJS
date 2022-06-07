<template>
  <div class="login-container">
    <div class="container">
      <div class="row login-inner-con">
        <div class="col-lg-5 col-md-6 login-background">
          <div class="row mt-2">
            <div class="col text-center">
              <h1>Innovent - {{ $t("forgot_password") }}</h1>
            </div>
          </div>
          <div class="row mt-4">
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
                        <span class="option__title" style="padding-left: 15px;">{{
                          $t(props.option.name.toLowerCase())
                        }}</span>
                      </div>
                    </template>
                  </multiselect>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col">
              <label for="portal">{{ $t("select_module") }}</label>
              <select type="text" id="portal" v-model="portal" name="portal" class="form-control">
                <option :value="'super-admin-portal'">Super Admin Module</option>
                <option :value="'admin-portal'">Admin Module</option>
                <option :value="'tpc-portal'">TPC Module</option>
              </select>
            </div>
          </div>
          <div class="row mt-4">
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
                @keyup.enter="visitPlatform()"
                :class="{ 'is-invalid': (submitted && !email) || errors.has('email') }"
              />
              <div v-show="(submitted && !email) || errors.has('email')" class="invalid-feedback">
                {{ $t("email_required") }}
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col text-right login-section-btn">
              <router-link to="/login" class="btn btn-link">{{ $t("login") }}</router-link>
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
                <span v-else>{{ $t("send_email") }}</span>
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
import i18next from "i18next";

export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "", // samit@smartdatainc.net, samit@yopmail.com
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
      ]
    };
  },
  computed: {},
  created() {},
  methods: {
    ...mapActions({
      forgotPassword: "auth/forgotPassword"
    }),

    /**
     * Change Language
     */
    changeLanguage(event) {
      i18next.changeLanguage(event.code);
      // this.$i18n.i18next.changeLanguage(this.language.code);
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
        const payload = {
          email: this.email,
          portal:
            this.portal == "super-admin-portal"
              ? "superadmin"
              : this.portal == "admin-portal"
              ? "admin"
              : "tpc"
        };
        this.forgotPassword(payload)
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
              this.$router.push("/login");
            } else {
              this.$notify({
                group: "notify-portal",
                type: "info",
                title: "Information",
                text: response.message
              });
            }
            this.loading = false;
          })
          .catch(error => {
            console.log(error);
            this.$notify({
              group: "notify-portal",
              type: "info",
              title: "Information",
              text: "Some error occurred. Please try again"
            });
            this.loading = false;
          });
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>

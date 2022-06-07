<template>
  <div class="home">
    <b-jumbotron class="text-center" style="background-color: #e9ecef00;">
      <template v-slot:header>Innovent</template>
      <hr class="my-4" />
      <div class="text-center">
        <b-button
          @click="visitPlatform('super-admin-portal')"
          variant="primary"
          :disabled="loading"
          class="m-2"
          href="#"
          >Super Admin Portal</b-button
        >
        <b-button
          @click="visitPlatform('admin-portal')"
          variant="success"
          class="m-2"
          :disabled="loading"
          href="#"
          >Admin Portal</b-button
        >
        <b-button
          @click="visitPlatform('tpc-portal')"
          variant="warning"
          class="m-2"
          :disabled="loading"
          href="#"
          >Company Portal</b-button
        >
        <p>When you click on above action button its load the platform accordingly.</p>

        <h4 v-if="loading" class="mt-4">Processing....</h4>
      </div>
    </b-jumbotron>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "site-home",
  data() {
    return {
      loading: false
    };
  },
  beforeRouteEnter(to, from, next) {
    // let localCheck = localStorage.getItem("token");
    // let themeChecker = localStorage.getItem("theme");
    // if (localCheck) {
    //   if (themeChecker == "pro-theme") {
    //     location.href = "/super-admin-portal/dashboard";
    //   } else if (themeChecker == "light-theme") {
    //     location.href = "/admin-portal/dashboard";
    //   } else {
    //     location.href = "/tpc-portal/dashboard";
    //   }
    // } else {
    //   next();
    // }
    next();
  },
  methods: {
    ...mapActions({
      login: "auth/login"
    }),
    visitPlatform(platform) {
      // Todo: make as UX will define
      const payload = {
        email: "",
        password: "",
        portal: "",
        id: ""
      };
      let localSession = {
        theme: "",
        userInfo: "",
        token: ""
      };

      if (platform == "super-admin-portal") {
        localSession.theme = "pro-theme";
        localStorage.setItem("innov-superadmin", JSON.stringify(localSession));
        payload.email = "samit@smartdatainc.net";
        // My Details
        // payload.email = "vikram@superadmin.com";
        payload.password = "12345678";
        payload.portal = "superadmin";
      } else if (platform == "admin-portal") {
        localSession.theme = "light-theme";
        localStorage.setItem("innov-admin", JSON.stringify(localSession));
        payload.email = "samit.sdei@gmail.com";
        payload.password = "12345678";
        payload.portal = "admin";
      } else {
        localSession.theme = "dark-theme";
        localStorage.setItem("innov-tpc", JSON.stringify(localSession));
        payload.email = "samit.sdei@gmail.com";
        payload.password = "12345678";
        payload.portal = "tpc";
      }
      this.loading = true;
      this.login(payload)
        .then(response => {
          if (response.statusCode == 200) {
            this.$notify({
              group: "notify-site",
              type: "success",
              title: "Information",
              text: response.message
            });
            //  As Discuss in meeting open in platform new window.
            window.open(
              "/" + platform + "/dashboard",
              "_blank" // <- This is what makes it open in a new window.
            );

            // Todo: update layout according to check later
            // this.$router.push({ path: "/" + platform });
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
    }
  }
};
</script>

<template>
  <div class="logout">
    <img class src="@/assets/images/loading-test.gif" />
  </div>
</template>
<script>
import auth from '../components/auth/mixins/auth'

export default {
  name: "site-home",
  beforeRouteEnter(to, from, next) {
    // Todo: need update when switch sub domain
    // Update using api request better way
    const platform = from.fullPath.split("/")[1];
    const revised = platform.replace("-portal", "").replace("-", "");
    window.logoutPlatform = revised;
    next();
  },
  mixins: [ auth ],
  mounted() {
    // let reqPayload = {
    //   platform: window.logoutPlatform
    // };
    // this.logout(reqPayload)
    //   .then(response => {
    //     if (response.statusCode == 200) {
    //       this.$notify({
    //         group: "notify-portal",
    //         type: "success",
    //         title: "Information",
    //         text: response.message
    //       });
    //       location.href = "/";
    //     } else {
    //       this.$notify({
    //         group: "notify-portal",
    //         type: "error",
    //         title: "Information",
    //         text: response.message
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     this.$notify({
    //       group: "notify-portal",
    //       type: "error",
    //       title: "Information",
    //       text: error
    //     });
    //   });
    this.logout()
  },
};
</script>
<style lang="scss" scoped>
.logout {
  width: 100%;
  display: flex;
}

.logout img {
  width: 400px;
  margin: 30% auto;
}
</style>

<template>
  <v-row class="white flex-wrap my-0" id="login-page" v-if="!validating">
    <v-col cols="12" v-if="target == 'reset-send'"><reset-success :email="resend_email" :portal="portal" :trials="reset_trials" /></v-col>
    <template v-else>
      <v-col md="5" cols="12" class="p-0 d-flex flex-column">
        <div class="flex-grow-1">
          <div class="d-flex px-4 pt-4 justify-content-center justify-content-md-start">
            <language-switcher />
          </div>
          <div class="py-md-15 py-12">
            <div class="d-flex justify-content-center align-items-center">
              <div><logo width="7rem" /></div>
            </div>
          </div>
          <div class="d-flex justify-content-center align-content-center">
            <login :portal="portal" v-if="target == 'login'" class="autoscaled-container" />
            <forgot-password :portal="portal" v-if="target == 'forgot'" class="autoscaled-container" />
          </div>
          <div class="mb-4 mt-8 d-none">
            <div class="d-flex justify-content-center">
              {{$t('DONT_HAVE_AN_ACCOUNT')}} <router-link :to="{ name: 'sign_up' }" class="text-capitalize ml-1">{{$t('SIGN_UP')}}</router-link>
            </div>
          </div>
        </div>
        <div class="d-flex p-4 flex-shrink-0 justify-content-center justify-content-md-start">
          <div class="px-4">
            <WIOT360Logo width="7rem" />
          </div>
        </div>
      </v-col>
      <v-col cols="7" class="elevation-3 p-0 flex-grow-0 d-none d-lg-block" style="background:#fafafa;">
        <carousel />
      </v-col>
    </template>
  </v-row>
</template>

<script>
import Logo from './components/Logo.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import Login from './components/Login.vue'
import ForgotPassword from './components/ForgotPassword.vue'
import Carousel from './components/Carousel.vue'
import WIOT360Logo from './components/WIOT360Logo.vue'
import ResetSuccess from './components/ResetSuccess.vue'
import { EventBus } from '../../event-bus'
import auth from './mixins/auth'
import { isAuthorized } from '../../plugins/Auth'

export default {
  components: {
    Logo,
    LanguageSwitcher,
    Login,
    ForgotPassword,
    Carousel,
    WIOT360Logo,
    ResetSuccess,
  },
  mixins: [ auth ],
  data () {
    return {
      target: 'login',
      portal: 'tpc' || 'admin' || 'superadmin',
      resend_email: '',
      reset_trials: 0,
      validating: true,
    }
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler: 'routeChanged'
    }
  },
  mounted () {
    if (isAuthorized(this.portal)) {
      location.href = `/${this.portal}-portal/dashboard`
      return
    }
    this.validating = false
    this.updateLoginInfo()
    EventBus.$on('auth:reset:send', this.enableResetRequestSuccess)
  },
  beforeDestroy () {
    EventBus.$off('auth:reset:send', this.enableResetRequestSuccess)
  },
  methods: {
    routeChanged () {
      const target = this.$route.query.target
      this.target = target || 'login'
      // this.enableResetRequestSuccess({ trials: 1, email: 'sam@john.com' })
    },
    enableResetRequestSuccess ({ trials, email}) {
      this.resend_email = email
      this.reset_trials = trials
      this.target = 'reset-send'
    },
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap');
#login-page {
  font-family: 'Lato', sans-serif;
  .autoscaled-container {
    max-width: 25vw;
    width: 80%;
    @media screen and (max-width: 1264px) {
      width: 80%;
      max-width: unset;
    }
  }
}
</style>
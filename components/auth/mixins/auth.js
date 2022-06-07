import { mapActions } from 'vuex'
import { EventBus } from '../../../event-bus'

export default {
  methods: {
    ...mapActions({
      loginAction: 'auth/login',
      resetPasswordAction: 'auth/resetPassword',
      forgotPasswordAction: 'auth/forgotPassword',
      logoutAction: 'auth/logout',
    }),
    updateLoginInfo () {
      const localSession = {
        theme: '',
        userInfo: '',
        token: ''
      }
      this.removePortalInfo([ 'innov-superadmin', 'innov-admin', 'innov-tpc' ])
      if (this.portal == 'superadmin') localSession.theme = 'pro-theme'
      else if (this.portal == 'admin') localSession.theme = 'light-theme'
      else localSession.theme = 'dark-theme'
      localStorage.setItem(`innov-${this.portal}`, JSON.stringify(localSession))
    },
    removePortalInfo (portals) {
      for (const portal of portals) {
        if (localStorage.getItem(portal)) localStorage.removeItem(portal)
      }
    },
    forgotPassword() {
      this.loading = true
      const payload = {
        email: this.email,
        portal: this.portal,
        forgot_pass: 1
      }
      this.forgotPasswordAction(payload)
        .then(res => {
          if (res.statusCode) return res
          return res.data
        })
        .then(({ statusCode, message }) => {
          if (statusCode == 200) {
            EventBus.$emit('auth:reset:send', { trials: this.trials + 1, email: this.email })
            return this.$notify({
              group: 'notify-portal',
              type: 'success',
              title: 'Success',
              text: 'Reset link is send',
            })
          }
          this.$notify({
            group: 'notify-portal',
            type: 'error',
            title: 'Information',
            text: message || 'Could not send reset request now'
          })
        })
        .catch(error => {
          this.$notify({
            group: 'notify-portal',
            type: 'error',
            title: 'Information',
            text: error
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    async logout () {
      await this.logoutAction({
        platform: window.logoutPlatform
      }).catch(() => {})
      // this.$nextTick(() => {
        // this.$router.replace({ path: '/' })
      // })
      this.$socket.disconnect();
      location.href = '/' // reload and load the login page
    },
    login () {
      this.loading = true
      const payload = {
        email: this.email,
        password: this.password,
        portal: this.portal,
        id: ''
      }
      this.loginAction(payload)
        .then(res => {
          if (res && res.statusCode && res.statusCode == 200) return { statusCode: 200, message: 'Logged In' }
          return res.data
        })
        .then(({ statusCode, message }) => {
          if (statusCode == 200) {
            this.$notify({
              group: 'notify-portal',
              type: 'success',
              title: 'Success',
              text: message
            })
            this.$nextTick(() => {
              // setTimeout(() => {
                this.$router.replace({ name: `${this.portal}-dashboard` })
              // }, 1000)
            })
            // location.href = `/${this.portal}-portal/dashboard`
            return
          }
          this.$notify({
            group: 'notify-portal',
            type: 'error',
            title: 'Information',
            text: message || 'Could not login now'
          })
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            group: 'notify-portal',
            type: 'error',
            title: 'Information',
            text: error
          })
        })
        .finally(() => {
          this.loading = false
        })
    },
    resetPassword () {
      this.loading = true
      if(this.forgot_pass){
        const payload = {
          token: this.token,
          password: this.password,
          confirm_password: this.password2,
        } 
        this.resetPasswordAction(payload)
        .then(({ statusCode, message }) => {
          if (statusCode == 200) {
            this.email = message.email
            this.$notify({
              group: 'notify-portal',
              type: 'success',
              title: 'Information',
              text: 'Password has been updated successfully!'
            })
            this.updateLoginInfo()
            this.login()
            return
          }
          this.$notify({
            group: 'notify-portal',
            type: 'error',
            title: 'Information',
            text: 'Please try again'
          })
        })
        .catch(err => {
          this.$notify({
            group: 'notify-portal',
            type: 'error',
            title: 'Information',
            text: 'Please try again'
          })
          console.log({ err })
        })
        .finally(() => {
          this.loading = false
        })
      }else{
        if(!this.token || !this.portal || !this.portal_id){
          this.$notify({
            group: 'notify-portal',
            type: 'error',
            title: 'Information',
            text: 'Token is broken'
          })
          this.loading = false
        }else{
          const payload = {
            token: this.token,
            password: this.password,
            confirm_password: this.password2,
            portal: this.portal,
            portal_id: this.portal_id
          }
          this.resetPasswordAction(payload)
          .then(({ statusCode, message }) => {
            if (statusCode == 200) {
              this.email = message.email
              this.$notify({
                group: 'notify-portal',
                type: 'success',
                title: 'Information',
                text: 'Password has been updated successfully!'
              })
              this.updateLoginInfo()
              this.login()
              return
            }
            this.$notify({
              group: 'notify-portal',
              type: 'error',
              title: 'Information',
              text: 'Please try again'
            })
          })
          .catch(err => {
            this.$notify({
              group: 'notify-portal',
              type: 'error',
              title: 'Information',
              text: 'Please try again'
            })
            console.log({ err })
          })
          .finally(() => {
            this.loading = false
          })
        }
      }
    },
  }
}
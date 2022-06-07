<template>
  <div>
    <div class="d-flex justify-content-center justify-content-lg-start px-6 py-4">
      <language-switcher />
    </div>
    <div class="d-flex justify-content-center px-2">
      <div class="py-10 d-flex flex-column align-items-center w-100" style="max-width:25rem">
        <logo width="15vmin" />
        <h1 class="pt-6">{{$t('RESET_EMAIL.HEADER')}}</h1>
        <p style="font-size:0.9rem">{{$t('RESET_EMAIL.MESSAGE')}}</p>
        <v-btn
          block
          class="mt-4 text-capitalize"
          color="primary"
          elevation="0"
          @click="loginPage"
        >
          <v-icon small class="mr-2">{{$vuetify.rtl ? 'arrow_forward' : 'arrow_back'}}</v-icon>
          {{$t('BACK_TO_LOGIN')}}
        </v-btn>
        <div :class="[ $vuetify.rtl ? 'text-right' : 'text-left' ]">
          <h2 class="pt-8 mb-4 d-flex flex-nowrap text-nowrap">
            <v-icon :class="[ 'grey--text', $vuetify.rtl ? 'ml-3' : 'mr-3' ]" large>lock_reset</v-icon>
            {{$t('RESET_EMAIL.RESET')}}
          </h2>
          <p v-html="$t('RESET_EMAIL.TITLE', { email })"></p>
          <p class="grey--text" v-html="$t('RESET_EMAIL.CONTENT1')"></p>
          <p class="grey--text" v-html="$t('RESET_EMAIL.CONTENT2')"></p>
          <div class="mt-4">
            {{$t('RESET_EMAIL.RESEND')}}
            <button @click="resendEmail" :disabled="loading"
              class="btn-link font-italic" :style="`${$vuetify.rtl ? 'margin-right:2px;' : 'margin-left:2px;'} font-weight:700;`"
            >{{$t('VERIFICATION_EMAIL')}}</button>
            <v-progress-circular
              indeterminate
              color="primary"
              v-if="loading"
              width="1"
              size="15"
              :class="[ $vuetify.rtl ? 'mr-2' : 'ml-2' ]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LanguageSwitcher from './LanguageSwitcher.vue'
import Logo from './Logo.vue'
import auth from '../mixins/auth'

export default {
  name: 'reset-password-success',
  components: {
    LanguageSwitcher,
    Logo,
  },
  mixins: [ auth ],
  props: {
    email: { type: String, default: () => '' },
    portal: { type: String, default: () => '' },
    trials: { type: Number, default: () => 0 },
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    resendEmail () {
      this.forgotPassword()
    },
    loginPage () {
      this.$router.replace({ name: 'login' })
    },
  },
}
</script>

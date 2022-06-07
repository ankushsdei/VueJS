<template>
  <div>
    <div class="d-flex justify-content-center justify-content-lg-start px-6 py-4">
      <language-switcher />
    </div>
    <div class="d-flex justify-content-center px-2">
      <div class="py-10 d-flex flex-column align-items-center w-100" style="max-width:25rem;">
        <logo width="15vmin" />
        <h1 class="pt-8">{{$t('RESET_PASSWORD_HEADER')}}</h1>
        <v-title class="pt-8 pb-2 text-left w-100" style="font-weight:700">{{$t('CREATE_YOUR_PASSWORD')}}</v-title>
        <v-form @submit="submitForm" ref="form" class="w-100" v-model="valid">
          <v-text-field
            class="mt-4"
            :type="visibile_password ? 'text' : 'password'"
            :disabled="loading"
            :label="$t('ENTER_NEW_PASSWORD')"
            v-model.trim="password"
            :rules="[rules.required, rules.context]"
            :error.sync="password_error"
            @input="passwordChanging"
          >
            <template v-slot:append>
              <div class="d-flex">
                <div
                  :class="[ 'blue--text cursor-pointer', $vuetify.rtl ? 'ml-3' : 'mr-3' ]"
                  v-if="password"
                  @click="visibile_password=!visibile_password"
                >{{ $t(visibile_password ? 'HIDE' : 'SHOW') }}</div>
                <v-icon style="color:inherit;">lock</v-icon>
              </div>
            </template>
          </v-text-field>
          <v-text-field
            class="mt-4"
            :type="visibile_password ? 'text' : 'password'"
            :disabled="loading"
            :label="$t('CONFIRM_NEW_PASSWORD')"
            v-model.trim="password2"
            :rules="[rules.required, rules.context, rules.match]"
            ref="confirmPassword"
            append-icon="lock"
          />
          <div :class="[ 'form-validations py-2', $vuetify.rtl ? 'text-right' : 'text-left' ]">
            <p v-for="(valid, index) in validations" :key="`validator-${index}`">
              <v-icon :class="[ $vuetify.rtl ? 'ml-2': 'mr-2', valid.class ]">{{valid.icon}}</v-icon>
              {{valid.text}}
            </p>
          </div>
          <v-btn
            block
            color="primary"
            elevation="0"
            :loading="loading"
            class="mt-6 text-capitalize"
            @click="submitForm"
          >{{$t('CREATE_PASSWORD')}}<v-icon small :class="[ $vuetify.rtl ? 'mr-2' : 'ml-2' ]">lock</v-icon></v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import Logo from './components/Logo.vue'
import auth from './mixins/auth'
const MAX_PASSWORD_LENGTH = 8

export default {
  name: 'reset-password',
  components: {
    LanguageSwitcher,
    Logo,
  },
  mixins: [ auth ],
  data () {
    const rules = {
      required: value => !!value || this.$t('REQUIRED'),
      context: value => (!Object.values(this.regex).filter(t => !t.test(value)).length && value.length > MAX_PASSWORD_LENGTH) || this.$t('INVALID_PASSWORD'),
      match: value => (value == this.password && value == this.password2) || this.$t('PASSWORD_NO_MATCH'),
    }
    const regex = {
      uppercase: /[A-Z]/,
      lowercase: /[a-z]/,
      number: /[0-9]/,
      special: /~|`|!| |@|#|\$|%|\^|&|\*|\(|\)|_|-|\+|=|\{|\[|\}|\]|\||:|;|"|'|<|,|>|\.|\?|\//,
    }
    return {
      password_error: false,
      password: '',
      password2: '',
      token: '',
      email: '',
      visibile_password: false,
      loading: false,
      valid: true,
      rules,
      regex,
    }
  },
  mounted () {
    this.token = this.$route.query.key || ''
    this.portal = this.getPortal()
    this.portal_id = this.$route.query.portal_id || ''
    this.forgot_pass = this.$route.query.forgot_pass || ''
    // this.portal_id =  ''
    // this.portal = this.$route.query.portal || ''
  },
  computed: {
    validations () {
      const uppercase = this.regex.uppercase.test(this.password)
      const lowercase = this.regex.lowercase.test(this.password)
      const number = this.regex.number.test(this.password)
      const special = this.regex.special.test(this.password)
      const length = this.password.length > MAX_PASSWORD_LENGTH
      const icon = val => val ? 'done' : 'dangerous'
      const style = val => val ? 'green--text' : 'red--text'
      return [
        { text: this.$t('ERROR.ATLEAST_N_LOWER_CASE_LETTER', { n : '1' }), valid: uppercase, },
        { text: this.$t('ERROR.ATLEAST_N_UPPER_CASE_LETTER', { n : '1' }), valid: lowercase },
        { text: this.$t('ERROR.ATLEAST_N_NUMBER_AND_A_SPECIAL_CHARACTER', { n: '1' }), valid: number && special },
        { text: this.$t('ERROR.ATLEAST_N_TOTAL_CHACTERS', { n: MAX_PASSWORD_LENGTH }), valid: length },
      ].map(m => ({
        ...m,
        icon: icon(m.valid),
        class: style(m.valid)
      }))
    },
  },
  methods: {
    passwordChanging () {
      if (this.password2) {
        this.$refs.form.validate() // force validation
      }
    },
    submitForm (ev) {
      if (ev) ev.preventDefault()
      if (!this.$refs.form.validate()) return // form is invalid
      this.resetPassword()
    },
    getPortal() {
      if (this.$route.name == 'a-reset-password') return 'admin'
      if (this.$route.name == 'tpc-reset-password') return 'tpc'
      return 'superadmin'
    },
  }
}
</script>

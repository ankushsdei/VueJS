<template>
  <div>
    <h4 class="pt-4 pb-6" style="font-weight:700;">{{$t('LOGIN_TO_YOUR_ACCOUNT')}}</h4>
    <v-form ref="form" @submit="submitForm" v-model="valid">
      <input class="d-none" type="text" name="fakeusernameremembered" />
      <input class="d-none" type="password" name="fakepasswordremembered" />
      <v-text-field
        class="mt-4"
        type="text"
        :disabled="loading"
        append-icon="alternate_email"
        :placeholder="$t('EMAIL_ADDRESS')"
        v-model.trim="email"
        :rules="[rules.required, rules.email]"
        autocomplete="off"
      />
      <v-text-field
        class="mt-4"
        :type="visibile_password ? 'text' : 'password'"
        :disabled="loading"
        :placeholder="$t('ENTER_YOUR_PASSWORD')"
        v-model.trim="password"
        :rules="[rules.required]"
        autocomplete="off"
      >
        <template v-slot:append>
          <div class="d-flex">
            <div
              class="blue--text cursor-pointer"
              :class="[ $vuetify.rtl ? 'ml-3' : 'mr-3' ]"
              v-if="password" @click="visibile_password=!visibile_password"
            >{{ $t(visibile_password ? 'HIDE' : 'SHOW') }}</div>
            <v-icon style="color:inherit;">lock</v-icon>
          </div>
        </template>
      </v-text-field>
    </v-form>
    <div class="d-flex justify-content-end py-2">
      <v-btn
        plain
        class="text-capitalize px-0"
        :disabled="loading"
        elevation="0"
        @click="forgotPassword"
      >{{$t('FORGOT_PASSWORD')}}</v-btn>
    </div>
    <div class="py-4">
      <v-btn
        block
        elevation="0"
        :loading="loading"
        color="primary"
        class="text-capitalize"
        @click="submitForm"
      >
        <!-- :disabled="!valid" -->
        {{$t('LOGIN_TO_CONTINUE')}}
        <v-icon small :class="[ $vuetify.rtl ? 'mr-2' : 'ml-2' ]">{{$vuetify.rtl ? 'arrow_back' : 'arrow_forward'}}</v-icon>
      </v-btn>
    </div>
    <div class="d-none">
      <button
        v-shortkey="['f8']"
        @shortkey="autoFill()"
        class="btn btn-primary d-none"
      ></button>
    </div>
  </div>
</template>

<script>
import auth from '../mixins/auth'

export default {
  props: {
    portal: { type: String, default: () => 'tpc' },
  },
  mixins: [ auth ],
  data () {
    const rules = {
      required: value => !!value || this.$t('REQUIRED'),
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || this.$t('INVALID_EMAIL')
      },
    }
    return {
      email: '',
      password: '',
      visibile_password: false,
      valid: false,
      loading: false,
      rules,
    }
  },
  methods: {
    submitForm (ev) {
      if (ev) ev.preventDefault()
      if (!this.$refs.form.validate()) return // form is invalid
      this.login()
    },
    forgotPassword () {
      this.$router.replace({ query: { target: 'forgot' } })
    },
    autoFill () {
      if (this.portal == 'superadmin') {
        this.email = 'samit@yopmail.com';
        this.password = '12345678';
      } else if (this.portal == 'admin') {
        this.email = 'samit.sdei@gmail.com';
        this.password = '12345678';
      } else {
        this.email = 'samit.sdei@gmail.com';
        this.password = '12345678';
      }
    },
  },
}
</script>

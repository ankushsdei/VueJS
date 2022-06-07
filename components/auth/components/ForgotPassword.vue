<template>
  <div>
    <h4 class="pt-4 pb-6" style="font-weight:700;">{{$t('FORGET_PASSWORD')}}</h4>
    <v-form @submit="submitForm" ref="form" v-model="valid">
      <v-text-field
        class="mt-4"
        type="text"
        append-icon="alternate_email"
        :labgel="$t('EMAIL_ADDRESS')"
        v-model="email"
        :disabled="loading"
        :rules="[rules.required, rules.email]"
      />
      <div class="py-4">
        <v-btn
          block
          elevation="0"
          color="primary"
          class="text-capitalize"
          @click="submitForm"
          :loading="loading"
        >
          {{$t('RESET_PASSWORD')}}
          <v-icon small :class="[ $vuetify.rtl ? 'mr-2' : 'ml-2' ]">lock_reset</v-icon>
        </v-btn>
      </div>
    </v-form>
    <div class="py-2">
      <v-btn
        block plain
        elevation="0"
        class="text-capitalize"
        @click="backToLogin"
        :disabled="loading"
      >
        <v-icon small :class="[ $vuetify.rtl ? 'ml-2' : 'mr-2' ]">{{$vuetify.rtl ? 'arrow_forward' : 'arrow_back'}}</v-icon>
        {{$t('BACK_TO_LOGIN')}}
      </v-btn>
    </div>
  </div>
</template>

<script>
import auth from '../mixins/auth'

export default {
  name: 'forgot-password',
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
      valid: true,
      loading: false,
      rules,
      trials: 0,
    }
  },
  methods: {
    submitForm (ev) {
      if (ev) ev.preventDefault()
      if (!this.$refs.form.validate()) return // form is invalid
      this.forgotPassword()
    },
    backToLogin () {
      this.$router.replace({ query: { target: 'login' } })
    },
  }
}
</script>
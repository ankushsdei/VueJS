<template>
  <div class="d-inline-flex flex-nowrap p-2 language-switcher align-items-center">
    <v-icon class="grey--text mr-2">language</v-icon>
    <v-select
      flat hide-details dense
      :items="languages"
      class="mt-0"
      v-model="lang"
      @change="changeLanguage"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import i18next from 'i18next'
import LanguageHelper from '@/helpers/lang'
import { EventBus } from '../../../event-bus'

export default {
  name: 'language-switcher',
  data () {
    const languages = [
      { value: 'en', text: 'EN' },
      { value: 'ar', text: 'AR' },
    ]
    return {
      languages,
      lang: 'en',
    }
  },
  mounted () {
    this.lang = LanguageHelper.vuetifyLang
    this.$vuetify.rtl = this.lang == 'ar'
  },
  methods: {
    ...mapActions('auth', [ 'updateLanguage' ]),
    changeLanguage (lang) {
      i18next.changeLanguage(lang)
      this.updateLanguage(lang)
      EventBus.$emit('LanguageChange', lang)
    },
  }
}
</script>

<style lang="scss">
.language-switcher {
  max-width: 5rem;
  .v-input__slot {
    &::after, &::before { display: none !important; }
  }
}
</style>

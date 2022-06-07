import Vue from 'vue'
import Vuetify from 'vuetify'
import { ar, en } from 'vuetify/lib/locale'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify)

const opts = {
  lang: {
    locales: { en, ar },
    current: 'en'
  },
  icons: {
    iconfont: 'md'
  }
}

import './vuetify.scss'

export default new Vuetify(opts)

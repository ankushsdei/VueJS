<template>
  <v-btn
    dir="ltr"
    :text="!mini"
    :small="mini && table"
    :icon="mini"
    :outlined="mini"
    :href="`tel:${filteredFormatted}`"
    :label="mini ? null : formatted"
    class="font-weight-regular dir-ltr"
    v-tooltip="`${$t('CALL')} : ${formatted}`"
  >
    <span class="fa fa-phone" v-if="mini && table"></span>
    <animated-icon v-else-if="mini" :name="ICONS.TELEPHONE" primary-color="grey" secondary-color="red" />
    <!-- <q-tooltip>{{$t('CALL')}} : {{formatted}}</q-tooltip> -->
  </v-btn>
</template>

<script lang="ts">
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber'
import { AnimatedIcon, ICONS } from './AnimatedIcon/index'

const phoneNumberUtil = new PhoneNumberUtil()

export default {
  name: 'phone-display',
  components: {
    AnimatedIcon,
  },
  props: {
    phone: { type: String, required: true },
    mini: { type: Boolean, default: () => false },
    table: { type: Boolean, default: () => false },
  },
  data () {
    return {
      ICONS,
    }
  },
  computed: {
    filtered () {
      return phoneNumberUtil.parseAndKeepRawInput(this.phone)
    },
    filteredFormatted () {
      return phoneNumberUtil.format(this.filtered, PhoneNumberFormat.E164)
    },
    formatted () {
      return phoneNumberUtil.format(this.filtered, PhoneNumberFormat.INTERNATIONAL)
    },
  },
}
</script>

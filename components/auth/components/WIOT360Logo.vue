<template>
  <v-img :src="source" :width="width" />
</template>

<script>
const source = require('../images/WioT360-01.png')

export default {
  name: 'WIOT360Logo',
  props: {
    width: { type: [String, Number, Array, Object], default: () => {} },
  },
  data () {
    return {
      source,
    }
  },
}
</script>
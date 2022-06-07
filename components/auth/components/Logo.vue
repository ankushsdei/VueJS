<template>
  <div class="main-logo">
    <v-img :src="logo" aspect-ratio="1" :width="width" />
  </div>
</template>

<script>
const logo = require('../images/wathiq-logo.png')

export default {
  name: 'app-logo',
  props: {
    width: { type: [ Array, Object, String, Number ], default: () => undefined },
  },
  data () {
    return {
      logo,
    }
  },
}
</script>

<style lang="scss" scoped>
.main-logo {
  border-radius: 0.5rem;
  overflow: hidden;
}
</style>

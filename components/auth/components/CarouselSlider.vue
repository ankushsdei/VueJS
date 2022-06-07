<template>
  <div class="h-100">
    <div
      :class="carousel.class"
      :style="`background-image: url(${localeSRC});`"
      class="carousel-image-wrapped d-flex flex-column align-items-center white--text"
      style="text-shadow: 0 0 1px #999;"
    >
      <div v-if="carousel.header || carousel.subHeader" class="mt-15 pt-15">
        <h1 style="font-weight:800" class="mb-7 mt-16" v-if="carousel.header"><fleet-locale-display :val="carousel.header" /></h1>
        <div v-if="carousel.subHeader" class="py-2 px-15 blured-bg mx-8 rounded">
          <h3 style="line-height:2.5rem;"><fleet-locale-display :val="carousel.subHeader" /></h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LanguageHelper from '@/helpers/lang'

export default {
  props: {
    carousel: { type: Object, required: true },
  },
  computed: {
    localeSRC () {
      const lang = `src-${LanguageHelper.lang.toLowerCase()}`
      if (this.carousel[lang]) return this.carousel[lang]
      return this.carousel.src
    },
  }
}
</script>

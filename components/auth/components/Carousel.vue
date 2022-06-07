<template>
  <v-carousel cycle dark :show-arrows="false" class="h-100 auth-carousel">
    <v-carousel-item
      v-for="(carousel, index) in carousel_items"
      :key="index"
    >
      <v-sheet height="100%" tile>
        <carousel-slider :carousel="carousel" />
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import carousel from './carousel'
import CarouselSlider from './CarouselSlider.vue'

export default {
  name: 'carousel',
  components: {
    CarouselSlider,
  },
  computed: {
    carousel_items () {
      return carousel
    },
  },
}
</script>

<style lang="scss">
.auth-carousel {
  .v-image {
    height: 100% !important;
  }
  .carousel-image-wrapped {
    height: 100%;
    width: 100%;
    background-size: cover;
    &.sized {
      background-size: 60%;
    }
    background-position: center center;
  }
  .v-carousel__controls {
    background: none;
    padding-bottom: 1.5rem;
    .v-carousel__controls__item {
      background: none !important;
      &::before { display: none; }
      i {
        color: #1a73e8;
        font-size: 1.5rem !important;
      }
      &.v-btn--active {
        i { opacity: 1; }
      }
    }
  }
  .v-sheet {
    background: none !important;
    background-color: none !important;
  }
  .blured-bg {
    backdrop-filter: blur(0.7rem);
    background-color: rgba(255, 255, 255, 0.1);
  }
}
.isRTL .auth-carousel .v-responsive__content {
  margin-right: 0;
}
</style>

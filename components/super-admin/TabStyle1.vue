<template>
  <div class="nav-sub-tabs">
    <ul class="nav nav-tabs border-0" v-if="slickCondition">
      <li
        v-for="(menu, index) in headerMenu"
        :key="index"
        class="nav-item"
        :class="{ active: menu.active }"
      >
        <a
          @click="menu.callBack(menu.componentRouter, menu.childComponentRouter)"
          class="nav-link border-0"
          data-toggle="tab"
          href="javascript:void(0);"
        >
          <span>
            <i :class="'innov-icon icon-' + menu.icon"></i>
          </span>
          <span>{{ $t(menu.title) }}</span>
        </a>
      </li>
    </ul>

    <VueSlickCarousel v-else class="nav nav-tabs border-0 slider-tabs" v-bind="slideSettings">
      <div
        v-for="(menu, index) in headerMenu"
        :key="index"
        class="nav-item"
        :class="{ active: menu.active }"
      >
        <a
          @click="menu.callBack(menu.componentRouter, menu.childComponentRouter)"
          class="nav-link border-0"
          data-toggle="tab"
          href="javascript:void(0);"
        >
          <span>
            <i :class="'innov-icon icon-' + menu.icon"></i>
          </span>
          <span>{{ $t(menu.title) }}</span>
        </a>
      </div>
    </VueSlickCarousel>
    <div class="tab-content" id="sap-admin-detail-tab-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// optional style for arrows & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";

export default {
  name: "TabStyle1",
  components: {
    VueSlickCarousel
  },
  props: {
    headerMenu: Array
  },
  data() {
    return {
      slickCondition: false,
      slideSettings: {
        dots: false,
        focusOnSelect: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        touchThreshold: 5,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: false,
              dots: false
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 575,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      }
    };
  },
  mounted() {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 567) {
        this.slickCondition = false;
      } else {
        this.slickCondition = this.$props.headerMenu.length < 5 ? true : false;
      }
    });
    this.slickCondition = this.$props.headerMenu.length < 5 ? true : false;
  }
};
</script>
<style lang="scss" scoped></style>

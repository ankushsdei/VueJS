<template>
  <div class="card">
    <div
      class="card-header d-flex justify-content-between"
      :class="headerClass"
      @click="toggleContent"
    >
      <label class="font-bold mb-0">{{ initAction.title }}</label>
      <span class="cc-header-toggle" :class="show ? 'active' : ''">
        <img :src="require(`@/assets/images/` + initAction.icon)" :alt="initAction.title" />
      </span>
    </div>
    <div class="card-body" :class="bodyClass" v-show="show">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "ActionCard",
  props: {
    initAction: {
      type: Object
    },
    headerClass: {
      type: String,
      default: () => ""
    },
    bodyClass: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {
      lang: "DE",
      show: true
    };
  },
  methods: {
    toggleContent() {
      this.show = !this.show;
    }
  }
};
</script>

<style scoped lang="scss">
.cc-header-toggle {
  img {
    transition: transform 0.2s linear;
  }
  &.active {
    img {
      transform: rotate(-180deg);
    }
  }
}
</style>

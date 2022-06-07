<template>
  <div class="fleet-profile-chip d-inline-flex align-items-center">
    <div class="fleet-profile-image rounded-circle border">
      <img :src="image" v-if="image" class="profile-img" />
      <div v-else class="fleet-image-text">{{ name_chip }}</div>
    </div>
    <div class="fleet-profile-info ml-2 d-flex flex-column">
      <div v-if="extra_top">{{ extra_top }}</div>
      <div class="fleet-profile-name font-weight-bold">{{ name }}</div>
      <div class="fleet-extra-info">
        <a
          class="btn btn-white border border-light_info btn-sm clicker-btn rounded-circle mr-2"
          v-if="email"
          :href="`mailto:${email}`"
          v-b-tooltip.hover
          :title="email"
        >
          <i class="fa fa-envelope"></i>
        </a>
        <a
          class="btn btn-white border border-light_info btn-sm clicker-btn rounded-circle"
          v-if="phone"
          :href="`tel:${phone}`"
          v-b-tooltip.hover
          :title="phone"
        >
          <i class="fa fa-phone"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      defualt: () => ""
    },
    email: {
      type: String,
      default: () => ""
    },
    phone: {
      type: String,
      default: () => ""
    },
    extra_top: {
      type: String,
      defualt: () => ""
    }
  },
  computed: {
    name_chip() {
      return this.name
        .split(" ")
        .filter(m => m.trim() != "")
        .map(m => m.substring(0, 1))
        .join("")
        .substring(0, 2)
        .toUpperCase();
    }
  }
};
</script>

<style scoped lang="scss">
.fleet-profile-chip {
  .fleet-profile-image {
    width: 4rem;
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--light);
    .fleet-image-text {
      font-size: 2rem;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .fleet-extra-info {
    button {
      height: 1.8rem;
      width: 1.8rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-size: 0.8rem;
    }
  }
}
</style>

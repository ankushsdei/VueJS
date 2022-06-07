<template>
  <div
    class="name-photo-container d-inline-flex align-items-center"
    @click="$emit('click', $event)"
  >
    <img :src="photo" v-if="photo" class="profile-img" />
    <div v-else class="fleet-image-text">{{ name_chip }}</div>
    <div class="name-photo-name-desc d-flex flex-column ml-1" v-if="!iconOnly">
      <div class="name-extra" v-if="extra">{{ extra }}</div>
      <div class="name-photo-name">{{ name }}</div>
      <div class="name-photo-desc text-muted" v-if="description">{{ description }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      // type: String,
      required: true
    },
    photo: {
      type: String,
      default: () => ""
    },
    description: {
      type: String,
      default: () => ""
    },
    iconOnly: {
      type: Boolean,
      default: () => false
    },
    extra: {
      type: String,
      default: () => ""
    }
  },
  computed: {
    name_chip() {
      return this.name
        .split(" ")
        .filter(n => n.trim() != "")
        .map(n => n.substring(0, 1))
        .join("")
        .substring(0, 2)
        .toUpperCase();
    }
  }
};
</script>

<style lang="scss" scoped>
.name-photo-container {
  > img,
  .fleet-image-text {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    overflow: hidden;
    outline: none;
    border: 1px solid var(--gray);
  }
  .fleet-image-text {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    background: var(--light);
  }
  > div {
    flex-shrink: 0;
  }
}
</style>

<template>
  <div class="d-flex align-items-center pa-1">
    <v-skeleton-loader type="avatar" />
    <div class="d-flex flex-column ml-3">
      <v-skeleton-loader type="text" class="mb-1" width="80" />
      <v-skeleton-loader type="text" width="50" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'profile-chip-skeleton',
}
</script>
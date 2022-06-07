<template>
  <v-card flat class="border">
    <div class="pa-2">
      <div class="d-flex justify-content-between flex-nowrap">
        <v-skeleton type="avatar" />
        <div class="flex-1 flex-column align-items-end ml-1">
          <v-skeleton type="chip" width="40%" class="mb-1" />
          <v-skeleton type="chip" width="70%" class="mb-1" />
          <v-skeleton type="chip" width="50%" />
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'icon-card-skeleton',
}
</script>

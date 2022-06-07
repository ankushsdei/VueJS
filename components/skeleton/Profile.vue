<template>
  <div class="d-flex flex-column">
    <template v-if="profile1||profile2">
      <v-card class="fleet-card elevation-3 mb-2">
        <div class="fleet-card-header p-2">
          <div class="d-flex align-items-center justify-content-start" style="min-height: 3rem">
            <v-skeleton-loader type="text" width="40%" />
          </div>
          <v-divider class="m-0" />
        </div>
        <div class="p-2" v-if="profile1">
        </div>
        <div class="p-2" v-if="profile2">
          <div class="row">
            <div class="col-6 my-2" v-for="col in 4" :key="`profile-2-col-4-main-${col}`">
              <profile-chip-skeleton />
            </div>
          </div>
        </div>
        <v-divider class="m-0" />
        <div class="p-2">
          <div class="row">
            <div class="col-6 my-2" v-for="col in 2" :key="`profile-2-col-2-min-${col}`">
              <profile-chip-skeleton />
            </div>
          </div>
        </div>
      </v-card>
    </template>
    <!-- <template v-if="alerts">
      <alerts-card end-point="" skeleton class="elevation-3 mb-2" />
    </template> -->
    <template v-if="extras">
      <v-card class="elevation-3 mb-2">
        <div class="pa-2">
          <v-skeleton-loader type="text" width="40%" />
        </div>
        <v-divider class="m-0" />
        <div class="pa-2">
          <div class="d-flex flex-nowrap">
            <profile-chip-skeleton class="flex-grow-1" />
            <v-skeleton-loader type="text" />
          </div>
        </div>
      </v-card>
    </template>
    <template v-if="others">
      <v-card class="shadow-1 mb-2">
        <div class="p-2">
          <v-skeleton-loader type="text" width="40%" />
        </div>
        <v-divider class="m-0" />
        <div class="p-2">
          <profile-chip-skeleton />
          <br />
          <profile-chip-skeleton />
        </div>
      </v-card>
    </template>
  </div>
</template>

<script>
import ProfileChipSkeleton from './ProfileChip.vue'

export default {
  name: 'profile-skeleton',
  components: {
    ProfileChipSkeleton,
  },
  props: {
    profile1: { type: Boolean, default: () => false },
    profile2: { type: Boolean, default: () => false },
    extras: { type: Boolean, default: () => false },
    others: { type: Boolean, default: () => false },
    alerts: { type: Boolean, default: () => false },
  },
}
</script>

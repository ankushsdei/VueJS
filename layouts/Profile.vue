<template>
  <div>
    <slot name="mini" />
    <div class="row q-col-gutter-md">
      <div class="col-md-12 col-12 col-lg-3">
        <slot name="profile" />
      </div>
      <div class="col-md-12 col-12 col-lg-9">
        <v-card class="elevation-1">
          <slot name="content" />
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'profile-layout'
}
</script>

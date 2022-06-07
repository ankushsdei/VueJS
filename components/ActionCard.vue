<template>
  <div class="action-card custom-action-card left-side-action-card">
    <div class="header d-flex justify-content-between" v-if="title">
      <span>{{ $t(title) }}</span>
      <div v-if="cardActions && cardActions.length > 0" class="actions">
        <div :class="'action-' + action.title" v-for="(action, index) in cardActions" :key="index">
          <button
            v-if="action.active"
            @click="action.callBack"
            class="cust-btn edit-green"
            :class="action.contentClass || ''"
          >
            <i v-if="action.iconLib" :class="'fa fa-' + action.icon" v-tooltip="action.title" />
            <img v-else :src="require(`@/assets/images/` + action.icon)" :alt="action.title" />
          </button>
        </div>
      </div>
      <slot name="actions" />
    </div>
    <div class="action-card-content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "ActionCard",
  props: {
    title: {
      type: String
    },
    cardActions: {
      type: Array
    }
  },
  data() {
    return {
      lang: "DE"
    };
  },
  methods: {}
};
</script>
<style scoped lang="scss"></style>

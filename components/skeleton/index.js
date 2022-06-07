import Vue from 'vue'

// components
import FleetProfileSkeleton from './Profile.vue'
import FleetProfileChipSkeleton from './ProfileChip.vue'
import FleetIconCardSkeleton from './IconCard.vue'

// to export
const exports = {
  FleetProfileSkeleton,
  FleetProfileChipSkeleton,
  FleetIconCardSkeleton,
}

// loop over each components
for (const key in exports) {
  // get component config
  const componentConfig = exports[key];
  // register component globally
  Vue.component(key, componentConfig.default || componentConfig);
}

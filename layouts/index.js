import Vue from 'vue';
// components
import FleetProfileLayout from './Profile.vue'

const exports = {
  FleetProfileLayout,
}

// loop over each components
for (let key in exports) {
  // get component config
  const componentConfig = exports[key];

  // register component globally
  Vue.component(key, componentConfig.default || componentConfig);
}

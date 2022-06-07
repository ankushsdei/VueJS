<template>
  <section class="footer">
    <p class="copyright">&copy;{{ $t("copyright") }} - Innovent 2020 - 2021</p>
  </section>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Footer",
  components: {},
  props: {},
  data() {
    return {};
  },

  created() {},

  methods: {
    ...mapActions({})
  }
};
</script>

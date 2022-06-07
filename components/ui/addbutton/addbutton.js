export default {
  name: "addbutton",
  components: {},
  props: {
    addAction: {
      type: Function
    },
    title: {
      type: String,
      default: "add"
    },
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    actionDo() {
      this.$props.addAction(this.$props.type);
    }
  }
};

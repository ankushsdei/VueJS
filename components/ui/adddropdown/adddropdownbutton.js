export default {
  name: "adddropdownbutton",
  components: {},
  props: {
    addAction: {
      type: Function
    },
    uploadAction: {
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
    actionDo(type,typeName) {
      this.$emit('hardwareType', {type:type, typeName: typeName})
      this.$props.addAction(this.$props.type);
    },
    actionTrigger() {
      this.$props.uploadAction(this.$props.type);
    }
  }
};

<template>
  <div v-if="isAllowed">
    <CommentsInner v-bind="$props" />
  </div>
</template>
<script>
import CommentsInner from "./CommentsInner";
export default {
  name: "Comments",
  components: {
    CommentsInner
  },
  props: {
    label: {
      type: String,
      default: "add_notes"
    },
    outerClasses: {
      type: String,
      default: ""
    },
    listTitle: {
      type: String,
      default: "added_notes"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: ""
    },
    data: Array,
    onDeleteNote: Function,
    addNote: Function,
    updateNotes: Function,
    refreshData: Function
  },
  data() {
    return {
      isAllowed: false
    };
  },
  mounted() {
    if (!this.code) {
      return;
    }
    const userAccess = JSON.parse(localStorage.getItem("user-access"));
    const currentModule = userAccess.find(item => item.code === this.code);
    if (currentModule) {
      const permissions = JSON.parse(currentModule.feature);
      if (permissions && permissions.length) {
        const notesPermission = permissions.some(item => Object.keys(item).includes("notes"));
        if (notesPermission) {
          this.isAllowed = true;
        }
      }
    }
  }
};
</script>

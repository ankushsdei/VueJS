<template>
  <b-modal
    id="action-modal"
    :contentClass="'action-modal-content-' + modalAction"
    :bodyClass="'action-modal-body-' + modalAction"
    :noCloseOnEsc="false"
    :noCloseOnBackdrop="false"
    :hideFooter="true"
    centered
    :size="size"
    ref="modal"
  >
    <template v-slot:modal-header>
      <h5>
        <b>{{ header }}</b>
      </h5>
      <button type="button" class="close" @click="$bvModal.hide('action-modal')">
        <span aria-hidden="true">&times;</span>
      </button>
    </template>
    <slot />
  </b-modal>
</template>

<script>
export default {
  name: "ActionModal",
  props: {
    modalIcon: String,
    modalAction: {
      type: String,
      default: "add"
    },
    size: {
      type: String,
      default: ""
    },
    header: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      name: "",
      nameState: null,
      submittedNames: []
    };
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.name = "";
      this.nameState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Push the name to submitted names
      this.submittedNames.push(this.name);
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    }
  }
};
</script>

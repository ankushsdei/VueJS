<template>
  <div>
    <div class="row no-gutters">
      <b
        ><i class="fa fa-edit h6 mr-2 cursorclass"></i
        >{{
          currentEditId == "" && is_editable
            ? $t("add")
            : currentEditId != "" && is_editable
            ? $t("edit")
            : ""
        }}
        {{ $t("profile_dashboard.notes") }}
      </b>
    </div>
    <div class="row no-gutters" v-if="is_editable">
      <form data-vv-scope="Note" class="w-100 position-relative">
        <input
          v-on:keydown.enter.prevent="currentEditId == '' ? submitNote('Note') : submitNote('Note')"
          type="text"
          name=""
          class="form-control"
          :placeholder="$t('profile_dashboard.enter_text_here')"
          v-model="note_"
          :ref="'note'"
          v-validate="'required'"
          :class="{
            'is-invalid': (loading && !note_) || errors.has('note'),
          }"
        />
        <div v-show="(loading && !note_) || errors.has('note')" class="invalid-feedback">
          {{ $t("required_field_message") }}
        </div>
        <button
          type="button"
          v-if="currentEditId != ''"
          title="Edit"
          class="btn btn-sm btn-primary SendNotes position-absolute"
          @click="submitNote('Note')"
        >
          <i class="fa fa-edit"></i>
        </button>
        <button
          type="button"
          v-else
          :disabled="loading"
          title="Add"
          class="btn btn-sm btn-primary SendNotes position-absolute"
          @click="submitNote('Note')"
        >
          <i class="fa fa-paper-plane-o"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-edit-note',
  props: {
    is_editable: { type: Boolean, default: () => false },
    currentEditId: { type: [ String, Number ], default: () => '' },
    loading: { type: Boolean, default: () => false },
    note: { type: String, default: () => '', required: true },
  },
  data () {
    return {
      note_: '',
    }
  },
  watch: {
    note: {
      immediate: true,
      handler () {
        if (!this.note_ || this.note_ != this.note) this.note_ = this.note
      }
    },
  },
  methods: {
    async submitNote(scope) {
      let result = await this.$validator.validateAll(scope)
      this.$emit('submitted', result)
      this.$emit('update:note', this.note_)
    },
  },
}
</script>

<style scoped>
</style>
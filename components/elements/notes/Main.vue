<template>
  <div class="custom-info-content-inner admin-account-icon-data">
    <add-edit
      :is_editable="editable"
      :currentEditId="currentEditId"
      :note.sync="note"
      :loading="loading"
      @submitted="noteChanged"
    />
    <listing
      :is_editable="editable"
      @note="ev => note = ev"
      @note_id="ev => currentEditId = note_id"
      @deleteNote="deleteNote"
      :notes="notes"
    />
  </div>
</template>

<script>
import AddEdit from './AddEdit.vue'

export default {
  name: 'notes',
  components: {
    AddEdit,
  },
  props: {
    editable: { type: Boolean, default: () => false },
    loading: { type: Boolean, default: () => false },
    notes: { type: Array, default: () => [], required: true },
  },
  data () {
    return {
      currentEditId: '',
      note: '',
    }
  },
  methods: {
    noteChanged () {
      if (this.currentEditId) this.$emit('update', {
        id: this.currentEditId,
        note: this.note,
      })
      else this.$emit('create', {
        note: this.note,
      })
    },
    deleteNote (id) {
      this.$emit('delete', id)
    },
  }
}
</script>

<style lang="scss" scoped>
</style>
<template>
  <div v-if="getTripInstance.data.notes.length">
    <div class="row no-gutters mt-4">
      <b>{{ $t("profile_dashboard.added_notes") }} </b>
    </div>
    <div
      class="row no-gutters mt-2 notes-section p-3"
      v-for="(note, i) in listOfData"
      v-bind:key="i"
    >
      <div class="col-10">
        <div class="profile-detail-inner d-flex">
          <img
            v-if="
              note.created_by != undefined &&
              note.created_by.image != undefined &&
              note.created_by.image != ''
            "
            height="40"
            width="40"
            :src="note.created_by.image"
            class="auth-img"
          />
          <img v-else src="@/assets/images/user.png" height="40" width="40" class="auth-img" />
          <div class="profile-info-detail">
            <p class="mb-0">
              {{
                note.created_by != undefined &&
                note.created_by.first_name != undefined &&
                note.created_by.first_name != ""
                  ? note.created_by.last_name != undefined && note.created_by.last_name != ""
                    ? note.created_by.first_name + " " + note.created_by.last_name
                    : note.created_by.first_name
                  : ""
              }}
            </p>
            <p class="mb-0 gray fnt-12">
              {{ get_local_route_date(note.created_at) }}
              {{ get_local_route_time(note.created_at) }}
            </p>
          </div>
        </div>
      </div>
      
      <div class="col-2 text-right" v-if="is_editable">
        <span v-b-tooltip.hover title="Edit" @click="editNoteData(note)" class="noteActionbtn"
          ><i class="fa fa-pencil text-primary"></i
        ></span>
        <span
          v-b-tooltip.hover
          title="Delete"
          @click="deleteNote(note._id)"
          class="noteActionbtn"
          ><i class="fa fa-trash text-danger"></i
        ></span>
      </div>
      <div class="col-12 mt-2 comt">
        {{ note.content }}
      </div>
    </div>

    <div class="row no-gutters mt-4" v-if="rows > perPage">
      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
      ></b-pagination>
    </div>
  </div>
  <div v-else class="row no-gutters mt-2 notes-section p-3">
    <div class="col-md-12">
      <span>{{ $t("profile_dashboard.no_notes_found") }} </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notes-listing',
  props: {
    is_editable: { type: Boolean, default: () => false },
    notes: { type: Array, default: () => [], required: true },
  },
  data () {
    return {
      currentPage: 1,
      perPage: 10,
    }
  },
  computed: {
    listOfData () {
      const items = this.notes || []
      return items.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    },
    rows () {
      return (this.notes || []).length || 0
    },
  },
  methods: {
    editNoteData (note) {
      this.$emit('note', note.content)
      this.$emit('note_id', note._id)
    },
    deleteNote (id) {
      this.$emit('deleteNote', id)
    }
  },
}
</script>

<style scoped lang="scss">
</style>
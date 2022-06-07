<template>
  <div class="comment-section" :class="outerClasses">
    <div class="d-flex flex-column">
      <div class="title mb-2">
        <span>
          <img src="@/assets/images/edit-comment.svg" alt />
        </span>
        <strong class="ml-2">{{ $t(label) }}</strong>
      </div>
      <div class="write-comment">
        <!-- <form v-on:submit.prevent="validateBeforeSubmit" autocomplete="off"> -->
        <form v-on:submit.prevent autocomplete="off">
          <textarea
            v-model="note"
            ref="note"
            name="note"
            autocomplete="off"
            cols="30"
            rows="1"
            :placeholder="$t('enter_text_here')"
            class="form-control pl-4 pr-5 py-3"
            v-on:blur="onClickArea"
          ></textarea>
          <!-- v-on:keyup.enter="validateBeforeSubmit" -->
          <!-- :disabled="note ? false : true" -->

          <button
            v-if="!apiProcessing"
            type="button"
            v-on:click="save"
            class="send-icon set-location btn btn-sm btn-primary rounded-circle"
          >
            <img src="@/assets/images/send.svg" alt />
          </button>
          <button
            class="send-icon set-location btn btn-sm btn-primary rounded-circle"
            disabled
            v-else
          >
            <i class="fa fa-spinner fa-spin"></i>
          </button>
          <div class="text-danger" v-if="isTouched && note.length && !note.trim().length">
            the note field is required
          </div>
        </form>
      </div>
      <div class="mt-4">
        <strong v-if="listTitle" class="label-h2 mb-1">{{ $t(listTitle) }}</strong>
        <div
          v-if="!data || (data && data.length == 0)"
          class="no-comments text-center bg-light_blue p-3 mt-2"
        >
          <i>{{ $t("no_record_found") }}</i>
        </div>
        <div v-if="data && data.length > 0">
          <div
            v-for="(noteData, index) in data"
            :key="index"
            class="show-comment mt-2 bg-light_blue"
          >
            <div class="d-flex justify-content-between pt-3 px-3 pb-2">
              <NamePhoto
                :name="noteData.author.fullName"
                :photo="noteData.author.pic"
                :description="noteData.dateTime || moment('D/M/YYYY, h:mm A')"
              />
              <div class="action-bar">
                <button
                  class="shadow-sm btn btn-sm btn-white rounded-circle"
                  v-if="!noteData.flag"
                  @click="openEditor(noteData)"
                >
                  <i class="innov-icon icon-edit info-style-r-center custom-i" />
                </button>
                <button
                  class="shadow-sm ml-3 btn btn-sm btn-white rounded-circle save-action"
                  v-else
                  @click="updateNote(noteData)"
                >
                  <i class="fa fa-floppy-o" aria-hidden="true"></i>
                </button>
                <button
                  class="shadow-sm ml-3 btn btn-sm btn-white rounded-circle"
                  @click="removeNote(noteData)"
                >
                  <img src="@/assets/images/delete.svg" alt />
                </button>
              </div>
            </div>
            <textarea
              v-if="noteData.flag"
              v-model="noteData.note"
              v-validate="'required'"
              ref="update note"
              name="update note"
              :class="{ 'is-invalid': errors.has('update note') }"
              autocomplete="off"
              cols="30"
              rows="6"
              placeholder="Enter Text Here"
              class="form-control edit-textarea"
            ></textarea>
            <!-- v-on:keyup.enter="updateNote" -->
            <div v-if="errors.has('update note')" class="invalid-feedback">
              {{ errors.first("update note") }}
            </div>
            <div v-if="!noteData.flag" class="description px-3 pb-3">
              <!-- <p> -->
              <p class="note-content">{{ noteData.note }}</p>
              <!-- </p> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Comments",
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
      note: "",
      isTouched: false,
      apiProcessing: false
    };
  },
  methods: {
    //  All Need done in Store Management for universal modules
    /**
     * @desc: Add New Role Management and other validator
     * @param: none
     */
    // validateBeforeSubmit() {
    // this.$validator.validateAll().then(result => {
    //   // Custom Checks here
    //   if (result) {
    //     this.save();
    //   } else {
    //     try {
    //       const firstField = Object.keys(this.errors.collect())[0];
    //       this.$refs[`${firstField}`].scrollIntoView({
    //         behavior: "smooth",
    //         block: "end",
    //         inline: "nearest"
    //       });
    //     } catch (ex) {
    //       console.log("Error @ Comments validateBeforeSubmit ", ex);
    //     }
    //   }
    // });
    // },
    addCallBack(response) {
      if (response.statusCode == 200) {
        this.apiProcessing = false;
        this.$props.refreshData();
        this.$notify({
          group: "notify-portal",
          type: "success",
          title: "Information",
          text: "Note posted Successfully."
        });
        this.note = "";
        this.$validator.reset();
      }
    },

    save() {
      if (this.note.length && this.note.trim().length) {
        this.apiProcessing = true;
        let payload = {
          notes: this.note
        };
        this.$props.addNote(payload, this.addCallBack);
        this.isTouched = false;
      } else {
        this.isTouched = true;
      }
    },

    openEditor(note) {
      let index = this.$props.data.findIndex(x => x.id === note.id);
      this.$props.data[index].flag = !this.$props.data[index].flag;
    },

    removeNote(note) {
      this.$props.onDeleteNote(note, this.callBack);
    },

    callBack(response) {
      if (response.statusCode == 200) {
        this.$props.refreshData();
        this.$notify({
          group: "notify-portal",
          type: "success",
          title: "Information",
          text: "Note Removed Successfully."
        });
      }
    },

    upCallBack(response) {
      if (response.statusCode == 200) {
        this.$props.refreshData();
        this.$notify({
          group: "notify-portal",
          type: "success",
          title: "Information",
          text: "Note updated Successfully."
        });
      }
    },

    updateNote(note) {
      console.log(note);
      if (!note.note) {
        this.$notify({
          group: "notify-portal",
          type: "error",
          title: "Invalid Data",
          text: "Note must contain words!"
        });
      } else {
        this.$props.updateNotes(note, this.upCallBack);
      }
    },

    onClickArea() {
      this.isTouched = true;
    }
  }
};
</script>
<style lang="scss" scoped>
// Error
textarea.is-invalid {
  border-color: var(--danger);
}
// .description {
//   word-wrap: break-word;
// }
.note-content {
  word-wrap: break-word;
  white-space: pre-wrap;
}
textarea {
  white-space: pre-wrap;
}
.write-comment {
  position: relative;
  .send-icon.set-location {
    position: absolute;
    top: 0.8rem;
    right: 0.8rem;
  }
}
.action-bar {
  button {
    i {
      font-size: 1rem;
    }
    img {
      height: 1rem;
      width: 1rem;
    }
  }
}
</style>

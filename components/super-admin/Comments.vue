<template>
  <div class="comment-section" :class="outerClasses">
    <div class="row">
      <div class="col-sm-12 title">
        <span>
          <img src="@/assets/images/edit-comment.svg" alt />
        </span>
        <span>{{ label }}</span>
      </div>
      <div class="col-sm-12 custom-input write-comment">
        <form v-on:submit.prevent="validateBeforeSubmit" autocomplete="off">
          <textarea
            v-model="note"
            v-validate="'required'"
            ref="note"
            name="note"
            :class="{ 'is-invalid': errors.has('note') }"
            autocomplete="off"
            cols="30"
            rows="2"
            placeholder="Enter Text Here"
            v-on:keyup.enter="validateBeforeSubmit"
          ></textarea>
          <div v-if="errors.has('note')" class="invalid-feedback">{{ errors.first("note") }}</div>
          <button v-if="!disabled" type="submit" class="send-icon set-location">
            <img src="@/assets/images/send.svg" alt />
          </button>
        </form>
      </div>
      <div class="col-sm-12" v-if="notes.length > 0">
        <p v-if="listTitle" class="label-h2">{{ listTitle }}</p>
        <div v-if="notes.length == 0" class="no-comments text-center">
          <i>No record Found!</i>
        </div>
        <div v-for="(noteData, index) in notes" :key="index" class="show-comment mt-2">
          <div class="comment-user-bar">
            <div class="left">
              <img src="@/assets/images/user.png" alt />
              <div class="name">
                <span>{{ noteData.author.fullName }}</span>
                <span>{{ noteData.dateTime }}</span>
              </div>
            </div>
            <div v-if="!disabled" class="action-bar">
              <button class="ml-2" v-if="!noteData.flag" @click="openEditor(noteData)">
                <i class="innov-icon icon-edit" />
              </button>
              <button class="ml-2 save-action" v-else @click="updateNote(noteData)">
                <i class="fa fa-floppy-o" aria-hidden="true"></i>
              </button>
              <button @click="removeNote(noteData)" class="ml-2">
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
          <div v-if="errors.has('update note')" class="invalid-feedback">
            {{ errors.first("update note") }}
          </div>
          <p v-if="!noteData.flag" class="description">{{ noteData.note }}</p>
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
      default: "Add Notes"
    },
    outerClasses: {
      type: String,
      default: ""
    },
    listTitle: {
      type: String,
      default: "Added Notes"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      note: "",
      apiProcessing: false,
      notes: [
        // {
        //   id: 123,
        //   author: {
        //     fullName: "John Doe",
        //     pic: "user.png"
        //   },
        //   note:
        //     " Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled. type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        //   dateTime: "01/06/2020 08:23 AM",
        //   flag: false
        // }
      ]
    };
  },
  methods: {
    //  All Need done in Store Management for universal modules
    /**
     * @desc: Add New Role Management and other validator
     * @param: none
     */
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        // Custom Checks here
        if (result) {
          this.save();
        } else {
          try {
            const firstField = Object.keys(this.errors.collect())[0];
            this.$refs[`${firstField}`].scrollIntoView({
              behavior: "smooth",
              block: "end",
              inline: "nearest"
            });
          } catch (ex) {
            console.log("Error @ Comments validateBeforeSubmit ", ex);
          }
        }
      });
    },
    save() {
      this.apiProcessing = true;
      this.processing = false;
      // Just for show use in Vuex
      let payloadResponse = {
        id: Math.floor(Math.random() * 200),
        author: {
          fullName: "John Doe",
          pic: "user.png"
        },
        dateTime: "01/06/2020 01:43 PM",
        flag: false,
        note: this.note
      };
      console.log(payloadResponse);
      this.notes.unshift(payloadResponse);

      this.$notify({
        group: "notify-portal",
        type: "success",
        title: "Information",
        text: "Note posted Successfully."
      });
      this.note = "";
      this.$validator.reset();
    },
    openEditor(note) {
      let index = this.notes.findIndex(x => x.id === note.id);
      this.notes[index].flag = !this.notes[index].flag;
    },
    removeNote(note) {
      this.notes.splice(
        this.notes.findIndex(x => x.id === note.id),
        1
      );
      this.$notify({
        group: "notify-portal",
        type: "success",
        title: "Information",
        text: "Note Removed Successfully."
      });
    },
    updateNote(note) {
      if (!note.note) {
        this.$notify({
          group: "notify-portal",
          type: "error",
          title: "Invalid Data",
          text: "Note must contain words!"
        });
      } else {
        let index = this.notes.findIndex(x => x.id === note.id);
        this.notes[index].flag = !this.notes[index].flag;
        this.$notify({
          group: "notify-portal",
          type: "success",
          title: "Information",
          text: "Note updated Successfully."
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// Error
textarea.is-invalid {
  border-color: #dc3545;
}
</style>

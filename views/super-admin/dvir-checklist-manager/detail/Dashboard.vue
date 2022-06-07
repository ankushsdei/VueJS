<template>
  <div
    class="tab-pane fade show active email-template"
    id="Dashboard"
    role="tabpanel"
  >
    <div class="info-content-tab custom-info-content-tab">
      <div
        class="tabs-content mb-2"
        v-for="(item, index) in dvirChecklistInfo.category"
        :key="index"
      >
        <h2>
          <span v-if="!item.edit">
            <i aria-hidden="true" class="fa fa-check"></i
            >{{ item.category | capitalize }}
          </span>
          <div v-if="item.edit" class="col-md-4 col-sm-6 text-left responsive-mt-4">
            <div
              class="custom-input d-flex align-items-center green-custom-input input-with-cross"
            >
              <select
                v-validate="'required'"
                v-model="item.category"
                class="form-control"
              >
                <option
                  v-for="(opItem, index) in categoryList.filter(
                    (cat) =>
                      !dvirChecklistInfo.category
                        .map((dCat) => dCat.category)
                        .filter((fCat) => fCat !== item.category)
                        .includes(cat.value)
                  )"
                  :key="index + '_' + item.category"
                  :value="opItem.value"
                >
                  {{ opItem.value | capitalize }}
                </option>
              </select>
            </div>
          </div>
          <span>
            <button
              v-if="item.edit"
              @click="saveProfile(item)"
              class="transp-btn icon-green"
            >
              <i aria-hidden="true" class="fa fa-floppy-o"></i>
            </button>
            <button v-if="!item.edit" @click="onEdit(item)" class="transp-btn icon-green">
              <img src="@/assets/images/edit-bl.svg" alt="" />
            </button>
          </span>
        </h2>
        <div class="tabs-inner-content">
          <div class="row">
            <div
              class="col-md-4 col-sm-6"
              v-for="(it, sIndex) of item.items"
              :key="sIndex"
            >
              <p class="inner-p">
                <label v-if="!item.edit">{{ it.name }}</label>
              </p>
              <div v-if="item.edit" class="custom-input mb-2">
                <input
                  type="text"
                  :placeholder="$t('dvir.item_name')"
                  :name="'itemName' + sIndex"
                  autocomplete="off"
                  class="form-control"
                  v-model="it.name"
                  v-validate="'required'"
                  :ref="'itemName' + sIndex"
                  :class="{ 'is-invalid': errors.has('itemName' + sIndex) }"
                />
                <div
                  v-if="errors.has('Currency Short Code')"
                  class="invalid-feedback"
                >
                  {{ errors.first("Currency Short Code") }}
                </div>
              </div>
              <p v-if="!item.edit" class="mb-0">
                Critical Level - {{ it.critical_leval | capitalize }}
              </p>
              <div v-if="item.edit" class="custom-input mb-2">
                <select
                  v-validate="'required'"
                  v-model="it.critical_leval"
                  class="form-control"
                >
                  <option
                    v-for="(item, index) in criticalLevelList"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.value | capitalize }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Comments Component -->
      <template v-if="notes !== undefined">
        <Comments
          code="dvir_management"
          :data="notes"
          :onDeleteNote="onDeleteNote"
          :addNote="add"
          :updateNotes="onUpdateNotes"
          :refreshData="initData"
        />
      </template>
    </div>
  </div>
</template>
<script>
import Comments from "@/components/Comments";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "SAETMAdminDetailDashboard",
  components: {
    Comments,
  },
  data() {
    return {
      dvirChecklistId: "",
    };
  },
  watch: {
    dvirChecklistId() {
      this.initData();
    },
  },
  mounted() {
    this.dvirChecklistId = this.$route.params.id;
    this.checklistById(this.$route.params.id);
    this.getCategoryList();
    this.getCriticalLevelList();
    this.initData();
  },
  computed: {
    ...mapGetters({
      notes: "saDVIRChecklistManager/getChecklistNotes",
      dvirChecklistInfo: "saDVIRChecklistManager/getDVIRCheckListInfo",
      categoryList: "saDVIRChecklistManager/getCategories",
      criticalLevelList: "saDVIRChecklistManager/getCriticalLevel",
    }),
  },
  methods: {
    /**
     * Map Actions
     */
    ...mapActions({
      fetchNotes: "saDVIRChecklistManager/fetchNotes",
      removeNotes: "saDVIRChecklistManager/removeNotes",
      addNote: "saDVIRChecklistManager/addNote",
      updateNotes: "saDVIRChecklistManager/updateNotes",
      getCategoryList: "saDVIRChecklistManager/getCategoryList",
      checklistById: "saDVIRChecklistManager/getChecklistById",
      getCriticalLevelList: "saDVIRChecklistManager/getCriticalLevelList",
      createDvirChecklist: "saDVIRChecklistManager/createDvirChecklist",
    }),

    /**
     * Init Data
     */
    initData() {
      this.$nprogress.start();
      let payload = {
        dvir_id: parseInt(this.dvirChecklistId),
        module: "saEmailTemplateManagerIdDashboard",
        page: 1,
        limit: 10,
      };
      this.fetchNotes(payload).then(() => {
        this.$nprogress.done();
      });
    },
    onEdit(item) {
      item.edit = !item.edit;
    },
    async saveProfile(item) {
      let result = this.$validator.validateAll();
      if (result) {
        try {
          this.processing = true;
          let data = {
            name: this.dvirChecklistInfo.name,
            lang: this.dvirChecklistInfo.lang.id,
            effective_date: this.dvirChecklistInfo.effective_date,
            category: this.dvirChecklistInfo.category,
            // id: this.dvirChecklistInfo.id
          };
          let response = await this.createDvirChecklist({
            body: data,
            id: this.$route.params.id,
          });
          if (response && response.statusCode == 200) {
            item.edit = !item.edit;
            this.$notify({
              group: "notify-portal",
              type: "success",
              title: "Information",
              text: "DVIR Checklist Updated Successfully.",
            });
          } else {
            this.$notify({
              group: "notify-portal",
              type: "error",
              title: "Information",
              text: "Some error occurred. Please try again.",
            });
          }
        } catch (error) {
          console.log(error);
          this.$notify({
            group: "notify-portal",
            type: "error",
            title: "Information",
            text: "Some error occurred. Please try again.",
          });
        } finally {
          this.processing = false;
        }
      }
    },

    /**
     * Delete Notes
     * @param note
     * @param callBack
     */
    onDeleteNote(note, callBack) {
      let payload = {
        id: note.id,
      };
      this.removeNotes(payload).then((response) => {
        response.note = note;
        callBack(response);
      });
    },

    /**
     * Add Notes
     * @param payload
     * @param callBack
     */
    add(payload, callBack) {
      payload.module = "dvir";
      payload.dvir_id = this.dvirChecklistId;
      this.addNote(payload).then((response) => {
        callBack(response);
      });
    },

    /**
     * Update Notes
     * @param payload
     * @param callBack
     */
    onUpdateNotes(payload, callback) {
      payload.module = "dvir";
      payload.dvir_id = parseInt(this.dvirChecklistId);
      this.updateNotes(payload).then((response) => {
        callback(response);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>

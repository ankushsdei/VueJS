<template>
   <div class="admin-account-list w-100">
      <div class="d-flex page-action-header justify-content-between">
         <breadcrumb :breadcrumbs="breadcrumbs" />
      </div>
      <div class="form-container">
         <div class="new-role-container">
            <div class="profile-info">
               <div class="inner-content pad0">
                  <div class="role-inner-container">
                     <div class="head1">{{ $t("dvir.new_checklist") }}</div>
                     <div class="role-inner-content">
                        <form v-on:submit.prevent>
                           <div class="row mt-2 mb-3">
                              <div class="col-md-4 col-sm-6 text-left">
                                 <label>{{ $t("name") }}</label>
                                 <div class="custom-input">
                                    <input
                                       name="name"
                                       class="form-control"
                                       type="text"
                                       :placeholder="$t('admin_portal.enter_name_here')"
                                       v-model="dvirChecklistInfo.name"
                                       v-validate="'required'"
                                       ref="name"
                                       :class="{ 'is-invalid': errors.has('name') }"
                                       autocomplete="off"
                                       />
                                 </div>
                              </div>
                           </div>
                           <div v-for="(item, index) of dvirChecklistInfo.category" :key="index">
                              <div class="row custom-gutter mb-3">
                                 <div class="col-md-4 col-sm-6 text-left responsive-mt-4">
                                    <label>{{ $t("select_categories") }}</label>
                                    <div
                                       class="custom-input d-flex align-items-center green-custom-input input-with-cross"
                                       >
                                      <select
                                          v-validate="'required'"
                                          :name="'category' +index"
                                          :ref="'category' +index"
                                          :class="{ 'is-invalid': errors.has('category' +index) }"
                                          v-model="item.category"
                                          class="form-control"
                                       >
                                          <!-- v-for="(item, index) in getCategory(item.category)" -->
                                          <option
                                             v-for="(opItem, index) in categoryList.filter(
                                             cat =>
                                                !dvirChecklistInfo.category
                                                   .map(dCat => dCat.category)
                                                   .filter(fCat => fCat !== item.category)
                                                   .includes(cat.value)
                                             )"
                                             :key="index + '_' + item.category"
                                             :value="opItem.value"
                                          >
                                             {{ opItem.value | capitalize }}
                                          </option>
                                       </select>
                                       <span @click="addCategory()" class="pl-3" style="cursor: pointer">
                                          <img  src="@/assets/images/round-add.svg" alt="" />
                                       </span>
                                       <span
                                          v-if="index > 0"
                                          class="pl-3"
                                          @click="removeCategory(index)"
                                          >
                                          <img src="@/assets/images/delete-cross.svg" alt="" />
                                       </span>
                                    </div>
                                 </div>
                              </div>
                              <div
                                 class="row custom-gutter mb-3"
                                 v-for="(itms, ind) of item.items"
                                 :key="ind"
                                 >
                                 <div class="col-md-12">
                                    <div class="row custom-width custom-drag-row-rep">
                                       <div class="col-md-11 col-11">
                                          <div class="draggable-row">
                                             <div class="row align-items-center rowfordrags">
                                                <div class="col-md-1 col-1 drag-column">
                                                   <div class="drag-handle">
                                                      <img src="@/assets/images/drag-icon.svg" />
                                                   </div>
                                                </div>
                                                <div class="col-md-11 col-11">
                                                   <div class="row custom-gutter">
                                                      <div class="col-md-4 col-sm-6 text-left responsive-mt-4">
                                                         <label>{{ $t("dvir.item_name") }}</label>
                                                         <div class="custom-input">
                                                            <input
                                                               type="text"
                                                               :placeholder="$t('dvir.item_name')"
                                                               :name="'itemName' + ind"
                                                               autocomplete="off"
                                                               class="form-control"
                                                               v-model="itms.name"
                                                               v-validate="'required'"
                                                               :ref="'itemName' + ind"
                                                               :class="{
                                                               'is-invalid': errors.has('itemName' + ind)
                                                               }"
                                                               />
                                                         </div>
                                                      </div>
                                                      <div class="col-md-4 col-sm-6 text-left responsive-mt-4">
                                                         <label>{{ $t("dvir.critical_level") }}</label>
                                                         <div class="custom-input">
                                                            <select
                                                               v-validate="'required'"
                                                               v-model="itms.critical_leval"
                                                               :name="'critical_leval' +index"
                                                               :ref="'critical_leval' +index"
                                                               :class="{ 'is-invalid': errors.has('critical_leval' +index) }"
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
                                                      <div class="col-12">
                                                         <div class="row p-10">
                                                            <div class="col-lg-3 col-md-12 col-sm-12 text-left responsive-mt-4">
                                                               <label>{{ $t("dvir.select_icon") }}</label>
                                                               <div class="custom-input hide-height-iconinput">
                                                                  <multiselect
                                                                     v-model="itms.icon"
                                                                     :placeholder="$t('dvir.select_icon')"
                                                                     label="Icon"
                                                                     :options="iconList"
                                                                     :searchable="false"
                                                                     :show-labels="false"
                                                                     :hideSelected="true"
                                                                     v-validate="'required'"
                                                                     v-bind:name="'icon'"
                                                                     v-bind:ref="'icon'"
                                                                     class="drop-multiselect-auth-img"
                                                                     :class="{ 'is-invalid': errors.has('icon') }"
                                                                     >
                                                                     <template slot="singleLabel" slot-scope="props">
                                                                        <img
                                                                           class="option__image"
                                                                           :src="props.option"
                                                                           alt=""
                                                                           />
                                                                     </template>
                                                                     <template slot="option" slot-scope="props">
                                                                        <img
                                                                           class="option__image"
                                                                           :src="props.option"
                                                                           alt=""
                                                                           />
                                                                     </template>
                                                                  </multiselect>
                                                               </div>
                                                            </div>
                                                            <div class="col-lg-3 col-md-12 col-sm-12 text-left responsive-mt-4">
                                                               <label>{{ $t("dvir.icon") }} (24x24 px)</label>
                                                               <div class="custom-input customdropdown-iconinput">
                                                                  <input
                                                                     accept="image/jpeg, image/jpeg, image/png"
                                                                     @change="chosenFiles($event, index, ind)"
                                                                     type="file"
                                                                     :ref="'fileInput' + index + ind"
                                                                     name="img[]"
                                                                     class="file"
                                                                     />
                                                                  <div class="input-group">
                                                                     <input
                                                                        v-model="itms.icon"
                                                                        disabled
                                                                        type="text"
                                                                        name="Icon"
                                                                        autocomplete="off"
                                                                        class="form-control"
                                                                        v-validate="''"
                                                                        :ref="'icon' + index + ind"
                                                                        :class="{
                                                                        'is-invalid': errors.has('icon' + index + ind)
                                                                        }"
                                                                        />
                                                                     <div class="input-group-append">
                                                                        <button
                                                                           @click="
                                                                           triggerFileClick('fileInput' + index + ind)
                                                                           "
                                                                           class="browse-btn input-group-text btn"
                                                                           id="basic-addon2"
                                                                           >
                                                                        Browse
                                                                        </button>
                                                                     </div>
                                                                  </div>
                                                               </div>
                                                            </div>
                                                            <div class="col-lg-3 col-md-12 col-sm-12 text-left responsive-mt-4">
                                                               <label>{{ $t("dvir.select_icon") }}</label>
                                                               <div class="custom-input">
                                                                  <multiselect
                                                                     v-model="itms.large_icon"
                                                                     :placeholder="$t('dvir.select_icon')"
                                                                     label="Icon"
                                                                     :options="iconList"
                                                                     :searchable="false"
                                                                     :show-labels="false"
                                                                     :hideSelected="true"
                                                                     v-validate="'required'"
                                                                     v-bind:name="'large_icon'"
                                                                     v-bind:ref="'large_icon'"
                                                                     class="drop-multiselect-auth-img"
                                                                     :class="{ 'is-invalid': errors.has('large_icon') }"
                                                                     >
                                                                     <template slot="singleLabel" slot-scope="props">
                                                                        <img
                                                                           class="option__image"
                                                                           :src="props.option"
                                                                           alt=""
                                                                           />
                                                                     </template>
                                                                     <template slot="option" slot-scope="props">
                                                                        <img
                                                                           class="option__image"
                                                                           :src="props.option"
                                                                           alt=""
                                                                           />
                                                                     </template>
                                                                  </multiselect>
                                                               </div>
                                                            </div>
                                                            <div class="col-lg-3 col-md-12 col-sm-12 text-left responsive-mt-4">
                                                               <label>{{ $t("dvir.large_icon") }} (64x64 px for mobile app)</label>
                                                               <div class="custom-input">
                                                                  <input
                                                                     accept="image/jpeg, image/jpeg, image/png"
                                                                     :ref="'fileInput2' + index + ind"
                                                                     @change="chooseLargeIcon($event, index, ind)"
                                                                     type="file"
                                                                     name="img[]"
                                                                     class="file"
                                                                     />
                                                                  <div class="input-group">
                                                                     <input
                                                                        type="text"
                                                                        disabled
                                                                        autocomplete="off"
                                                                        class="form-control"
                                                                        v-model="itms.large_icon"
                                                                        v-validate="''"
                                                                        :ref="'largeIcon' + index + ind"
                                                                        :class="{
                                                                        'is-invalid': errors.has(
                                                                        'largeIcon' + index + ind
                                                                        )
                                                                        }"
                                                                        />
                                                                     <div class="input-group-append">
                                                                        <button
                                                                           @click="
                                                                           triggerFileClick('fileInput2' + index + ind)
                                                                           "
                                                                           class="browse-btn input-group-text btn"
                                                                           id="basic-addon2"
                                                                           >
                                                                        Browse
                                                                        </button>
                                                                     </div>
                                                                  </div>
                                                               </div>
                                                            </div>
                                                         </div>
                                                      </div>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                       <div class="col-md-1 col-1">
                                          <div class="drag-row-action flex-column ">
                                             <span @click="addItem(index)" style="cursor: pointer">
                                             <img src="@/assets/images/round-add.svg" alt="" />
                                             </span>
                                             <span
                                                v-if="ind > 0"
                                                class="mt-2"
                                                @click="removeItem(index, ind)"
                                                >
                                             <img  src="@/assets/images/delete-cross.svg" alt="" />
                                             </span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div class="row custom-gutter mb-3">
                              <div class="col-md-4 col-sm-6 text-left responsive-mt-4">
                                 <label>{{ $t("effective_date") }} </label>
                                 <datepicker
                                    v-model="dvirChecklistInfo.effective_date"
                                    class="custom-input"
                                    name="effective_date"
                                    ref="effective_date"
                                    v-validate="'required'"
                                    :class="{ 'is-invalid': errors.has('effective_date') }"
                                    format="dd/MM/yyyy"
                                    autocomplete="off"
                                    ></datepicker>
                              </div>
                              <div class="col-md-4 col-sm-6 text-left responsive-mt-4">
                                 <label>{{ $t("language") }}</label>
                                 <multiselect
                                    v-model="dvirChecklistInfo.lang"
                                    :placeholder="$t('select_language')"
                                    label="Language"
                                    track-by="id"
                                    :options="languages"
                                    :searchable="false"
                                    :show-labels="false"
                                    v-validate="'required'"
                                    v-bind:name="'lang'"
                                    v-bind:ref="'lang'"
                                    class="drop-multiselect-auth-img"
                                    :class="{ 'is-invalid': errors.has('lang') }"
                                    >
                                    <template slot="singleLabel" slot-scope="props">
                                       <span class="option__desc">
                                       <span class="option__title">{{ props.option.value | capitalize }}</span>
                                       </span>
                                    </template>
                                    <template slot="option" slot-scope="props">
                                       <div class="option-wrapper">
                                          <span class="option__title">{{ props.option.value | capitalize }}</span>
                                       </div>
                                    </template>
                                 </multiselect>
                              </div>
                           </div>
                        </form>
                        <div class="site-primary-btn">
                           <button
                              @click="cancelUpdate()"
                              class="btn btn-danger`"
                              :disabled="processing"
                              style="margin-right: 15px"
                              >
                           {{ $t("cancel") }}
                           </button>
                           <button :disabled="processing" @click="saveDvirChecklist()" class="btn">
                           <span v-if="dvirChecklistInfo.id">{{
                           processing ? "Processing..." : $t("update")
                           }}</span>
                           <span v-else>{{ processing ? "Processing..." :  $t("create") }}</span>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Datepicker from "vuejs-datepicker";
export default {
  name: "SADCMAdminAdd",
  components: {
    Datepicker
  },
  props: {},
  data() {
    return {
      url: null,
      iconList: [
        "https://wiot-fleet-assets.s3.me-south-1.amazonaws.com/289101-1612357153021.png",
        "https://wiot-fleet-assets.s3.me-south-1.amazonaws.com/60650-1612357204787.png",
        "https://wiot-fleet-assets.s3.me-south-1.amazonaws.com/301206-1612421888663.png",
        "https://wiot-fleet-assets.s3.me-south-1.amazonaws.com/305856-1612422020532.png",
        "https://wiot-fleet-assets.s3.me-south-1.amazonaws.com/240045-1612422063114.png",
        "https://wiot-fleet-assets.s3.me-south-1.amazonaws.com/119393-1612422193956.png",
        "https://wiot-fleet-assets.s3.me-south-1.amazonaws.com/206747-1612422240658.png",
        "https://wiot-fleet-assets.s3.me-south-1.amazonaws.com/375898-1612422277974.png",
        "https://wiot-fleet-assets.s3.me-south-1.amazonaws.com/375345-1612422334233.png",
        "https://wiot-fleet-assets.s3.me-south-1.amazonaws.com/136440-1612422364348.png",
        "https://wiot-fleet-assets.s3.me-south-1.amazonaws.com/439875-1612422410217.png"
      ],
      breadcrumbs: [
        {
          title: "dashboard_name",
          link: "super-admin-portal/dashboard",
          active: true
        },
        {
          title: "DVIR Checklist",
          link: "super-admin-portal/dvir-checklist-manager",
          active: true
        },
        {
          title: "Add New Checklist",
          link: "super-admin-portal/dvir-checklist-manager/add",
          active: false
        }
      ],
      role: {
        name: "",
        modules: []
      },
      processing: false
    };
  },
  computed: {
    ...mapGetters({
      dvirChecklistInfo: "saDVIRChecklistManager/getDVIRCheckListInfo",
      languages: "saDVIRChecklistManager/getLanguages",
      categoryList: "saDVIRChecklistManager/getCategories",
      criticalLevelList: "saDVIRChecklistManager/getCriticalLevel"
    })
  },
  mounted() {
    // this.$root.TabSwitcher = customRoute => {
    //   this.openTabSection(customRoute);
    // };
    this.$validator.reset();
    this.resetAssistantModel();
    this.getCategoryList();
    this.getCriticalLevelList();
    this.$root.validateBasicInfo = async () => {
      return await this.validateBeforeSubmit();
    };
  },
  methods: {
    ...mapActions({
      getCategoryList: "saDVIRChecklistManager/getCategoryList",
      getCriticalLevelList: "saDVIRChecklistManager/getCriticalLevelList",
      createDvirChecklist: "saDVIRChecklistManager/createDvirChecklist",
      commonUploadImage: "saDVIRChecklistManager/commonUploadImage",
      resetAssistantModel: "saDVIRChecklistManager/resetAssistantModel"
    }),
    addCategory() {
      this.dvirChecklistInfo.category.push({
        category: "",
        items: [
          {
            name: "",
            critical_leval: "",
            icon: "",
            large_icon: ""
          }
        ]
      });
    },
    cancelUpdate() {
      this.resetAssistantModel();
      this.$router.push({ path: "/super-admin-portal/dvir-checklist-manager" });
    },
    removeCategory(index) {
      this.dvirChecklistInfo.category.splice(index, 1);
    },
    addItem(index) {
      this.dvirChecklistInfo.category[index].items.push({
        name: "",
        critical_leval: "",
        icon: "",
        large_icon: ""
      });
    },
    removeItem(index,ind) {
      this.dvirChecklistInfo.category[index].items.splice(ind, 1);
    },
    redirectToList() {
      this.$router.push({ path: "/super-admin-portal/dvir-checklist-manager" });
    },
    triggerFileClick(ref) {
      this.$refs[ref][0].click();
    },
    chosenFiles(event, index, ind) {
      this.readAndPreview(event.target.files[0], index, ind);
    },
    chooseLargeIcon(event, index, ind) {
      this.dvirChecklistInfo.category[index].items[ind].large_icon = this.url;
      this.readAndPreview2(event.target.files[0], index, ind);
    },
    readAndPreview(file, index, ind) {
      const reader = new FileReader();
      reader.onload = () => {
        this.commonUploadImage({ file: reader.result }).then(response => {
          this.dvirChecklistInfo.category[index].items[ind].icon = response.Location;
        });
      };
      reader.readAsDataURL(file);
    },
    readAndPreview2(file, index, ind) {
      const reader = new FileReader();
      reader.onload = () => {
        this.commonUploadImage({ file: reader.result }).then(response => {
          this.dvirChecklistInfo.category[index].items[ind].large_icon = response.Location;
        });
      };
      reader.readAsDataURL(file);
    },
    async saveDvirChecklist() {
      console.log(this.$validator);
      let result = await this.$validator.validateAll();
      if (result) {
        try {
         this.processing = true;
          let data = {
            // id: "",
            name: this.dvirChecklistInfo.name,
            lang: this.dvirChecklistInfo.lang ? this.dvirChecklistInfo.lang.value : "",
            // lang: this.dvirChecklistInfo.lang ? this.dvirChecklistInfo.lang.id : "",
            effective_date: this.dvirChecklistInfo.effective_date
              ? this.dvirChecklistInfo.effective_date
              : "",
            category: this.dvirChecklistInfo.category
          };
          console.log(this.dvirChecklistInfo.category);
          let resp = await this.createDvirChecklist({ body: data });
          if (resp && resp.statusCode == 200) {
            this.resetAssistantModel();
            this.processing = false;
            this.$notify({
              group: "notify-portal",
              type: "success",
              title: "Information",
              text: "DVIR Checklist Added Successfully."
            });
            this.redirectToList();
          } else {
            this.$notify({
              group: "notify-portal",
              type: "error",
              title: "Information",
              text: "Some error occurred. Please try again."
            });
          }
        } catch (error) {
          console.log(error);
          this.$notify({
            group: "notify-portal",
            type: "error",
            title: "Information",
            text: "Some error occurred. Please try again."
          });
        }
      } else {
        // const firstField = Object.keys(this.errors.collect())[0];
        // this.$refs[`${firstField}`].scrollIntoView({
        //   behavior: "smooth",
        //   block: "end",
        //   inline: "nearest"
        // });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.fnt-15 {
  font-size: 15px;
}
.arrow-red {
  .icon-add-plus:before {
    color: #da4336;
  }
}
.icon-add-plus:before {
  color: #2abed5;
}
.pad-left-15 {
  padding-left: 15px;
}
.browse-btn {
  background: #2abed5 !important;
  color: #fff;
  font-size: 14px !important;
}
</style>

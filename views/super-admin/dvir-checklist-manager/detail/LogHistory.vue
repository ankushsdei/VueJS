<template>
  <div class="tab-pane fade show active" id="Module2" role="tabpanel">
    <div class="info-content-tab">
      <div class="log-history-tab">
        <h2 class="main-heading1"><img src="@/assets/images/clock1.svg" />Log History Details</h2>
        <div v-if="logHistory.length > 0">
          <div v-for="(dateData, index) in logHistory" :key="index" class="w-100">
            <h2 class="center-text-h2">
              <span>{{ dateData.date }}</span>
            </h2>
            <div
              v-for="(dateActivities, index) in dateData.data"
              :key="index"
              class="log-history-main"
            >
              <div class="history1-sec text-left">
                <span>
                  <i class="fa fa-check" aria-hidden="true"></i>
                </span>
                
                <h2>{{ dateActivities.title }}</h2>
                <p>{{ dateActivities.dateTime }}</p>
              </div>
              <div class="history2-sec">
                <div class="accordion" id="accordionExample">
                  <div class="card">
                    <div class="card-header" id="headingOne">
                      <div
                        class="history-collapse"
                        data-toggle="collapse"
                        :data-target="'#collapseOne' + dateActivities.id"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        <div class="his-col1 d-flex align-items-center">
                         
                          <img :src="dateActivities.author.pic" />
                          <span>{{ dateActivities.author.fullName }} -
                            {{ dateActivities.type == 1 ? $t("log_history_tab.below_data_added"): $t("log_history_tab.below_data_changed") }}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      :id="'collapse-' + dateActivities.id"
                      class="collapse show"
                      aria-labelledby="headingOne"
                      data-parent="#accordionExample"
                    >
                      <div class="card-body">
                        <div class="history-collapse-data">
                          <h2>Activity</h2>
                          <div v-for="(activity, index) in dateActivities.activities" :key="index">
                            <div class="field-name">
                              <h2 class="collapse-heading-inner">{{ activity.field_name }}</h2>
                            </div>

                            <div class="w-100 history-collapse-main">
                              <div v-if="dateActivities.type != 1" class="history-collapse1">{{ activity.old_Value }}</div>
                              <div v-if="dateActivities.type != 1" class="history-collapse2">
                                <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
                              </div>
                              <div v-if="['Icon','Large Icon','Created By', 'Updated By'].includes(activity.field_name)" class="history-collapse1"><div v-html="activity.new_value"></div></div>
                              <div v-else class="history-collapse1">{{ activity.new_value }}</div>
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
          <div class="admin-new-pagination role-table-pagination">
            <b-pagination
              v-model="page"
              :total-rows="logHistoryCount"
              @change="fetchLogHistory($event)"
              :per-page="itemPerPage"
            ></b-pagination>
          </div>
        </div>
        <div v-else class="no-history text-center">
          <i>No History Found!</i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { getLogHistoryItemPerPage } from "@/plugins/commonSettings.js";

export default {
  name: "SAETMAdminDetailLogHistory",
  data() {
    return {
      dvirCheckListId: "",
      module: "dvir",
      page: 1,
      limit: getLogHistoryItemPerPage(),
      itemPerPage:getLogHistoryItemPerPage()
    };
  },
  computed: {
    ...mapGetters({
      logHistory: "saDVIRChecklistManager/getDvirChecklistLogHistory",
      logHistoryCount: "saDVIRChecklistManager/getDvirChecklistLogHistoryCount"
    })
  },
  watch: {},
  mounted() {
    this.dvirCheckListId = this.$route.params.id;
    this.initData();
  },
  methods: {
    ...mapActions({
      getLogHistory: "saDVIRChecklistManager/getLogHistory"
    }),
   initData() {
      this.fetchLogHistory();
    },

    fetchLogHistory(page) {
      if (page) {
        this.page = page;
      }
      let data = {
        id: this.dvirCheckListId,
        body: { module: this.module, page: this.page, limit: this.limit }
      };
      this.getLogHistory(data);
    }
  }
};
</script>
<style scoped></style>

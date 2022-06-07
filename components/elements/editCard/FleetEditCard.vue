<template>
  <div class="card">
    <div
      class="card-header d-flex justify-content-between align-items-center"
      :class="headerClass"
    >
      <div style="text-transform: none">
        <slot name="header"></slot>
      </div>
      <div>
        <i
          class="saver fa fa-pencil"
          v-if="!editing && !editOnly"
          @click="toggleEdit"
        ></i>
        <i
          class="saver fa fa-save"
          v-else-if="editing && !editOnly"
          @click="
            $emit('update', true);
            toggleEdit();
          "
        ></i>
        <span
          class="ml-3"
          v-if="addMore && (editing || editOnly)"
          @click="$emit('add', true)"
        >
          <img :src="require('@/assets/images/plus-1.svg')" alt="+" />
        </span>
      </div>
    </div>
    <div class="card-body" :class="bodyClass">
      <div class="row">
        <div
          :class="item.class || divisionClass"
          v-for="(item, index) in curr"
          :key="index"
        >
          <EditCardItem
            :item="item"
            @updated="update($event, index)"
            :editMode="editing || editOnly"
            @deleteItem="deleteItem(index)"
            ref="editCard"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditCardItem from "./EditCardItem.vue";
export default {
  components: {
    EditCardItem,
  },
  props: {
    headerClass: {
      type: String,
      default: () => "",
    },
    bodyClass: {
      type: String,
      default: () => "",
    },
    divisionClass: {
      type: String,
      default: () => "col-12",
    },
    details: {
      type: Array,
      required: true,
    },
    editOnly: {
      type: Boolean,
      default: () => false,
    },
    addMore: {
      type: Boolean,
      default: () => false,
    },
  },
  watch: {
    details: {
      immediate: true,
      deep: true,
      handler() {
        this.curr = this.details;
      },
    },
  },
  data() {
    return {
      curr: [],
      editing: false,
    };
  },
  methods: {
    validateInnerComponents() {
      console.log("its", this.$refs.editCard);
      // this.$refs.editCard[0].tmp();
      this.$refs.editCard.forEach((element) => {
        element.validateFields();
      });
    },

    update(details, index) {
      if(details.name === "seat_belts")
      {
        this.curr.forEach((item,i) => {
          item.name === "seat_belt_count" && details.value == "1" ? this.curr[i].showData = true : this.curr[i].showData = false; 
        });
      }
      this.$emit(
        "update:details",
        this.curr.map((d, i) => (i === index ? details : d))
      );
    },
    toggleEdit() {
      if (this.editing) {
        // save the data in api
      }
      this.editing = !this.editing;
    },
    deleteItem(index) {
      if (this.editing || this.editOnly)
        this.$emit(
          "update:details",
          this.curr.filter((d, i) => i !== index)
        );
    },
  },
};
</script>

<style scoped lang="scss">
.saver {
  cursor: pointer;
}
</style>

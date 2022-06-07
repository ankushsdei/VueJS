<template>

  <div class="edit-card-item" v-if="!editMode" :class="[item.name == 'seat_belt_count' && !item.showData ? 'd-none' : '']">
    <label class="mb-0 text-muted">{{ item.label }}</label>
    <div>
      {{ item.name != "fuel_type" ? item.name != 'transmission'? value: value == 2 ? "Manual": "Automatic" : value == 1 ? 'Petrol': value == 2 ? 'Diesel': 'Gas' }} {{ item.units }} 
      <i class="ml-1 custom-i" :class="item.icon"></i>
    </div>
  </div>
  <div v-else :class="[item.name == 'seat_belt_count' && !item.showData ? 'd-none' : '']">
    <label>
      <i class="mr-1 custom-i" :class="item.icon"></i>
      {{ item.label }}
      <span v-if="item.required" class="text-danger">*</span>
    </label>

    <div class="d-flex align-items-center">
      <div :class="item.units ? `input-group input-group-sm` : 'w-100'">
        <select
          class="form-control forn-control-sm"
          v-if="item.type == 'toggle'"
          v-model="data"
          @change="changed()"
        >
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
        <select
          class="form-control form-control-sm"
          v-if="item.type == 'select'"
          v-model="data"
          :name="item.label"
          :ref="item.label"
          v-validate="item.required ? 'required' : ''"
          :class="{ 'is-invalid': errors.has(item.label) }"
          @change="changed(); changedtwo($event,$event.target.selectedIndex)"
        >
          <option
            v-for="(option, key, index) in item.options"
            :key="index"
            :value="option.id"
            :data-id="option.name"
          >
            {{ option.name }}
          </option>
        </select>
        <input
          :type="item.type"
          step="any"
          class="form-control form-control-sm"
          v-else-if="is_input"
          v-model="data"
          v-show="show_seat_belt_count"
          :name="item.label"
          :ref="item.label"
          v-validate="item.required ? 'required' : ''"
          :class="{ 'is-invalid': errors.has(item.label) }"
          @input="changed()"
          @change="changed()"
        />
        <div class="input-group-append" v-if="item.units">
          <span class="input-group-text">{{ item.units }}</span>
        </div>
      </div>
      <button
        class="btn py-0 btn-transparent"
        @click="$emit('deleteItem', true)"
        v-if="item.removable"
      >
        <span class="text-danger fa fa-trash"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    editMode: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  watch: {
    item: {
      immediate: true,
      deep: true,
      handler() {
        this.data = this.item.value;
      },
    },
  },
  mounted() {
    // this.$validator.validateAll();
    console.log("the this1", this);

    console.log("the v main", this.$validator);
  },
  data() {
    return {
      data: "",
      show_seat_belt_count:true,
    };
  },
  computed: {
    value() {
      switch (this.item.type) {
        case "toggle":
          return this.item.value ? "Yes" : "No";
      }
      return this.item.value;
    },
    is_input() {
      switch (this.item.type) {
        case "input":
        case "input-text":
        case "input-number":
        case "text":
        case "number":
        case "color":
          return true;
      }
      return false;
    },
  },
  methods: {
    validateFields() {
      // console.log("in 2 ", await this.$validator.validate());
      // console.log("in 2 ", await this.$validator.validate());
      console.log("ya");
      this.$validator.validateAll();
      console.log("the this2", this);
      console.log("other v", this.$validator);
    },

    changed() {
      this.$emit("updated", {
        ...this.item,
        value: this.data,
      });
    },
    changedtwo(event,selectedIndex) {
      if(event.target.attributes.name.value == 'State')
      {
        this.$emit("updated", {
          ...this.item,
          value: this.data,
          name: event.target.options[selectedIndex].text ? event.target.options[selectedIndex].text : "",
        });
      }
      
    },
  },
};
</script>

<style scoped lang="scss">
select {
  appearance: auto;
}
</style>

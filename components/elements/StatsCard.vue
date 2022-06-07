<template>
  <div class="card stats-card h-100" :class="`card-inn-${colorIndex}`" @click="cardSelected">
    <div :class="item.colorClass" class="card-body d-flex flex-column">
      <content-loader
        v-if="loading"
        width="357"
        height="90"
        :speed="1"
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
      >
        <rect x="146" y="169" rx="3" ry="3" width="88" height="6" />
        <rect x="111" y="62" rx="3" ry="3" width="92" height="11" />
        <rect x="111" y="15" rx="3" ry="3" width="101" height="35" />
        <circle cx="52" cy="48" r="39" />
      </content-loader>
      <div class="d-flex align-items-center w-100 h-100" v-else>
        <span
          class="icon inn-icon-color large-icon-counter"
          :class="`inn-icon-color-${colorIndex}`"
        >
          <i v-if="!isImage(item.icon)" class="innov-icon" :class="item.icon"></i>
          <img :src="require(`../../assets/images/${item.icon}`)" v-if="isImage(item.icon)" />
        </span>
        <div class="d-flex justify-content-between align-items-center" style="flex:1;">
          <div class="count-label d-flex flex-column ml-3">
            <span class="h4">{{ item.count }}</span>
            <span>{{ item.title }}</span>
          </div>
          <div class="extra-info" v-if="item.description.length > 0">
            <div
              v-for="(desc, ind) in item.description"
              :key="ind"
              class="d-flex align-items-center"
              :class="ind !== 0 ? 'mt-2' : ''"
            >
              <div class="desc-icon mr-2">
                <i v-if="!isImage(item.icon)" class="innov-icon" :class="desc.icon"></i>
                <img :src="require(`../../assets/images/${desc.icon}`)" v-if="isImage(desc.icon)" />
              </div>
              <div class="desc-text d-flex flex-column">
                <span class="desc-title" :style="{ color:  desc.colorClass}">{{ desc.title }}</span>
                <span class="desc-title">{{ desc.data }}
                  <span v-if="desc.descriptionData1Avg"> 
                    <span v-if="desc.descriptionData1Avg < 0">
                      <img src="@/assets/images/count-down.svg" alt />
                      <span class="red">{{ desc.descriptionData1Avg }}%</span> 
                    </span>
                    <span v-else-if="desc.descriptionData1Avg > 0">
                      <img src="@/assets/images/count-up.svg" alt />
                      <span class="green">{{ desc.descriptionData1Avg }}%</span> 
                    </span>
                     <span v-else>
                        <img src="@/assets/images/up.svg" alt/>
                        <img src="@/assets/images/down.svg" alt/>
                      <span class="text-secondary">{{ desc.descriptionData1Avg }}%</span> 
                      </span>
                  </span>
                  <span v-else-if="desc.descriptionData2Avg">
                    <span v-if="desc.descriptionData2Avg > 0">
                      <img  src="@/assets/images/count-up.svg" alt />
                      <span class="green">{{ desc.descriptionData2Avg }}%</span>
                    </span>
                    <span v-else-if="desc.descriptionData2Avg < 0">
                      <img src="@/assets/images/count-down.svg" alt />
                      <span class="red">{{ desc.descriptionData2Avg }}%</span>
                    </span>
                    <span v-else>
                        <img src="@/assets/images/up.svg" alt/>
                        <img src="@/assets/images/down.svg" alt/>
                      <span class="text-secondary">{{ desc.descriptionData2Avg }}%</span>
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    cardSelected() {
      this.$emit("selected", true);
      console.log(this.item);
    },
    isImage(icon) {
      if (icon.indexOf(".") === -1) return false;
      let ext = icon.split(".").pop();
      if (["png", "svg", "jpg"].indexOf(ext) === -1) return false;
      return true;
    }
  },
  computed: {
    colorIndex() {
      return this.index % 4;
    },
    description() {
      let description = [];
      for (var i in this.item) {
        if (i.indexOf("descriptionTitle") !== -1) {
          // contains the data
          let index = i.replace("descriptionTitle", "");
          description.push({
            title: this.item[`descriptionTitle${index}`],
            icon: this.item[`descriptionIcon${index}`],
            data: this.item[`descriptionData${index}`]
          });
        }
      }
      return description;
    }
  }
};
</script>

<style lang="scss" scoped>
.inn-icon-color {
  padding: 0.75rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
$mapcolor: 0 #58b045, 1 #3ec0d7, 2 #bca6ea, 3 #de5e54;
@each $index, $col in $mapcolor {
  .inn-icon-color-#{$index} {
    background-color: transparentize($col, 0.8);
    img {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  .card-inn-#{$index} {
    border-left: 4px solid $col;
    box-shadow: 0px 0px 8px -4px $col;
    transition: all 0.2s linear;
    cursor: pointer;
    &:hover {
      box-shadow: 0px 0px 8px 0px $col;
    }
  }
}
</style>

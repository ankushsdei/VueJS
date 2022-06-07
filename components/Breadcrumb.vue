<template>
  <div class="breadcrumb-bar">
    <nav v-if="breadcrumbs.length > 0" aria-label="breadcrumb">
      <ol class="breadcrumb pl-0">
        <li
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
          :class="{ active: breadcrumb.active }"
          class="breadcrumb-item"
        >
          <router-link v-if="breadcrumb.active" :to="'/' + breadcrumb.link">{{
            $t(breadcrumb.title)
          }}</router-link>
          <span v-else>{{ $t(breadcrumb.title) }}</span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: {
    breadcrumbs: {
      type: Array
    }
  },
  data() {
    return {
      lang: "en"
    };
  }
};
</script>
<style scoped lang="scss">
.breadcrumb-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .breadcrumb {
    background: transparent;
    padding: 0;
    margin-bottom: 0;

    a {
      color: #808080;

      &:hover {
        text-decoration: none;
      }
    }

    li.active {
      color: #4d4f5c;
    }
    li {
      &:before {
        content: "\f105";
        font-family: "Fontawesome";
        color: #a4afb7;
      }
      &:first-child {
        &:before {
          display: none;
        }
      }
    }
  }
}
</style>

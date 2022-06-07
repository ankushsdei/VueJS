<template>
  <div
    class="container-fluid defualt-bg"
    :class="{ 'toggle-menu-open': menuSlide }"
  >
    <div :class="'row ' + themeClass">
      <Navigation  @showChatBox="getChatBoxStatus" v-if="isSession" />
      <div
        class="col-sm-1 sidebar responsive-sidebar sidebar-pad"
        v-if="isSession"
      >
        <Menu />
      </div>
      <div
        class="
          main-content-container
          complete-outer-section
          edit-outer-sections
        "
        :class="isSession ? 'col-sm-11' : 'col-sm-12'"
      >
        <div class="row">
          <div class="inner-container">
            <slot></slot>
          </div>
          <Footer />
        </div>
        <Chat :showChatContainer="showChatContainer" v-if="showChat" />
      </div>
    </div>
    <div
      class="action-overlay"
      :class="{ in: actionClassSwitch }"
      @click="closeOverlay()"
    ></div>
  </div>
</template>
<script>
import Navigation from "../components/shared/Nav";
import Menu from "../components/shared/Menu";
import Footer from "../components/shared/Footer";
import Chat from "../components/tpc/Chat/Chat";
export default {
  name: "Portal",
  components: {
    Navigation,
    Menu,
    Footer,
    Chat,
  },
  data() {
    return {
      isSession: false,
      menuSlide: false,
      themeClass: "",
      actionClassSwitch: false,
      showChat: false,
      showChatContainer: false
    };
  },
  mounted() {
    // Todo: revise for serve update
    let routerBasePlatform = this.$route.fullPath.split("/")[1];
    if (routerBasePlatform === "super-admin-portal") {
      this.themeClass = JSON.parse(
        localStorage.getItem("innov-superadmin")
      ).theme;
      this.isSession = true;
    }
    if (routerBasePlatform === "admin-portal") {
      this.themeClass = JSON.parse(localStorage.getItem("innov-admin")).theme;
      this.isSession = true;
    }
    if (routerBasePlatform === "tpc-portal") {
      this.showChat = true;
      this.themeClass = JSON.parse(localStorage.getItem("innov-tpc")).theme;
      this.isSession = true;
    }
    this.$root.switchOverlay = () => {
      this.switchActionClass();
    };
    this.$root.menuToggle = (flag) => {
      this.menuToggle(flag);
    };
    this.$root.updateAppTheme = () => {
      this.isSession = true;
      this.updateTheme();
    };
  },
  methods: {
    getChatBoxStatus(status){
      console.log(status)
      this.showChatContainer = status? true: false;
    },
    switchActionClass() {
      this.actionClassSwitch = !this.actionClassSwitch;
    },
    menuToggle(flag) {
      this.menuSlide = flag;
    },
    closeOverlay() {
      this.$root.actionClose();
    },
    updateTheme() {
      let routerBasePlatform = this.$route.fullPath.split("/")[1];
      if (routerBasePlatform === "super-admin-portal") {
        this.themeClass = JSON.parse(
          localStorage.getItem("innov-superadmin")
        ).theme;
      } else if (routerBasePlatform === "admin-portal") {
        this.themeClass = JSON.parse(localStorage.getItem("innov-admin")).theme;
      } else {
        this.themeClass = JSON.parse(localStorage.getItem("innov-tpc")).theme;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.defualt-bg {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f7fa;
  flex-direction: column;
  > div:not(.action-overlay) {
    width: 100vw;
    height: 100vh;
  }
}
.sidebar {
  background: #ffffff;
}
.content-area {
  background: #f4f7fa;
}
@media screen and (max-width: 767px) {
  .defualt-bg {
    .sidebar {
      transform: translateX(-1000px);
      transition: all 0.2s linear;
    }
    .toggle-menu-open {
      .sidebar {
        transform: none;
      }
    }
    &:not(.show-menu) {
      .main-content-container {
        max-width: 100vw !important;
      }
    }
  }
}
</style>

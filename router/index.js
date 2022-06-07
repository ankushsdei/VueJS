import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import superAdminRoutes from "./modules/super-admin";

import Home from "@/views/Home";
import About from "@/views/About";
import Logout from "@/views/Logout";

import Login from "@/components/auth/LoginPage";
import WiotLogin from '@/components/auth/WiotLogin'
import WiotResetPassword from '@/components/auth/WiotResetPassword'
import ForgotPassword from "@/components/auth/ForgotPassword";
import {isAuthorized,getSocketAuthToken} from "../plugins/Auth";
// import ResetPassword from "@/components/auth/ResetPassword";
// import { shouldLeave } from "../plugins/FormAction";
import store from "@/store";

const globalRoutes = [
  {
    path: "/",
    name: "login",
    // component: Login,
    component: WiotLogin,
    meta: {
      platform: "site",
      access: 'public'
    }
  },
  {
    path: "/login",
    name: "login",
    // component: Login,
    component: WiotLogin,
    meta: {
      platform: "site",
      access: 'public'
    }
  },
  {
    path: "/login-all",
    name: "login-all",
    component: Login,
    // component: WiotLogin,
    meta: {
      platform: "site"
    }
  },
  {
    path: `/logsnDVIR/:id?`,
    name: "logsnDVIR",
    component: LogsAndDVIR,
    props: (route) => ({ day: route.query.day, month: route.query.month,year: route.query.year,token: route.query.token,portalID: route.query.portalID }),
    meta: {
      platform: "site"
    }
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    meta: {
      platform: "site"
    }
  },
  // Super Admin Reset Password Starts
  {
    path: "/super-admin-portal/reset-password",
    name: "sa-reset-password",
    // component: ResetPassword,
    component: WiotResetPassword,
    meta: {
      platform: "site",
      access: 'public'
    }
  },
  // Super Admin Reset Password Ends

  // Admin Reset Password Starts
  {
    path: "/admin-portal/reset-password",
    name: "a-reset-password",
    // component: ResetPassword,
    component: WiotResetPassword,
    meta: {
      platform: "site",
      access: 'public'
    }
  },
  // Admin Reset Password Ends

  // TPC Reset Password Starts
  {
    path: "/tpc-portal/reset-password",
    name: "tpc-reset-password",
    // component: ResetPassword,
    component: WiotResetPassword,
    meta: {
      platform: "site",
      access: 'public'
    }
  },
  // TPC Reset Password Ends
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: {
      platform: "site"
    }
  },
  {
    path: "/about",
    name: "about",
    component: About,
    meta: {
      platform: "site"
    }
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout,
    meta: {
      platform: "site"
    }
  }
  // {
  //   path: '*',
  //   name: 'page-not-found',
  //   component: AppPageNotFound
  // }
];

// Innovent Platform Routers
// Add custom check accordingly
let routes = "";
if (localStorage.getItem("innov-superadmin")) {
  routes = [...globalRoutes, ...superAdminRoutes];
} else if (localStorage.getItem("innov-admin")) {
  routes = [...globalRoutes, ...adminRoutes];
} else {
  routes = [...globalRoutes, ...tpcRoutes];
}
// routes = [...globalRoutes, ...superAdminRoutes, ...adminRoutes, ...tpcRoutes];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  linkActiveClass: "active", // active class for non-exact links.
  linkExactActiveClass: "active", // active class for *exact* links.
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});
// Comment the code below to disable route auth
router.beforeEach((to, from, next) => {
  let routerBasePlatform = to.fullPath.split("/")[1];
  let localCheck = {
    token: ""
  };
  let portal="";
  if (routerBasePlatform === "super-admin-portal") {
    localCheck = JSON.parse(localStorage.getItem("innov-superadmin"));
    portal="superadmin"
  }
  if (routerBasePlatform === "admin-portal") {
    localCheck = JSON.parse(localStorage.getItem("innov-admin"));
    portal="admin"
  }
  if (routerBasePlatform === "tpc-portal") {
    localCheck = JSON.parse(localStorage.getItem("innov-tpc"));
    portal="tpc"
  }
  console.log('Checking authorization',portal);
     if(isAuthorized(portal)){
      let token =getSocketAuthToken(portal);
      Vue.prototype.$socket.io.opts.query={token};
      Vue.prototype.$socket.connect();
     }

  // For Now Simple Check need to upgrads
  // Todo: need update once auth all platform apis work
  // Revise check when all router set perfect way meta option
  if (localCheck === null && to.meta.platform != "site") {
    location.href = "/";
  } else {
    const urls = [
      "/super-admin-portal/accounts/add",
      "/super-admin-portal/admin/accounts/add",
      "/super-admin-portal/staff-management/add",
      "/super-admin-portal/admin/accounts/add",
      // "/tpc-portal/dvir-checklist-manager/add"
    ];
    if (to.query.next) {
      next();
      router.replace({ query: {} });
    }
    if (urls.some(item => to.fullPath.includes(item))) {
      next();
    } else {
      if (urls.some(item => from.fullPath.includes(item))) {
        store.dispatch("auth/setNext", next);
      } else {
        next();
      }
    }
  }
});

export default router;

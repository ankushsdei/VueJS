/**
 * START | Super Admin Components UI Router injectors
 */


// Super Admin DVIR Checklist Manager Section starts

import SADCMAdminList from "@/views/super-admin/dvir-checklist-manager/List";
import SADCMAdminAdd from "@/views/super-admin/dvir-checklist-manager/Add";
import SADCMAdminEdit from "@/views/super-admin/dvir-checklist-manager/Edit";
// import SAETMAdminAddAssigning from "@/views/super-admin/email-template-manager/add/Assigning";
// import SAETMAdminAddProfile from "@/views/super-admin/email-template-manager/add/Profile";
import SADCMAdminDetail from "@/views/super-admin/dvir-checklist-manager/Detail";
import SADCMAdminDetailDashboard from "@/views/super-admin/dvir-checklist-manager/detail/Dashboard";
import SADCMAdminDetailLogHistory from "@/views/super-admin/dvir-checklist-manager/detail/LogHistory";

// Super Admin DVIR Checklist Manager Section Ends
/**
 * END | Super Admin Components UI Router injectors
 */

const superAdminRoutes = [
  /**
   * Todo: will put validate and regular route conditions
   * For now just simple update
   * */
  // Super Admin Routes
  {
    path: "/super-admin-portal",
    component: SuperAdminIndex,
    children: [
      /**
       * Super Admin Section Start
       */
    // Super Admin DVIR CheckList Manager Start
      {
        path: "",
        name: "sa-dcm-admin-list",
        component: SADCMAdminList,
        meta: {
          baseRouter: ["a-dcm-admin-list"]
        }
      },
     
      {
        path: "dvir-checklist-manager",
        name: "sa-dcm-admin-list",
        component: SADCMAdminList,
        meta: {
          baseRouter: ["sa-dcm-admin-list"]
        }
      },
      {
        path: "dvir-checklist-manager/add",
        name: "sa-dcm-admin-add",
        component: SADCMAdminAdd,
        meta: {
          baseRouter: ["sa-dcm-admin-add"]
        }
      },
      {
        path: "dvir-checklist-manager/edit/:id",
        name: "sa-dcm-admin-edit",
        component: SADCMAdminEdit,
        meta: {
          baseRouter: ["sa-dcm-admin-edit"]
        }
      },
      {
        path: "dvir-checklist-manager/detail/:id",
        component: SADCMAdminDetail,
        children: [
          {
            path: "",
            name: "sa-dcm-admin-detail-dashboard",
            component: SADCMAdminDetailDashboard,
            meta: {
              baseRouter: ["sa-dcm-admin-detail-dashboard"]
            }
          },
          {
            // when /admin/detail/:id /dashboard is matched
            path: "dashboard",
            name: "sa-dcm-admin-detail-dashboard",
            component: SADCMAdminDetailDashboard,
            meta: {
              baseRouter: ["sa-dcm-admin-detail-dashboard"]
            }
          },
          {
            // when /admin/detail/:id /log-history is matched
            path: "log-history",
            name: "sa-dcm-admin-log-detail-history",
            component: SADCMAdminDetailLogHistory,
            meta: {
              baseRouter: ["sa-dcm-admin-log-detail-history"]
            }
          }
        ]
      },

      // Super Admin DVIR CheckList Manager End
    ]
  }
];

export default superAdminRoutes;

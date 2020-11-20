import Vue from "vue";
import VueRouter from "vue-router";
import { translation } from "@/plugins/translation.js";
import axios from "@/plugins/axios";

Vue.use(VueRouter);

function load(component) {
  return () => import(`@/views/${component}.vue`);
}

const routes = [
  {
    path: "/:locale",
    component: { template: "<router-view />" },
    beforeEnter: translation.routeMiddleware,
    children: [
      {
        path: "login",
        name: "Login",
        component: load("Login"),
        beforeEnter: (to, from, next) => {
          if (localStorage.getItem("token")) {
            next({ name: "Home" });
          } else {
            next();
          }
        }
      },
      {
        path: "",
        component: load("BaseLayout"),
        meta: { requiresAuth: true },
        children: [
          {
            path: "",
            component: () => import(`@/views/Home/HomeBaseLayout.vue`),
            children: [
              {
                path: "",
                name: "Home",
                component: () => import(`@/views/Home/Home.vue`)
              },
              {
                path: "discharged",
                name: "Discharged",
                component: () => import(`@/views/Home/Discharged.vue`)
              },
              {
                path: "station/:station",
                name: "Station",
                component: () => import(`@/views/Home/Station.vue`)
              },
              {
                path: "section/:section",
                name: "Section",
                component: () => import(`@/views/Home/Section.vue`)
              }
            ]
          },
          {
            path: "admission/:admissionKey",
            component: () => import(`@/views/Patient/Patient.vue`),
            children: [
              {
                path: "",
                name: "PatientProfile",
                component: () => import(`@/views/Patient/PatientProfile.vue`)
              },
              {
                path: "vitalSign",
                name: "PatientVitalSign",
                component: () => import(`@/views/Patient/PatientVitalSign.vue`)
              },
              {
                path: "lab",
                name: "PatientLab",
                component: () => import(`@/views/Patient/PatientLab.vue`)
              },
              {
                path: "image",
                name: "PatientImage",
                component: () => import(`@/views/Patient/PatientImage.vue`)
              },
              {
                path: "exam",
                name: "PatientExam",
                component: () => import(`@/views/Patient/PatientExam.vue`)
              },
              {
                path: "photo",
                name: "PatientPhoto",
                component: () => import(`@/views/Patient/PatientPhoto.vue`)
              }
            ]
          },
          {
            path: "settings",
            name: "Settings",
            component: load("Settings")
          }
        ]
      },
      {
        path: "404",
        alias: "*",
        name: "NotFound",
        component: load("NotFound")
      }
    ]
  },
  {
    path: "/",
    redirect() {
      return translation.defaultLocale;
    }
  }
];

const scrollBehavior = function(to, from, position) {
  // 搭配 keep-alive 讓使用者回 home 的頁面時，回到上次的視窗位子 (scroll position)
  if (position) {
    return position;
  } else {
    return { x: 0, y: 0 };
  }
};

const router = new VueRouter({
  routes,
  scrollBehavior
});

// if token is not exist, redirect to login
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem("token");
    if (token) {
      next();
    } else {
      next({ name: "Login", query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
});

// if response 401 unauthorized, redirect to login
axios.interceptors.response.use(
  async function(res) {
    return res;
  },
  async function(error) {
    if (error.response?.status === 401) {
      const currentPath = router.history.current.fullPath;
      localStorage.removeItem("token");
      await router.push({ name: "Login", query: { redirect: currentPath } });
    }
    return Promise.reject(error);
  }
);

export default router;

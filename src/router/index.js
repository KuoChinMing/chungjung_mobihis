import Vue from "vue";
import VueRouter from "vue-router";
import axios from "@/plugins/axios";

Vue.use(VueRouter);

function load(component) {
  return () => import(`@/views/${component}.vue`);
}

const routes = [
  {
    path: "/login",
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
        path: "/",
        component: load("HomeBaseLayout"),
        children: [
          {
            path: "",
            name: "Home",
            component: load("Home")
          },
          {
            path: "/discharged",
            name: "Discharged",
            component: load("Discharged")
          },
          {
            path: "/station/:station",
            name: "Station",
            component: load("Home")
          },
          {
            path: "/section/:section",
            name: "Section",
            component: load("Home")
          }
        ]
      },
      {
        path: "/patient/:patientId/:admissionKey/:inHosDate",
        component: load("Patient"),
        children: [
          {
            path: "",
            name: "PatientProfile",
            component: load("PatientProfile")
          },
          {
            path: "vitalSign",
            name: "PatientVitalSign",
            component: load("PatientVitalSign")
          },
          {
            path: "lab",
            name: "PatientLab",
            component: load("PatientLab")
          },
          {
            path: "image",
            name: "PatientImage",
            component: load("PatientImage")
          },
          {
            path: "exam",
            name: "PatientExam",
            component: load("PatientExam")
          },
          {
            path: "photo",
            name: "PatientPhoto",
            component: load("PatientPhoto")
          }
        ]
      },
      {
        path: "/settings",
        name: "Settings",
        component: load("Settings")
      }
    ]
  },
  {
    path: "/404",
    alias: "*",
    name: "NotFound",
    component: load("NotFound")
  }
];

const scrollBehavior = function() {
  // to, from, savedPosition
  return { x: 0, y: 0 };
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

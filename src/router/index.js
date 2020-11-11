import Vue from "vue";
import VueRouter from "vue-router";
// import axios from "@/plugins/axios";

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
        name: "Home",
        component: load("Home")
      },
      {
        path: "/discharged",
        name: "Discharged",
        component: load("Home")
      },
      {
        path: "/stairs/:stairs",
        name: "Stairs",
        component: load("Home")
      },
      {
        path: "/sector/:sector",
        name: "Sector",
        component: load("Home")
      },
      {
        path: "/patient/:patientId",
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

const router = new VueRouter({
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      const token = localStorage.getItem("token");
      // TODO token 驗證
      // await axios.post("/auth/token", { token });
      if (token) {
        next();
      } else {
        throw new Error("login error");
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      next({ name: "Login", params: to.params });
    }
  } else {
    next();
  }
});

export default router;

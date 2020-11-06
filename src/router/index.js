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
      }
    ]
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

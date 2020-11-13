import Vue from "vue";
import Vuex from "vuex";
import axiosOriginal from "axios";
import axios from "@/plugins/axios.js";
import jwt_decode from "jwt-decode";

Vue.use(Vuex);

const token = localStorage.getItem("token") || null;
const tokenPayload = token ? jwt_decode(token) : {};

export default new Vuex.Store({
  state: {
    homeNavigationDrawer: false,
    token: token,
    account: tokenPayload["unique_name"] || ""
  },
  mutations: {
    account(state, account) {
      state.account = account;
    },
    token(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },
    toggleHomeNavigationDrawer(state, isOpen) {
      state.homeNavigationDrawer = isOpen;
    }
  },
  actions: {
    async login({ commit }, { account, password }) {
      try {
        const loginParams = { userID: account, password };
        const loginResponse = await axios.get("/api/Token/Login", { params: loginParams });
        const encryptedToken = loginResponse.data.Token;
        const BASE_URL = process.env.VUE_APP_BASE_URL;
        const { data: token } = await axiosOriginal.get(`${BASE_URL}/api/Token/Decrypt`, {
          params: { text: encryptedToken }
        });

        commit("account", account);
        commit("token", token);
      } catch (error) {
        console.log(error);
      }
    }
  },
  modules: {}
});

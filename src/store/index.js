import Vue from "vue";
import Vuex from "vuex";
import axios from "@/plugins/axios.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    homeNavigationDrawer: false,
    token: localStorage.getItem("token") || null,
    account: localStorage.getItem("account") || null
  },
  mutations: {
    account(state, account) {
      state.account = account;
      localStorage.setItem("account", account);
    },
    token(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = token;
    },
    toggleHomeNavigationDrawer(state, isOpen) {
      state.homeNavigationDrawer = isOpen;
    }
  },
  actions: {
    async login({ commit }, { account, password }) {
      try {
        const encrypt = data => async () => {
          const params = { text: data };
          return await axios.get(`/api/Token/Crypt`, { params });
        };
        const getEncryptedAccount = encrypt(account);
        const getEncryptedPassword = encrypt(password);
        const [{ data: encryptedAccount }, { data: encryptedPassword }] = await Promise.all([
          getEncryptedAccount(),
          getEncryptedPassword()
        ]);

        const loginParams = { userID: encryptedAccount, password: encryptedPassword };
        const loginResponse = await axios.get("/api/Token/Login", { params: loginParams });
        const encryptedToken = loginResponse.data.Token;
        const { data: token } = await axios.get(`/api/Token/Decrypt`, {
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

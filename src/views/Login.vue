<template>
  <v-app>
    <v-main>
      <v-container fill-height fluid>
        <v-row>
          <v-col>
            <v-card max-width="330" class="mx-auto">
              <v-card-title class="justify-center flex-column pb-0">
                <img src="@/assets/logo.png" alt="Logo" class="mb-2" width="80%" />
                <h1 class="text-subtitle-1 text-center" style="word-break: break-word;">
                  MobiHIS
                </h1>
              </v-card-title>
              <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="login">
                <v-card-text class="pb-0">
                  <input type="submit" class="d-none" />
                  <v-text-field
                    v-model="account"
                    :label="'帳號'"
                    :rules="[requiredRule]"
                    :error-messages="loginError"
                    @input="loginError = ''"
                    outlined
                    dense
                    autocomplete="account"
                    type="text"
                    name="account"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    label="密碼"
                    :rules="[requiredRule]"
                    :error-messages="loginError"
                    @input="loginError = ''"
                    outlined
                    dense
                    autocomplete="password"
                    type="password"
                    name="password"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="primary">註冊</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn depressed color="primary" @click="login">登入</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "@/plugins/axios.js";

export default {
  name: "Login",

  data() {
    return {
      valid: true,
      loginError: "",
      account: null,
      password: null
    };
  },

  methods: {
    requiredRule(value) {
      return !!value || "此欄位為必填項目";
    },
    // async genQueryString(data) {
    //   const urlData = JSON.parse(JSON.stringify(data));
    //   const encrypt = data => async () => await axios.get(`/api/Token/Crypt?text=${data}`);
    //   Object.keys(urlData).forEach(key => (urlData[key] = encrypt(key)));
    //   const encryptedData = (
    //     await Promise.all(Object.values(urlData).map(encrypt => encrypt()))
    //   ).map(res => res.data);

    //   for (const property in urlData) {
    //     const index = Object.keys(urlData).indexOf(property);
    //     urlData[property] = encryptedData[index];
    //   }

    //   return new URLSearchParams(urlData).toString();
    // },
    async login() {
      if (this.$refs.form.validate()) {
        try {
          const { account, password } = this;
          const encrypt = data => async () => await axios.get(`/api/Token/Crypt?text=${data}`);
          const getEncryptedAccount = encrypt(account);
          const getEncryptedPassword = encrypt(password);
          const [{ data: encryptedAccount }, { data: encryptedPassword }] = await Promise.all([
            getEncryptedAccount(),
            getEncryptedPassword()
          ]);
          const loginData = {
            userID: encryptedAccount,
            password: encryptedPassword
          };
          const loginQueryString = new URLSearchParams(loginData).toString();
          const res = await axios.get(`/api/Token/Login?${loginQueryString}`);

          localStorage.setItem("token", res.data.Token);
          this.$router.push({ name: "Home" });
        } catch (error) {
          // TODO
          console.log(error);
        }
      }
    }
  }
};
</script>

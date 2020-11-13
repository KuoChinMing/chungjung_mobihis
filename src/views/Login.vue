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
                    autocomplete="current-password"
                    type="password"
                    name="password"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="primary">註冊</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn depressed color="primary" :loading="isLogining" @click="login">登入</v-btn>
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
export default {
  name: "Login",

  data() {
    return {
      valid: true,
      loginError: "",
      account: null,
      password: null,
      isLogining: false
    };
  },

  methods: {
    requiredRule(value) {
      return !!value || "此欄位為必填項目";
    },
    async login() {
      if (this.$refs.form.validate()) {
        try {
          const { account, password } = this;
          this.isLogining = true;
          await this.$store.dispatch("login", { account, password });
          this.isLogining = false;
          this.$router.push(this.$route.query.redirect || { name: "Home" });
        } catch (error) {
          // TODO 判斷是否為帳密輸入錯誤，是的話顯示錯誤
          console.log(error);
        }
      }
    }
  }
};
</script>

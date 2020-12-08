<template>
  <v-app>
    <v-main>
      <v-container fill-height fluid>
        <v-row>
          <v-col>
            <v-card max-width="330" class="mx-auto">
              <v-card-title class="justify-center flex-column">
                <img src="@/assets/logo.png" alt="Logo" width="80%" />
                <h1 class="text-subtitle-1 text-center" style="word-break: break-word;">
                  {{ $t("systemTitle") }}
                </h1>
              </v-card-title>
              <v-card-text class="pb-0">
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                  id="login"
                  @submit.prevent="login"
                >
                  <v-text-field
                    v-model="account"
                    :label="$t('login.account')"
                    :rules="[requiredRule]"
                    :error-messages="loginError"
                    @input="loginError = ''"
                    :disabled="isLogining"
                    outlined
                    dense
                    autocomplete="account"
                    type="text"
                    name="account"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    :label="$t('login.password')"
                    :rules="[requiredRule]"
                    :error-messages="loginError"
                    @input="loginError = ''"
                    :disabled="isLogining"
                    outlined
                    dense
                    autocomplete="current-password"
                    type="password"
                    name="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary" :disabled="true">{{ $t("login.register") }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn depressed color="primary" :loading="isLogining" type="submit" form="login">
                  {{ $t("login.login") }}
                </v-btn>
              </v-card-actions>
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
      return !!value || this.$t("rules.required");
    },
    async login() {
      if (this.$refs.form.validate()) {
        try {
          const { account, password } = this;
          this.isLogining = true;
          await this.$store.dispatch("login", { account, password });
          this.$router.push(this.$route.query.redirect || { name: "Home" });
        } catch (error) {
          // 應該判斷 error message，但 API 沒有回
          this.loginError = this.$t("credentialInvalid");
          console.log(error.response);
        } finally {
          this.isLogining = false;
        }
      }
    }
  }
};
</script>

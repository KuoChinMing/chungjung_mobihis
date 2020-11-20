<template>
  <v-btn color="primary" @click="logout">{{ $t("login.login") }}</v-btn>
</template>

<script>
export default {
  name: "LogoutButton",

  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push({ name: "Login" });
    }
  }
};
</script>

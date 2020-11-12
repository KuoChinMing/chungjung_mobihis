<template>
  <v-btn color="primary" @click="logout">登出</v-btn>
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

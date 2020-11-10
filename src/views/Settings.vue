<template>
  <div>
    <h1>Settings</h1>
    <LogoutButton />
  </div>
</template>

<script>
import LogoutButton from "@/components/LogoutButton.vue";

export default {
  name: "Settings",

  components: {
    LogoutButton
  }
};
</script>

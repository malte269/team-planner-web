<template>
  <v-layout class="fill-height">
    <v-app-bar v-if="showNavigation">
      <v-app-bar-title>
        Willkommen
      </v-app-bar-title>
      <v-spacer />
      <v-btn @click="logout()">
        Logout
      </v-btn>
    </v-app-bar>
    <NavigationBarComponent v-if="showNavigation"></NavigationBarComponent>
    <v-main>
      <div class="fill-height">
        <v-container class="pa-0 fill-height d-flex align-start" fluid>
          <router-view :key="$route.path"></router-view>
        </v-container>
      </div>
    </v-main>
    <notifications :position="['top', 'center']"></notifications>
  </v-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavigationBarComponent from '@/components/shared/NavigationBar.component.vue';
import { AuthMutations, useAuthStore } from '@/stores/auth.store';
import { Views } from '@/views';

export default defineComponent({
  components: {
    NavigationBarComponent,
  },
  data() {
    return {
      authStore: useAuthStore(),
    };
  },
  methods: {
    logout() {
      this.authStore.commit(AuthMutations.CLEAR_LOGIN);
      this.$router.push({
        name: Views.LOGIN,
      });
    },
  },
  computed: {
    showNavigation() {
      return !!this.authStore.getters.activeUser;
    },
  },
});
</script>

<style scoped>
header {
    line-height: 1.5;
}
</style>

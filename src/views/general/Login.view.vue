<template>
  <v-container class="fill-height login-view justify-center">
    <v-card class="login-form" @keydown.enter="login()">
      <v-card-title>
        <h2 class="mb-4">
          Login
        </h2>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-text-field v-model="username" label="Benutzername"></v-text-field>
        </v-row>
        <v-row>
          <v-text-field v-model="password" label="Passwort" type="password"></v-text-field>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="login()">
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AuthActions, useAuthStore } from '@/stores/auth.store';
import { Views } from '@/views';

export default defineComponent({
  data() {
    return {
      username: '',
      password: '',
      authStore: useAuthStore(),
    };
  },
  async created() {
    if (this.authStore.getters.activeUser) {
      await this.$router.push({
        name: Views.PROJECT_VIEW,
      });
    }
  },
  methods: {
    async login() {
      try {
        await this.authStore.dispatch(AuthActions.LOGIN, { username: this.username, password: this.password });
        await this.$router.push({
          name: Views.PROJECT_VIEW,
        });
      } catch (e: any) {
        if (e.status === 401 || e.status === 404) {
          this.$notify({
            title: 'Fehler',
            text: 'Benutzername und Passwort gehören zu keinem bestehenden Account',
            type: 'info',
          });
        } else {
          this.$notify({
            title: 'Fehler',
            text: 'Ein Fehler ist aufgetreten',
            type: 'error',
          });
        }
      }
    },
  },
});
</script>

<style scoped>
.login-view {
  width: 100%;
}

.login-form {
  width: 400px;
}
</style>

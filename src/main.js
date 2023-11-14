import { createApp } from 'vue';
import App from './App.vue';
import { stores } from '@/store';
import router from '@/router';
import vuetify from '@/plugins/vuetify/vuetify';
import '@/styles/styles.scss';
import { mdi } from 'vuetify/iconsets/mdi';
import Notifications from '@kyvg/vue3-notification';

const app = createApp(App);

for (const store in stores) {
  app.use(stores[store].store, stores[store].key);
}

app.use(router);

app.use(vuetify, mdi);
app.use(Notifications);
app.mount('#app');

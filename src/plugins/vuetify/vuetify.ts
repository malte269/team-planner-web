import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import * as labs from 'vuetify/lib/labs/components';
import defaultLight from '@/plugins/vuetify/themes/defaultLight';
import 'vuetify/_styles.scss';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  components: { ...components, ...labs },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: defaultLight,
    },
  },
});

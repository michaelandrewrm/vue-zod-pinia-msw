import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

async function startMockWorker() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start({ onUnhandledRequest: 'bypass' });
  }
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

startMockWorker().then(() => {
  app.mount('#app');
});

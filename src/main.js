import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Note que é './router' sem extensão

const app = createApp(App);
app.use(router);
app.mount('#app');
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

// Disable Vue Devtools in development
app.config.devtools = false;
app.config.productionTip = false;

app.mount('#app');
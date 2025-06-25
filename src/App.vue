<template>
  <div id="app">
    <AppHeader v-if="showHeader" @select-session="handleSessionSelect" />
    <div class="global-background" v-if="!hasCustomBackground">
      <main class="main-content">
        <router-view />
      </main>
    </div>
    <main class="main-content" v-else>
      <router-view />
    </main>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
  },
  computed: {
    showHeader() {
      return this.$route.matched.some(record => record.meta.showHeader);
    },
    hasCustomBackground() {
      const customBackgroundRoutes = ['/login', '/register'];
      return customBackgroundRoutes.includes(this.$route.path);
    },
  },
  methods: {
    handleSessionSelect(sessionId) {
      this.$router.push({ name: 'Chat', params: { sessionId } });
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url('@/assets/bg.jpg');
  background-size: cover;
  font-family: 'Inter', sans-serif;
}

#app {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

.global-background {
  height: 100vh;
  width: 100vw;
  background-image: url('@/assets/bg.jpg');
  background-size: cover;
  background-position: center;
}
.main-content {
  padding-top: 4rem;/* Ajustado para header responsivo */
  min-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
  overflow: hidden; 
}



/* Media Queries para Responsividade */
@media (max-width: 640px) {
  .main-content {
    padding-top: 3.5rem; /* Menor padding para header compacto em celulares */
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .main-content {
    padding-top: 4rem; /* Intermediário para tablets */
  }
}
</style>
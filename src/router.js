import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/LoginPage.vue';
import Register from './views/RegisterPage.vue';
import Configuracoes from './views/ConfiguracoesPage.vue';
import Chat from './views/ChatPage.vue';

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: Login, 
    meta: { 
      showHeader: false, 
      customBackground: true, 
      title: 'Login - Lumi AI' 
    } 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: Register, 
    meta: { 
      showHeader: false, 
      customBackground: true, 
      title: 'Register - Lumi AI' 
    } 
  },
  { 
    path: '/configuracoes', 
    name: 'Configuracoes', 
    component: Configuracoes, 
    meta: { 
      requiresAuth: true, 
      showHeader: true, 
      customBackground: false, 
      title: 'Configurações - Lumi AI' 
    }
  },
  { 
    path: '/chat/:sessionId?', // Adiciona o parâmetro sessionId como opcional
    name: 'Chat', 
    component: Chat, 
    meta: { 
      requiresAuth: true, 
      showHeader: true, 
      customBackground: false, 
      title: 'Chat - Lumi AI' 
    }
  },
  { 
    path: '/', 
    redirect: '/login' 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  // Define o título da página com base na rota
  document.title = to.meta.title || 'Lumi AI';

  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Se a rota requer autenticação e o usuário não está logado
  if (requiresAuth && !token) {
    next('/login');
    return;
  }

  // Se o usuário está logado, mas ainda não configurou
  if (token && user && !user.is_configured && to.path !== '/configuracoes') {
    next('/configuracoes');
    return;
  }

  // Se o usuário já configurou e está tentando acessar /configuracoes
  if (token && user && user.is_configured && to.path === '/configuracoes') {
    next('/chat');
    return;
  }
  next();
});

export default router;
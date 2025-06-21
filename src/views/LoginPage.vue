<template>
  <div class="login-container">
    <div class="login-box">
      <img src="@/assets/logo-lumi.svg" alt="Lumi Logo" class="logo" />
      <form @submit.prevent="handleLogin">
        <input type="email" placeholder="Digite o seu email" v-model="email" required />
        <div class="password-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            placeholder="Digite a sua senha"
            v-model="password"
            required
          />
          <span class="toggle-password" @click="togglePassword">
            {{ showPassword ? 'Esconder' : 'Mostrar' }}
          </span>
        </div>
        <button type="submit">Entrar</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p class="register-link">
        Não tem uma conta? <router-link to="/register">Cadastrar</router-link>
      </p>
      <div class="social-login">
        <p>Entrar com:</p>
        <div class="social-buttons">
          <button class="social-btn google" @click="showNotAvailable">
            <img src="@/assets/google-icon.svg" alt="Google" />
          </button>
          <button class="social-btn apple" @click="showNotAvailable">
            <img src="@/assets/apple-icon.svg" alt="Apple" />
          </button>
          <button class="social-btn facebook" @click="showNotAvailable">
            <img src="@/assets/facebook-icon.svg" alt="Facebook" />
          </button>
        </div>
      </div>
      <div class="footer-links">
        <a href="#">Termos de uso</a> / <a href="#">Política de privacidade</a>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      showPassword: false
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '';
      try {
        const response = await api.post('/auth/login', {
          email: this.email,
          senha: this.password
        });
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Verifica se o usuário já fez a configuração
          const isConfigured = response.data.user.is_configured;
          if (isConfigured) {
            this.$router.push('/chat'); // Vai direto para o chat
          } else {
            this.$router.push('/configuracoes'); // Primeira vez: vai para configurações
          }
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    showNotAvailable() {
      alert('Funcionalidades ainda não disponíveis');
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;

}

.login-box {
  background: rgba(0, 0, 0, 0.9);
  padding: 40px;
  border-radius: 10px;
  border: 1px solid #D3B911;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 400px;
}

.logo {
  width: 150px;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #FFFFFF;
  border-radius: 5px;
  background: #FFFFFF;
  color: #000;
  font-size: 14px;
}

.password-container {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888888;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
  padding: 2px 5px;
  background: #FFFFFF;
  border-radius: 3px;
}

.toggle-password:hover {
  color: #D3B911;
}

button {
  width: 100%;
  padding: 12px;
  background: #D3B911;
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: 0.3s;
  font-size: 16px;
}

button:hover {
  background: #b5a00f;
}

.error {
  color: #fc0909;
  margin-top: 15px;
}

.register-link {
  color: #FFFFFF;
  margin-top: 20px;
  font-size: 14px;
}

.register-link a {
  color: #D3B911;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

.social-login {
  margin-top: 20px;
}

.social-login p {
  color: #FFFFFF;
  font-size: 14px;
  margin-bottom: 10px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-btn {
  background: #FFFFFF;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
}

.social-btn img {
  width: 20px;
  height: 20px;
}

.social-btn:hover {
  background: #e0e0e0;
}

.footer-links {
  margin-top: 20px;
  font-size: 12px;
}

.footer-links a {
  color: #888888;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}
</style>
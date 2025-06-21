<template>
  <div class="register-container">
    <div class="register-box">
      <img src="@/assets/logo-lumi.svg" alt="Lumi Logo" class="logo" />
      <form @submit.prevent="handleRegister">
        <input type="text" placeholder="Digite o seu nome" v-model="name" required />
        <input type="text" placeholder="Digite o seu sobrenome" v-model="sobrenome" required />
        <input type="email" placeholder="Digite o seu email" v-model="email" required />
        <div class="password-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            placeholder="Defina sua senha"
            v-model="password"
            required
          />
          <span class="toggle-password" @click="togglePassword">
            {{ showPassword ? 'Esconder' : 'Mostrar' }}
          </span>
        </div>
        <div class="password-container">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirme sua senha"
            v-model="confirmPassword"
            required
          />
          <span class="toggle-password" @click="toggleConfirmPassword">
            {{ showConfirmPassword ? 'Esconder' : 'Mostrar' }}
          </span>
        </div>
        <button type="submit">Criar conta</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p class="login-link">
        Já tem uma conta? <router-link to="/login">Entrar</router-link>
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
      name: '',
      sobrenome: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      showPassword: false,
      showConfirmPassword: false
    };
  },
  methods: {
    async handleRegister() {
      this.errorMessage = '';
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'As senhas não coincidem';
        return;
      }
      try {
        const response = await api.post('/auth/register', {
          nome: this.name,
          sobrenome: this.sobrenome,
          email: this.email,
          senha: this.password
        });
        if (response.status === 201) {
          this.$router.push('/login');
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Erro ao registrar';
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    showNotAvailable() {
      alert('Funcionalidades ainda não disponíveis');
    }
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Ocupa a tela inteira */
  background-image: url('@/assets/bg.jpg');
  background-size: cover;
  background-position: center;
}

.register-box {
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem; /* Usando rem para escalar */
  border-radius: 0.5rem;
  border: 1px solid #D3B911;
  box-shadow: 0 0.25rem 0.625rem rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 90%; /* Largura relativa */
  max-width: 25rem; /* 400px em desktop */
  box-sizing: border-box;
}

.logo {
  width: 9rem; /* Escala com a tela */
  max-width: 100%;
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #FFFFFF;
  border-radius: 0.3rem;
  background: #FFFFFF;
  color: #000;
  font-size: 0.9rem;
}

.password-container {
  position: relative;
  margin-bottom: 1rem;
}

.toggle-password {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888888;
  font-size: 0.75rem;
  cursor: pointer;
  user-select: none;
  padding: 0.1rem 0.3rem;
  background: #FFFFFF;
  border-radius: 0.2rem;
}

.toggle-password:hover {
  color: #D3B911;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #D3B911;
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 1.5rem;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 0.9rem;
}

button:hover {
  background: #b5a00f;
}

.error {
  color: #fc0909;
  margin-top: 0.75rem;
  font-size: 0.85rem;
}

.login-link {
  color: #FFFFFF;
  margin-top: 1rem;
  font-size: 0.85rem;
}

.login-link a {
  color: #D3B911;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

.social-login {
  margin-top: 1rem;
}

.social-login p {
  color: #FFFFFF;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.social-btn {
  background: #FFFFFF;
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
}

.social-btn img {
  width: 1.25rem;
  height: 1.25rem;
}

.social-btn:hover {
  background: #e0e0e0;
}

.footer-links {
  margin-top: 1rem;
  font-size: 0.75rem;
}

.footer-links a {
  color: #888888;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

/* Media Queries para Responsividade */
@media (max-width: 640px) {
  .register-box {
    padding: 1rem;
    max-width: 100%; /* Usa toda a largura */
    margin: 0.5rem;
  }

  .logo {
    width: 7rem;
  }

  input {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .toggle-password {
    font-size: 0.7rem;
    right: 0.4rem;
    padding: 0.1rem 0.2rem;
  }

  button {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .error, .login-link, .social-login p {
    font-size: 0.75rem;
  }

  .social-btn {
    width: 2rem;
    height: 2rem;
  }

  .social-btn img {
    width: 1rem;
    height: 1rem;
  }

  .footer-links {
    font-size: 0.7rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .register-box {
    padding: 1.5rem;
    max-width: 22rem;
  }

  .logo {
    width: 8rem;
  }

  input, button {
    font-size: 0.85rem;
  }

  .toggle-password {
    font-size: 0.75rem;
  }

  .error, .login-link, .social-login p {
    font-size: 0.8rem;
  }
}
</style>
<template>
  <div class="config-container">
    <div class="config-box">
      <h1 class="logo">Configurações da IA</h1>
      <form @submit.prevent="salvarConfiguracoes">
        <div class="input-group">
          <label for="genero_ia">Gênero da IA:</label>
          <select id="genero_ia" v-model="genero_ia" required>
            <option value="" disabled>Selecione o gênero</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="neutro">Neutro</option>
          </select>
        </div>

        <div class="input-group">
          <label for="idioma">Idioma:</label>
          <select id="idioma" v-model="idioma" required>
            <option value="" disabled>Selecione o idioma</option>
            <option value="pt">Português</option>
            <option value="en">Inglês</option>
            <option value="es">Espanhol</option>
          </select>
        </div>

        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Salvando...' : 'Salvar Configurações' }}
        </button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: 'ConfiguracoesPage',
  data() {
    return {
      genero_ia: '',
      idioma: '',
      isSubmitting: false,
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async salvarConfiguracoes() {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Usuário não autenticado');
        }

        const response = await api.post(
          '/auth/configuracoes',
          {
            genero_ia: this.genero_ia,
            idioma: this.idioma
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        this.successMessage = 'Configurações salvas com sucesso!';
        console.log('Configurações salvas:', response.data);

        const user = JSON.parse(localStorage.getItem('user'));
        user.is_configured = true;
        localStorage.setItem('user', JSON.stringify(user));

        setTimeout(() => {
          this.$router.push('/chat');
        }, 1000);
      } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        this.errorMessage = error.response?.data?.message || 'Erro ao salvar configurações';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.config-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('@/assets/bg.jpg');
  background-size: cover;
  background-position: center;
}

.config-box {
  background: rgba(0, 0, 0, 0.8);
  padding: 2rem; /* Usando rem para escalar */
  border-radius: 0.5rem;
  border: 1px groove #D3B911;
  box-shadow: 0 0.25rem 0.625rem rgba(0, 0, 0, 0.5);
  text-align: center;
  width: 90%; /* Largura relativa */
  max-width: 31.25rem; /* 500px em desktop */
  box-sizing: border-box;
}

.logo {
  color: #D3B911;
  font-size: 1.5rem; /* Escala com fonte base */
  font-weight: 500;
  margin-bottom: 1rem;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  color: #FFFFFF;
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

select {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.3rem;
  background: #333;
  color: #FFFFFF;
  font-size: 0.9rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #D3B911;
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 0.9rem;
}

button:hover:not(:disabled) {
  background: #b5a00f;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #fc0909;
  margin-top: 0.75rem;
  font-size: 0.85rem;
}

.success {
  color: #00ff00;
  margin-top: 0.75rem;
  font-size: 0.85rem;
}

/* Media Queries para Responsividade */
@media (max-width: 640px) {
  .config-box {
    padding: 1rem;
    max-width: 100%; /* Usa toda a largura em celulares */
    margin: 0.5rem;
  }

  .logo {
    font-size: 1.2rem;
  }

  label {
    font-size: 0.8rem;
  }

  select {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  button {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .error, .success {
    font-size: 0.75rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .config-box {
    padding: 1.5rem;
    max-width: 25rem;
  }

  .logo {
    font-size: 1.3rem;
  }

  label, select, button {
    font-size: 0.85rem;
  }
}
</style>
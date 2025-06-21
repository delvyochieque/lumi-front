<template>
  <header class="app-header">
    <div class="header-top">
      <div class="logo">
        <span class="close-icon"></span>
        <img src="@/assets/logo-lumi.svg" alt="LUMI" class="logo-image" />
      </div>
      <div class="user-info" v-if="user">
        <span class="user-name">{{ user.nome }} {{ user.sobrenome }}</span>
        <button class="history-btn" @click="showHistoryModal = true">
          <span class="history-icon"></span> Histórico de Sessões
        </button>
        <button class="psychologist-btn" @click="requestPsychologist">
          <span class="gear-icon"></span> Solicitar Psicólogo
        </button>
      </div>
    </div>
    <div class="support-bar">
      LUMI - Suporte Emocional
      <button class="logout-btn" @click="logout">Sair</button>
    </div>

    <!-- Modal para histórico de sessões -->
    <div v-if="showHistoryModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Histórico de Sessões</h2>
        <div v-if="sessions.length > 0">
          <div
            v-for="session in sessions"
            :key="session.id"
            class="session-item"
            @click="selectSession(session.id)"
          >
            <p>
              Início: {{ formatDate(session.data_inicio) }} |
              Fim: {{ session.data_fim ? formatDate(session.data_fim) : 'Em andamento' }} |
              Status: {{ session.status }}
            </p>
          </div>
        </div>
        <div v-else>
          <p>Nenhuma sessão encontrada.</p>
        </div>
        <button class="close-btn" @click="showHistoryModal = false">Fechar</button>
      </div>
    </div>
  </header>
</template>

<script>
import api from '@/api';

export default {
  name: 'AppHeader', // Já está correto
  computed: {
    user() {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    },
  },
  data() {
    return {
      showHistoryModal: false,
      sessions: [],
    };
  },
  methods: {
    async fetchSessions() {
      try {
        const response = await api.get('/chat/historico-sessoes');
        this.sessions = response.data;
      } catch (error) {
        console.error('Erro ao buscar sessões:', error);
        alert('Erro ao buscar histórico de sessões. Tente novamente.');
      }
    },
    selectSession(sessionId) {
      this.$emit('select-session', sessionId);
      this.showHistoryModal = false;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
    requestPsychologist() {
      alert('Funcionalidade em desenvolvimento. Em breve você poderá solicitar um psicólogo!');
    },
  },
  mounted() {
    this.fetchSessions();
  },
};
</script>

<style scoped>
/* Estilos para o cabeçalho do aplicativo */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #1E1E1E;
  border-bottom: 1px solid #D3B911;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-image {
  height: 30px; /* Ajuste conforme necessário */
  width: auto;
}

.close-icon {
  color: #FFFFFF;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.close-icon:hover {
  color: #D3B911;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-name {
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 500;
}

.history-btn {
  display: flex;
  align-items: center;
  background: transparent;
  border: 1px solid #D3B911;
  color: #FFFFFF;
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-btn:hover {
  background: #D3B911;
  color: #000;
  transform: translateY(-2px);
}

.history-icon {
  margin-right: 8px;
  font-size: 16px;
}

.psychologist-btn {
  display: flex;
  align-items: center;
  background: transparent;
  border: 1px solid #D3B911;
  color: #FFFFFF;
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.psychologist-btn:hover {
  background: #D3B911;
  color: #000;
  transform: translateY(-2px);
}

.gear-icon {
  margin-right: 8px;
  font-size: 16px;
}

.support-bar {
  background: #D3B911;
  color: #000;
  padding: 8px 30px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  margin: 0 20px 0 20px;
}

.logout-btn {
  background: transparent;
  border: 1px solid #000;
  color: #000;
  padding: 5px 15px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #000;
  color: #D3B911;
  border-color: #D3B911;
  transform: translateY(-2px);
}

/* Estilo do modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #1E1E1E;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  color: #FFFFFF;
}

.modal-content h2 {
  margin-top: 0;
  color: #D3B911;
}

.session-item {
  padding: 10px;
  background: #333;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}

.session-item:hover {
  background: #444;
}

.session-item p {
  margin: 0;
  font-size: 14px;
}

.close-btn {
  background: #D3B911;
  color: #000;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
}

.close-btn:hover {
  opacity: 0.8;
}
</style>
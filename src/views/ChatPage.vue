<template>
  <div class="chat-container">
    <!-- Área de mensagens -->
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="isLoading">
        <p>Carregando mensagens...</p>
      </div>
      <div v-else-if="messages.length > 0">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.remetente === 'usuario' ? 'user-message' : 'ia-message']"
        >
          <div class="message-content">
            <p>{{ message.mensagem }}</p>
            <button
              v-if="message.remetente === 'ia'"
              class="speak-btn"
              @click="speakMessage(message.mensagem)"
            >
              <span class="speak-icon">🔊</span>
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Envie uma mensagem para começar o chat.</p>
      </div>
      <div v-if="isSending" class="typing-indicator">
        <span class="dots-icon">💬</span>
      </div>
    </div>

    <!-- Área de entrada de mensagem -->
    <div class="chat-input">
      <button class="mic-btn" @click="toggleSpeechToText" :disabled="isSending">
        <span class="mic-icon">{{ isListening ? '🎙️' : '🎤' }}</span>
      </button>
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Digite sua mensagem..."
        :disabled="isSending || isListening"
      />
      <button @click="sendMessage" :disabled="isSending || !newMessage.trim()">
        <span class="send-icon">▶</span>
      </button>
    </div>
  </div>
</template>

<script>
import api from '@/api';

export default {
  name: 'ChatPage',
  data() {
    return {
      messages: [],
      newMessage: '',
      isLoading: false,
      isSending: false,
      isListening: false,
      sessao_id: null,
      mediaRecorder: null,
      audioChunks: [],
    };
  },
  watch: {
    sessao_id(newSessaoId) {
      if (newSessaoId) {
        localStorage.setItem('lastSessionId', newSessaoId);
      } else {
        localStorage.removeItem('lastSessionId');
      }
    },
  },
  methods: {
    async createNewSession() {
      try {
        const response = await api.post('/chat/nova-sessao');
        this.sessao_id = response.data.sessao_id;
        if (response.data.iaMessage) {
          this.messages.push(response.data.iaMessage);
          this.scrollToBottom();
        }
      } catch (error) {
        console.error('Erro ao criar nova sessão:', error);
        if (error.response && error.response.status === 401) {
          alert('Sua sessão expirou. Por favor, faça login novamente.');
          this.$router.push('/login');
        } else {
          alert('Erro ao criar nova sessão. Tente novamente.');
        }
      }
    },
    async fetchMessages() {
      this.isLoading = true;
      try {
        const response = await api.get(`/chat/historico/${this.sessao_id}`);
        this.messages = response.data;
        this.scrollToBottom();
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        if (error.response && error.response.status === 401) {
          alert('Sua sessão expirou. Por favor, faça login novamente.');
          this.$router.push('/login');
        } else {
          alert('Erro ao buscar mensagens. Tente novamente.');
        }
      } finally {
        this.isLoading = false;
      }
    },
    async viewSession(sessionId) {
      try {
        console.log('Tentando reativar sessão com ID:', sessionId);
        if (this.sessao_id === sessionId) {
          console.log('A sessão já está ativa, não é necessário reativar:', sessionId);
          await this.fetchMessages();
          return;
        }
        if (this.sessao_id && this.sessao_id !== sessionId) {
          console.log('Finalizando a sessão atual:', this.sessao_id);
          await api.post(`/chat/finalizar-sessao/${this.sessao_id}`);
        }
        const response = await api.post(`/chat/reativar-sessao/${sessionId}`);
        console.log('Resposta da reativação:', response.data);
        this.sessao_id = sessionId;
        await this.fetchMessages();
      } catch (error) {
        console.error('Erro ao reativar sessão:', error);
        if (error.response) {
          console.error('Detalhes do erro:', error.response.status, error.response.data);
          if (error.response.status === 401) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            this.$router.push('/login');
          } else {
            alert(`Erro ao reativar sessão: ${error.response.data.message || 'Tente novamente.'}`);
          }
        } else {
          alert('Erro ao reativar sessão. Tente novamente.');
        }
      }
    },
    async sendMessage() {
      if (!this.newMessage.trim() || this.isSending) return;
      this.isSending = true;
      try {
        const response = await api.post('/chat/enviar', {
          mensagem: this.newMessage,
          sessao_id: this.sessao_id,
        });
        this.messages.push(response.data.userMessage);
        this.messages.push(response.data.iaMessage);
        this.newMessage = '';
        this.scrollToBottom();
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        if (error.response && error.response.status === 401) {
          alert('Sua sessão expirou. Por favor, faça login novamente.');
          this.$router.push('/login');
        } else if (error.response && error.response.status === 429) {
          alert('Limite de requisições excedido na OpenAI. Tente novamente mais tarde.');
        } else {
          alert('Erro ao enviar mensagem. Tente novamente.');
        }
      } finally {
        this.isSending = false;
      }
    },
    async endSession() {
      try {
        await api.post(`/chat/finalizar-sessao/${this.sessao_id}`);
        this.sessao_id = null;
      } catch (error) {
        console.error('Erro ao finalizar sessão:', error);
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        container.scrollTop = container.scrollHeight;
      });
    },
    async speakMessage(text) {
      try {
        const response = await api.post('/chat/text-to-speech', { text }, { responseType: 'blob' });
        const audioUrl = URL.createObjectURL(response.data);
        const audio = new Audio(audioUrl);
        audio.play();
      } catch (error) {
        console.error('Erro ao reproduzir áudio com OpenAI:', error);
        if (error.code === 'ECONNABORTED') {
          alert('A conversão de texto em fala demorou muito para responder. Usando voz nativa do navegador como alternativa.');
        } else if (error.response && error.response.status === 429) {
          alert('Limite de requisições excedido na OpenAI. Usando voz nativa do navegador como alternativa.');
        } else if (error.response && error.response.status === 403) {
          alert('Quota insuficiente na OpenAI. Usando voz nativa do navegador como alternativa.');
        } else {
          alert('Erro ao reproduzir o áudio com OpenAI. Usando voz nativa do navegador como alternativa.');
        }
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'pt-BR';
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        } else {
          alert('Seu navegador não suporta síntese de voz nativa.');
        }
      }
    },
    async toggleSpeechToText() {
      if (this.isListening) {
        this.stopSpeechToText();
      } else {
        this.startSpeechToText();
      }
    },
    async startSpeechToText() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const supportedMimeTypes = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/ogg;codecs=opus',
          'audio/wav',
        ];
        let mimeType = supportedMimeTypes.find(type => MediaRecorder.isTypeSupported(type));
        if (!mimeType) {
          console.error('Nenhum formato de áudio suportado encontrado.');
          alert('Seu navegador não suporta os formatos de áudio necessários. Tente usar outro navegador.');
          return;
        }
        console.log('Usando o formato de áudio:', mimeType);
        this.mediaRecorder = new MediaRecorder(stream, { mimeType });
        this.audioChunks = [];
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
        this.mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          const formData = new FormData();
          formData.append('audio', audioBlob, `recording.${mimeType.split('/')[1].split(';')[0]}`);
          try {
            const response = await api.post('/chat/speech-to-text', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            this.newMessage = response.data.transcription;
          } catch (error) {
            console.error('Erro ao converter áudio em texto:', error);
            if (error.response && error.response.status === 429) {
              alert('Limite de requisições excedido na OpenAI. Tente novamente mais tarde.');
            } else {
              alert('Erro ao converter áudio em texto: ' + (error.message || 'Tente novamente.'));
            }
          }
          stream.getTracks().forEach(track => track.stop());
        };
        this.mediaRecorder.start();
        this.isListening = true;
      } catch (error) {
        console.error('Erro ao acessar o microfone:', error);
        alert('Erro ao acessar o microfone. Verifique as permissões.');
      }
    },
    stopSpeechToText() {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
        this.isListening = false;
      }
    },
  },
  async mounted() {
    const sessionIdFromRoute = this.$route.params.sessionId;
    const lastSessionId = localStorage.getItem('lastSessionId');
    if (sessionIdFromRoute) {
      await this.viewSession(sessionIdFromRoute);
    } else if (lastSessionId) {
      try {
        const response = await api.get(`/chat/historico/${lastSessionId}`);
        if (response.data) {
          this.sessao_id = lastSessionId;
          await this.fetchMessages();
        } else {
          await this.createNewSession();
        }
      } catch (error) {
        console.error('Erro ao carregar última sessão:', error);
        if (error.response && error.response.status === 401) {
          alert('Sua sessão expirou. Por favor, faça login novamente.');
          this.$router.push('/login');
        } else {
          await this.createNewSession();
        }
      }
    } else {
      await this.createNewSession();
    }
  },
  async beforeUnmount() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Garante altura total */
  background: #1E1E1E;
  color: #FFFFFF;
  padding-top: 4rem; /* Ajuste para o header */
  box-sizing: border-box;
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  padding-bottom: 6rem; /* Adicionado para dar espaço à chat-input */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}


.message {
  display: flex;
  max-width: 80%;
  width: 100%;
}

.user-message {
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.ia-message {
  justify-content: flex-start;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  display: inline-block;
  text-align: justify;
  word-wrap: break-word;
  max-width: 100%;
  font-size: 0.9rem;
}

.user-message .message-content {
  background: #D3B911;
  color: #000;
}

.ia-message .message-content {
  background: #333;
  color: #FFFFFF;
}

.speak-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  margin-top: 0.3rem;
}

.speak-icon {
  font-size: 0.9rem;
  color: #D3B911;
}

.typing-indicator {
  align-self: center;
  padding: 0.5rem;
  display: flex;
  align-items: center;
}

.dots-icon {
  font-size: 1.2rem;
  color: #FFFFFF;
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-0.3rem);
  }
  60% {
    transform: translateY(-0.2rem);
  }
}

.chat-input {
  display: flex; /* Garante visibilidade */
  padding: 0.5rem 1rem;
  background: #D3B911;
  border-top: 1px solid #D3B911;
  gap: 0.5rem;
  align-items: center;
  border-radius: 1.5rem;
  margin: 0 1rem 1rem;
  position: sticky; /* Mantém no fundo */
  bottom: 0;
  z-index: 10;
}

.mic-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mic-btn:hover:not(:disabled) {
  opacity: 0.8;
}

.mic-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mic-icon {
  font-size: 1.2rem;
  color: #000;
}

.chat-input input {
  flex: 1;
  width: 70%;
  padding: 0.5rem;
  border: none;
  border-radius: 0.3rem;
  background: #FFFFFF;
  color: #000;
  font-size: 0.9rem;
}


.chat-input input:focus {
  outline: none;
}

.chat-input button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.chat-input button:hover:not(:disabled) {
  opacity: 0.8;
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  font-size: 1.2rem;
  color: #000;
}

/* Media Queries para Responsividade */
@media (max-width: 640px) {
  .chat-container {
    padding-top: 3rem; /* Ajuste para header menor */
  }

  .chat-messages {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .message {
    max-width: 90%;
  }

  .message-content {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .speak-btn {
    padding: 0.2rem;
  }

  .speak-icon {
    font-size: 0.8rem;
  }

  .chat-input {
    padding: 0.4rem 0.5rem;
    margin: 0 0.5rem 0.5rem;
    gap: 0.3rem;
  }

  .mic-btn, .chat-input button {
    padding: 0.4rem;
  }

  .mic-icon, .send-icon {
    font-size: 1rem;
  }

  .chat-input input {
    font-size: 0.8rem;
    padding: 0.4rem;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .chat-container {
    padding-top: 3.5rem;
  }

  .chat-messages {
    padding: 0.75rem;
  }

  .message {
    max-width: 85%;
  }

  .message-content {
    font-size: 0.85rem;
  }

  .chat-input {
    padding: 0.6rem 0.75rem;
    margin: 0 0.75rem 0.75rem;
  }
}

@media (min-width: 1025px) {
  .chat-input {
   
   
  }
}
</style>
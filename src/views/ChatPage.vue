<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #333;
  color: #FFFFFF;
  padding-top: 4rem;
  padding-bottom: 6rem;
  box-sizing: border-box;
  position: relative;
  width: 100%; /* Garante largura total */
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: calc(100vh - 10rem); /* Ajustado para header (4rem) + input (6rem) */
  min-height: 0;
  scrollbar-width: auto;
  scrollbar-color: #D3B911 #333;
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #333;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #D3B911;
  border-radius: 4px;
}

.message {
  display: flex;
  max-width: 90%;
  width: 100%;
  margin-bottom: 0.5rem;
}

.user-message {
  justify-content: flex-end;
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
  background: #1E1E1E;
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
  display: flex;
  padding: 0.75rem 1rem;
  background: #D3B911; /* Cor original, corrigindo fundo escuro */
  border-top: 1px solid #D3B911;
  gap: 0.5rem;
  align-items: center;
  border-radius: 20px;
  margin: 0 auto 1rem; /* Centraliza horizontalmente */
  max-width: 50rem; /* Limita largura para evitar 80% da tela */
  width: 90%; /* Ajuste para largura razoável */
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%); /* Centraliza com base no left */
  z-index: 10; /* Garante que fique acima */
  box-sizing: border-box;
  transition: transform 0.3s ease;
}

.chat-input.focused {
  transform: translate(-50%, -env(keyboard-inset-height, 0px)); /* Ajusta para teclado */
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
  padding: 0.75rem;
  border: none;
  border-radius: 20px;
  background: #000;
  color: #fff;
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
    padding-top: 3rem;
    padding-bottom: 7rem;
  }

  .chat-messages {
    padding: 0.5rem;
    gap: 0.5rem;
    max-height: calc(100vh - 10rem);
  }

  .message {
    max-width: 95%;
    margin-bottom: 0.3rem;
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
    width: 90%;
    bottom: 0.5rem;
  }

  .chat-input.focused {
    transform: translate(-50%, -env(keyboard-inset-height, 0px));
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .chat-container {
    padding-top: 3.5rem;
    padding-bottom: 6.5rem;
  }

  .chat-messages {
    padding: 0.75rem;
    gap: 0.75rem;
    max-height: calc(100vh - 10rem);
  }

  .message {
    max-width: 85%;
    margin-bottom: 0.4rem;
  }

  .message-content {
    font-size: 0.85rem;
  }

  .chat-input {
    padding: 0.6rem 0.75rem;
    width: 90%;
    bottom: 0.75rem;
  }
}

@media (min-width: 1025px) {
  .chat-input {
    max-width: 50rem;
    width: 90%;
    padding: 1rem 1.5rem;
    gap: 0.75rem;
  }

  .chat-input input {
    font-size: 1rem;
    padding: 0.75rem;
  }

  .mic-btn, .chat-input button {
    padding: 0.75rem;
  }

  .mic-icon, .send-icon {
    font-size: 1.5rem;
  }

  .message {
    max-width: 70%;
    margin-bottom: 0.75rem;
  }

  .chat-messages {
    max-height: calc(100vh - 11rem);
  }
}
</style>
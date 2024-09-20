class ChatBot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.primaryColor = this.getAttribute('primary-color') || '#007bff';
    this.secondaryColor = this.getAttribute('secondary-color') || '#ffffff';
    this.experienceId = this.getAttribute('experience') || '';
    this.assistantName = this.getAttribute('assistant') || '';

    this.shadowRoot.appendChild(this.createTemplate().content.cloneNode(true));

    this.initializeElements();
    this.addEventListeners();

    this.isInitialized = false;
    this.sessionId = this.generateUUID();
    this.lastMessageText = '';
  }

  createTemplate() {
    const template = document.createElement('template');
    template.innerHTML = `

            <style>
                ${this.getStyles()}
            </style>
            ${this.getHTML()}
        `;
    return template;
  }

  getStyles() {
    return `
      .fab {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
          background-color: ${this.primaryColor};
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: ${this.secondaryColor};
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      .expand-btn {
          cursor: pointer;
          font-size: 18px;
          margin-left: 10px;
          width: 24px;
      }
      .chat-window {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 320px;
          height: 80vh;
          background-color: ${this.secondaryColor};
          border: 1px solid #ddd;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          flex-direction: column;
          font-family: 'Roboto', sans-serif;
          display: none;
          font-size: 15px;
      }
      .chat-window.fullscreen {
          height: 90vh;
      }
      @media (max-width: 768px) {
          .chat-window {
              width: 100%;
              height: 100%;
              bottom: 0;
              right: 0;
              border-radius: 0;
              display: none;
          }
      }
      .chat-header {
          background-color: ${this.primaryColor};
          color: #f8f9fa;
          padding: 10px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
      }
      .close-btn {
          cursor: pointer;
          font-size: 18px;
          width: 24px;
      }
      .header-spacer {
        flex-grow: 1;
      }
      .video-container {
          background: black;
          width: 100%;
          position: relative;
          height: 25vh;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          z-index: 99;
      }
      .video-container.fullscreen video {
          height: 25vh;
      }
      .video-container video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 100;
      }
      .typing-indicator {
          display: none;
          font-style: italic;
          color: #888;
          margin-bottom: 10px;
          padding-left: 10px;
      }
      .chat-body {
          flex-grow: 1;
          padding: 10px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
      }
      .pre-canned-responses {
          display: flex;
          overflow-x: auto;
          padding: 10px;
          border-top: 1px solid #ccc;
          white-space: nowrap;
          min-height: 50px;
      }
      .pre-canned-responses button {
          flex: 0 0 auto;
          margin-right: 10px;
          padding: 10px 15px;
          background-color: #e0e0e0;
          color: #555;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
      }
      .chat-footer {
          display: flex;
          padding: 0;
          border-top: 1px solid #ccc;
          align-items: center;
          position: relative;
      }
      .chat-footer input {
          flex: 1;
          padding: 10px 40px 10px 10px;
          border: none;
          border-radius: 0;
          width: 100%;
          box-sizing: border-box;
      }
      .chat-footer button {
          position: absolute;
          right: 10px;
          background-color: transparent;
          border: none;
          cursor: pointer;
          font-size: 20px;
          color: #007bff;
      }
      .message {
          max-width: 70%;
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 20px;
          position: relative;
          display: inline-block;
          clear: both;
      }
      .message.user {
          background-color: #007aff;
          color: #f8f9fa;
          align-self: flex-end;
          border-bottom-right-radius: 0;
      }
      .message.assistant {
          background-color: #e5e5ea;
          color: #555;
          align-self: flex-start;
          border-bottom-left-radius: 0;
      }
    `;
  }

  getHTML() {
    return `
      <div class="fab" id="fab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 1.64.5 3.16 1.36 4.5L2 21l5.5-1.36C9.84 20.5 11.36 21 13 21c5.52 0 10-3.58 10-8s-4.48-8-10-8zm0 14c-1.3 0-2.53-.3-3.6-.84l-.4-.2-3.2.8.8-3.2-.2-.4C4.3 13.53 4 12.3 4 11c0-3.31 3.58-6 8-6s8 2.69 8 6-3.58 6-8 6z"/>
          </svg>
      </div>
      <div class="chat-window" id="chatWindow" style="display:none;">
          <div class="chat-header">
              <span>Teddy Chat</span>
              <span class="header-spacer"></span>
              <span class="expand-btn" id="expandBtn">&#x26F6;</span>
              <span class="close-btn" id="closeBtn">&times;</span>
          </div>
          <div class="video-container">
              <video src="" autoplay loop muted playsinline></video>
          </div>
          <div class="chat-body" id="chatBody"></div>
          <div class="typing-indicator" id="typingIndicator">Teddy Chat is typing...</div>
          <div class="pre-canned-responses" id="preCannedResponses"></div>
          <div class="chat-footer">
              <input type="text" id="chatInput" placeholder="Type a message...">
              <button id="sendButton">&#9658;</button>
          </div>
      </div>
    `;
  }

  initializeElements() {
    this.fab = this.shadowRoot.getElementById('fab');
    this.chatWindow = this.shadowRoot.getElementById('chatWindow');
    this.chatInput = this.shadowRoot.getElementById('chatInput');
    this.chatBody = this.shadowRoot.getElementById('chatBody');
    this.sendButton = this.shadowRoot.getElementById('sendButton');
    this.videoContainer = this.shadowRoot.querySelector('.video-container');
    this.expandBtn = this.shadowRoot.getElementById('expandBtn');
    this.closeBtn = this.shadowRoot.getElementById('closeBtn');
  }

  addEventListeners() {
    this.fab.addEventListener('click', () => this.toggleChat());
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.expandBtn.addEventListener('click', () => this.toggleExpand());
    this.closeBtn.addEventListener('click', () => this.toggleChat());
    this.chatInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') this.sendMessage();
    });
  }

  toggleExpand() {
    const isFullscreen = this.chatWindow.style.width === '100%';
    this.chatWindow.style.width = isFullscreen ? '320px' : '100%';
    this.chatWindow.style.height = isFullscreen ? '80vh' : '100%';
    this.chatWindow.style.bottom = isFullscreen ? '90px' : '0';
    this.chatWindow.style.right = isFullscreen ? '20px' : '0';
    this.videoContainer.classList.toggle('fullscreen', !isFullscreen);
  }

  toggleChat() {
    console.log(this.chatWindow.style.display);
    const isHidden = this.chatWindow.style.display === 'none';

    this.chatWindow.style.display = isHidden ? 'flex' : 'none';
    if (isHidden && !this.isInitialized) this.initializeChat();
  }

  initializeChat() {
    this.isInitialized = true;
    const experienceUrl = `https://teddy.chat/api/experiences/${this.experienceId}`;

    fetch(experienceUrl)
      .then((response) => response.json())
      .then((data) => this.setupAssistant(data))
      .catch((error) => console.error('Error fetching experience:', error));

    this.chatInput.focus();
  }

  setupAssistant(data) {
    const assistant = data.assistants.find((a) => a.name === this.assistantName);
    if (assistant) {
      this.setVideoSource(assistant.initialVideo);
      this.addMessage('assistant', assistant.initialPrompt);
      this.setupPreCannedResponses(assistant.initialResponses);
    }
  }

  setVideoSource(videoPath) {
    const videoElement = this.shadowRoot.querySelector('.video-container video');
    videoElement.src = `https://teddy.chat${videoPath}`;
  }

  addMessage(type, text) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    this.chatBody.appendChild(message);
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

  setupPreCannedResponses(responses) {
    const container = this.shadowRoot.getElementById('preCannedResponses');
    container.innerHTML = '';
    responses.forEach((response) => {
      const button = document.createElement('button');
      button.textContent = response;
      button.addEventListener('click', () => {
        this.chatInput.value = response;
        this.sendMessage();
      });
      container.appendChild(button);
    });
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  sendMessage() {
    const messageText = this.chatInput.value.trim();
    if (!messageText) return;
    this.showTypingIndicator(true);

    this.addMessage('user', messageText);
    this.lastMessageText = messageText;

    const payload = {
      experienceId: this.experienceId,
      experienceName: this.assistantName,
      message: messageText,
      assistant: 'asst_l5QYyTPEAIOi6P99FpWWZcnO',
    };

    fetch(`https://teddy.chat/api/${this.sessionId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((response) => this.handleResponse(response))
      .catch((error) => this.handleError(error));

    this.chatInput.value = '';
    this.chatInput.focus();
  }

  handleResponse(response) {
    this.showTypingIndicator(false);
    const textResponse = response.headers.get('X-Text-Response');
    return response.blob().then(() => {
      if (textResponse) {
        const decodedResponse = JSON.parse(atob(textResponse));
        this.addAssistantMessage(decodedResponse.response.text);
        this.setupPreCannedResponses(decodedResponse.response.nextPrompts);
      }
    });
  }

  handleError(error) {
    console.error('Error sending message:', error);
    this.showTypingIndicator(false);
    this.addMessage('assistant', 'Failed to send message. Please try again.');
    this.addRetryButton();
  }

  addAssistantMessage(responseText) {
    const assistantMessage = document.createElement('div');
    assistantMessage.className = 'message assistant';
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = responseText.split(urlRegex);

    parts.forEach((part) => {
      if (urlRegex.test(part)) {
        const link = document.createElement('a');
        link.href = part;
        link.textContent = 'click here';
        link.target = '_blank';
        assistantMessage.appendChild(link);
      } else {
        assistantMessage.appendChild(document.createTextNode(part));
      }
    });

    this.chatBody.appendChild(assistantMessage);
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

  addRetryButton() {
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Retry';
    retryButton.addEventListener('click', (event) => {
      this.chatInput.value = this.lastMessageText;
      this.sendMessage();
      event.target.style.display = 'none';
    });
    this.chatBody.appendChild(retryButton);
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

  showTypingIndicator(show) {
    const typingIndicator = this.shadowRoot.getElementById('typingIndicator');
    typingIndicator.style.display = show ? 'block' : 'none';
  }
}

customElements.define('chat-bot', ChatBot);

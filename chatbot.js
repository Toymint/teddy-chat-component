class ChatBot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Get color scheme from attributes
    const primaryColor = this.getAttribute('primary-color') || '#007bff';
    const secondaryColor = this.getAttribute('secondary-color') || '#ffffff';

    // Get experience ID from attribute
    this.experienceId = this.getAttribute('experience') || '';

    // Get assistant name from attribute
    this.assistantName = this.getAttribute('assistant') || '';

    // Create the template for the chat component
    const template = document.createElement('template');
    template.innerHTML = `        

            <style>                                                                                                                             
                /* Styles for the FAB button */
                .fab {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 56px;
                    height: 56px;
                    background-color: ${primaryColor};
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: ${secondaryColor};
                    font-size: 20px;
                    cursor: pointer;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                /* Styles for the chat window */
                .chat-window {
                    position: fixed;
                    bottom: 90px;
                    right: 20px;
                    width: 320px;
                    height: 80vh;
                    background-color: ${secondaryColor};
                    border: 1px solid #ddd;
                    border-radius: 12px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    display: none;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-size: 14px;
                }

                @media (max-width: 768px) {
                    .chat-window {
                        width: 100%;
                        height: 100%;
                        bottom: 0;
                        right: 0;
                        border-radius: 0;
                    }
                }

                .chat-header {
                    background-color: ${primaryColor};
                    color: white;
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
                }
                                                                                                                                          
                                                                                                                                                
                .video-container {
                    width: 100%;
                    position: relative;
                    padding-bottom: 56.25%; /* 16:9 aspect ratio */
                    height: 0;
                    overflow: hidden;
                }

                .video-container video {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
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
                }

                .pre-canned-responses button {
                    flex: 0 0 auto;
                    margin-right: 10px;
                    padding: 5px 10px;
                    background-color: #f0f0f0;
                    color: #333;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .chat-footer {
                    display: flex;
                    padding: 10px;
                    border-top: 1px solid #ccc;
                    align-items: center;
                }                                                                                                                               
                                                                                                                                                
                .chat-footer input {                                                                                                            
                    flex: 1;                                                                                                                    
                    padding: 5px;                                                                                                               
                    border: 1px solid #ccc;                                                                                                     
                    border-radius: 4px;                                                                                                         
                }                                                                                                                               
                                                                                                                                                
                .chat-footer button {                                                                                                           
                    margin-left: 5px;                                                                                                           
                    padding: 5px 10px;                                                                                                          
                    background-color: #007bff;                                                                                                  
                    color: white;                                                                                                               
                    border: none;                                                                                                               
                    border-radius: 4px;                                                                                                         
                    cursor: pointer;                                                                                                            
                }                                                                                                                               
                                                                                                                                                
                .message {                                                                                                                      
                    margin-bottom: 10px;                                                                                                        
                }                                                                                                                               
                                                                                                                                                
                .message.user {                                                                                                                 
                    text-align: right;                                                                                                          
                }                                                                                                                               
                                                                                                                                                
                .message.assistant {                                                                                                            
                    text-align: left;                                                                                                           
                }                                                                                                                               
            </style>                                                                                                                            
            <div class="fab" id="fab">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">
                    <path d="M12 3C6.48 3 2 6.58 2 11c0 1.64.5 3.16 1.36 4.5L2 21l5.5-1.36C9.84 20.5 11.36 21 13 21c5.52 0 10-3.58 10-8s-4.48-8-10-8zm0 14c-1.3 0-2.53-.3-3.6-.84l-.4-.2-3.2.8.8-3.2-.2-.4C4.3 13.53 4 12.3 4 11c0-3.31 3.58-6 8-6s8 2.69 8 6-3.58 6-8 6z"/>
                </svg>
            </div>
            <div class="chat-window" id="chatWindow">                                                                                           
                <div class="chat-header">
                    <span>Chatbot</span>
                    <span class="close-btn" id="closeBtn">&times;</span>
                </div>
                <div class="video-container">
                    <video src="" autoplay loop muted playsinline></video>
                </div>
                <div class="chat-body" id="chatBody">
                </div>
                <div class="pre-canned-responses" id="preCannedResponses"></div>
                <div class="chat-footer">                                                                                                       
                    <input type="text" id="chatInput" placeholder="Type a message...">                                                          
                    <button id="sendButton">Send</button>                                                                                       
                </div>                                                                                                                          
            </div>                                                                                                                              
        `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.fab = this.shadowRoot.getElementById('fab');
    this.chatWindow = this.shadowRoot.getElementById('chatWindow');
    this.chatWindow.style.display = 'none';
    this.chatInput = this.shadowRoot.getElementById('chatInput');
    this.chatBody = this.shadowRoot.getElementById('chatBody');
    this.sendButton = this.shadowRoot.getElementById('sendButton');

    this.fab.addEventListener('click', () => this.toggleChat());
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.closeBtn = this.shadowRoot.getElementById('closeBtn');
    this.closeBtn.addEventListener('click', () => this.toggleChat());

    this.chatInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.sendMessage();
      }
    });
    this.isInitialized = false;
    this.sessionId = this.generateUUID();
  }

  toggleChat() {
    this.chatWindow.style.display = this.chatWindow.style.display === 'none' ? 'flex' : 'none';
    if (this.chatWindow.style.display === 'flex' && !this.isInitialized) {
      this.isInitialized = true;
      const experienceUrl = `https://teddy.chat/api/experiences/${this.experienceId}`;

      fetch(experienceUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log('Experience Data:', data);
          const assistant = data.assistants.find((a) => a.name === this.assistantName);
          if (assistant) {
            console.log('Assistant Found:', assistant);
            const videoElement = this.shadowRoot.querySelector('.video-container video');
            videoElement.src = `https://teddy.chat${assistant.initialVideo}`;
            const initialMessage = document.createElement('div');
            initialMessage.className = 'message assistant';
            initialMessage.textContent = assistant.initialPrompt;
            this.chatBody.appendChild(initialMessage);
            const preCannedResponsesContainer = this.shadowRoot.getElementById('preCannedResponses');
            assistant.initialResponses.forEach((response) => {
              const button = document.createElement('button');
              button.textContent = response;
              button.addEventListener('click', () => {
                this.chatInput.value = response;
                this.sendMessage();
              });
              preCannedResponsesContainer.appendChild(button);
            });
          }
        })
        .catch((error) => console.error('Error fetching experience:', error));

      this.chatInput.focus();
    }
  }

  generateUUID() {
    // Generate a random UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  sendMessage() {
    const messageText = this.chatInput.value.trim();

    if (messageText) {
      const userMessage = document.createElement('div');
      userMessage.className = 'message user';
      userMessage.textContent = messageText;
      this.chatBody.appendChild(userMessage);

      const payload = {
        experienceId: this.experienceId,
        experienceName: this.assistantName,
        message: messageText,
        assistant: 'asst_l5QYyTPEAIOi6P99FpWWZcnO', // Replace with actual assistant ID if needed
      };

      fetch(`https://teddy.chat/api/${this.sessionId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          console.log(response.headers);
          const textResponse = response.headers.get('X-Text-Response');
          console.log(textResponse);
          // Extract audio from response body
          return response.blob().then((blob) => {
            /*
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audio.play();
            */

            // Decode and display the text response from the header
            const encodedText = textResponse;

            if (encodedText) {
              const decodedText = atob(encodedText);
              console.log(decodedText);
              const assistantMessage = document.createElement('div');
              assistantMessage.className = 'message assistant';
              assistantMessage.textContent = decodedText;
              this.chatBody.appendChild(assistantMessage);
              this.chatBody.scrollTop = this.chatBody.scrollHeight;
            }
          });
        })
        .catch((error) => {
          console.error('Error sending message:', error);
        });
      this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }
  }
}

customElements.define('chat-bot', ChatBot);

class ChatBot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Create the template for the chat component
    const template = document.createElement('template');
    template.innerHTML = `                                                                                                                  
            <style>                                                                                                                             
                /* Styles for the FAB button */                                                                                                 
                .fab {                                                                                                                          
                    position: fixed;                                                                                                            
                    bottom: 20px;                                                                                                               
                    right: 20px;                                                                                                                
                    width: 60px;                                                                                                                
                    height: 60px;                                                                                                               
                    background-color: #007bff;                                                                                                  
                    border-radius: 50%;                                                                                                         
                    display: flex;                                                                                                              
                    justify-content: center;                                                                                                    
                    align-items: center;                                                                                                        
                    color: white;                                                                                                               
                    font-size: 24px;                                                                                                            
                    cursor: pointer;                                                                                                            
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);                                                                                   
                }

                /* Styles for the chat window */
                .chat-window {
                    position: fixed;
                    bottom: 90px;
                    right: 20px;
                    width: 300px;
                    height: 40vh;
                    background-color: white;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
                    display: none;
                    flex-direction: column;
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
                    background-color: #007bff;
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
                }                                                                                                                               
                                                                                                                                                
                .chat-body {
                    flex: 1;
                    padding: 10px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
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
            <div class="fab" id="fab">+</div>                                                                                                   
            <div class="chat-window" id="chatWindow">                                                                                           
                <div class="chat-header">
                    <span>Chatbot</span>
                    <span class="close-btn" id="closeBtn">&times;</span>
                </div>
                <div class="chat-body" id="chatBody">                                                                                           
                    <div class="message assistant">Hello! How can I assist you today?</div>                                                     
                </div>                                                                                                                          
                <div class="chat-footer">                                                                                                       
                    <input type="text" id="chatInput" placeholder="Type a message...">                                                          
                    <button id="sendButton">Send</button>                                                                                       
                </div>                                                                                                                          
            </div>                                                                                                                              
        `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.fab = this.shadowRoot.getElementById('fab');
    this.chatWindow = this.shadowRoot.getElementById('chatWindow');
    this.chatInput = this.shadowRoot.getElementById('chatInput');
    this.chatBody = this.shadowRoot.getElementById('chatBody');
    this.sendButton = this.shadowRoot.getElementById('sendButton');

    this.fab.addEventListener('click', () => this.toggleChat());
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.closeBtn = this.shadowRoot.getElementById('closeBtn');
    this.closeBtn.addEventListener('click', () => this.toggleChat());
    this.closeBtn = this.shadowRoot.getElementById('closeBtn');
    this.closeBtn.addEventListener('click', () => this.toggleChat());

    this.chatInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  toggleChat() {
    this.chatWindow.style.display = this.chatWindow.style.display === 'none' ? 'flex' : 'none';
    if (this.chatWindow.style.display === 'flex') {
      this.chatInput.focus();
    }
  }

  sendMessage() {
    const messageText = this.chatInput.value.trim();

    if (messageText) {
      const userMessage = document.createElement('div');
      userMessage.className = 'message user';
      userMessage.textContent = messageText;
      this.chatBody.appendChild(userMessage);

      this.chatInput.value = '';
      this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }
  }
}

customElements.define('chat-bot', ChatBot);

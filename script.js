// DOM Elements
const homePage = document.getElementById('home-page');
const chatPage = document.getElementById('chat-page');
const contactList = document.getElementById('contact-list');
const backButton = document.getElementById('back-button');
const chatTitle = document.getElementById('chat-title');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Sample Contacts Data
const contacts = [
  { id: 1, name: "John Doe", order: "Order #1234 - 2x T-Shirts" },
  { id: 2, name: "Jane Smith", order: "Order #5678 - 1x Jeans" }
];

let currentContactId = null; // Track the active chat

function loadContacts() {
    contactList.innerHTML = '';
    contacts.forEach(contact => {
      const contactDiv = document.createElement('div');
      contactDiv.className = 'contact';
      
      // Avatar (using first letter of name)
      const avatar = document.createElement('div');
      avatar.className = 'contact-avatar';
      avatar.textContent = contact.name.charAt(0).toUpperCase();
      
      // Contact info
      const infoDiv = document.createElement('div');
      infoDiv.className = 'contact-info';
      
      const nameDiv = document.createElement('div');
      nameDiv.className = 'contact-name';
      nameDiv.textContent = contact.name;
      
      const orderDiv = document.createElement('div');
      orderDiv.className = 'contact-order';
      orderDiv.textContent = contact.order;
      
      // Assemble
      infoDiv.appendChild(nameDiv);
      infoDiv.appendChild(orderDiv);
      contactDiv.appendChild(avatar);
      contactDiv.appendChild(infoDiv);
      
      // Click event
      contactDiv.addEventListener('click', () => openChat(contact));
      contactList.appendChild(contactDiv);
    });
  }

// Open Chat for a Contact
function openChat(contact) {
  currentContactId = contact.id;
  homePage.style.display = 'none';
  chatPage.style.display = 'block';
  chatTitle.textContent = contact.order;
  loadMessages(contact.id);
} 

// Load Messages for a Contact
function loadMessages(contactId) {
  chatMessages.innerHTML = '';
  const messages = JSON.parse(localStorage.getItem(`chat_${contactId}`)) || [];
  messages.forEach(msg => addMessageToUI(msg.sender, msg.text));
}

// Add Message to UI
function addMessageToUI(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Save Message to LocalStorage
function saveMessage(contactId, sender, text) {
  const messages = JSON.parse(localStorage.getItem(`chat_${contactId}`)) || [];
  messages.push({ sender, text });
  localStorage.setItem(`chat_${contactId}`, JSON.stringify(messages));
}

// Send Message
function sendMessage() {
  const text = messageInput.value.trim();
  if (text && currentContactId) {
    addMessageToUI('seller', text);
    saveMessage(currentContactId, 'seller', text);
    messageInput.value = '';
  }
}

// Event Listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
backButton.addEventListener('click', () => {
  chatPage.style.display = 'none';
  homePage.style.display = 'block';
});

// Initialize
loadContacts();

// Demo: Auto-add a customer message to John Doe's chat
if (!localStorage.getItem('chat_1')) {
  saveMessage(1, 'customer', 'Hi, when will my order arrive?');
}
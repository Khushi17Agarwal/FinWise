// 🤖 FinWise Chatbot - Rule-based FAQ System
class FinWiseChatbot {
  constructor() {
    this.isOpen = false;
    this.messageHistory = [];
    this.currentContext = null;
    
    // Initialize chatbot
    this.init();
    this.setupEventListeners();
    this.loadFAQDatabase();
  }

  init() {
    // Get DOM elements
    this.toggleBtn = document.getElementById('chatbot-toggle');
    this.chatWindow = document.getElementById('chatbot-window');
    this.closeBtn = document.getElementById('chatbot-close');
    this.messagesContainer = document.getElementById('chatbot-messages');
    this.inputField = document.getElementById('chatbot-input');
    this.sendBtn = document.getElementById('chatbot-send');
    this.quickActions = document.getElementById('chatbot-quick-actions');
    
    // Add initial welcome message
    this.addWelcomeMessage();
  }

  setupEventListeners() {
    // Toggle chatbot
    this.toggleBtn.addEventListener('click', () => this.toggleChat());
    this.closeBtn.addEventListener('click', () => this.closeChat());
    
    // Send message
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
    
    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        this.handleQuickAction(action);
      });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#chatbot-widget') && this.isOpen) {
        this.closeChat();
      }
    });
  }

  loadFAQDatabase() {
    this.faqDatabase = {
      // Budgeting & Saving
      budgeting: {
        keywords: ['budget', 'budgeting', 'expense', 'income', 'spending', 'money management', 'financial plan'],
        responses: [
          "Creating a budget is the foundation of financial health! Here's how to start:",
          "📊 **50/30/20 Rule**: Allocate 50% to needs, 30% to wants, 20% to savings",
          "📝 **Track Expenses**: Use apps like Mint or YNAB to monitor spending",
          "🎯 **Set Goals**: Define short-term and long-term financial objectives",
          "💡 **Pro Tip**: Start with tracking expenses for one month before creating your budget"
        ]
      },
      
      saving: {
        keywords: ['save', 'saving', 'emergency fund', 'savings account', 'money saving', 'frugal'],
        responses: [
          "Building savings is crucial for financial security! Here are key strategies:",
          "🚨 **Emergency Fund**: Save 3-6 months of expenses for unexpected situations",
          "💰 **Automate Savings**: Set up automatic transfers to savings accounts",
          "📈 **High-Yield Accounts**: Use accounts with better interest rates",
          "🎯 **SMART Goals**: Specific, Measurable, Achievable, Relevant, Time-bound savings targets"
        ]
      },
      
      investing: {
        keywords: ['invest', 'investment', 'stocks', 'bonds', 'portfolio', 'mutual funds', 'etf', 'crypto'],
        responses: [
          "Investing can help grow your wealth over time! Key principles:",
          "📚 **Start with Education**: Learn basics before investing real money",
          "🎯 **Diversification**: Don't put all eggs in one basket",
          "⏰ **Time Horizon**: Longer investments can handle more risk",
          "💰 **Start Small**: Begin with low-cost index funds or ETFs",
          "⚠️ **Risk Management**: Only invest money you can afford to lose"
        ]
      },
      
      debt: {
        keywords: ['debt', 'credit card', 'loan', 'pay off', 'debt management', 'interest'],
        responses: [
          "Managing debt effectively is key to financial freedom:",
          "📊 **Debt Snowball**: Pay smallest debts first for motivation",
          "📈 **Debt Avalanche**: Pay highest interest debts first for efficiency",
          "💳 **Credit Cards**: Pay more than minimum payments",
          "📝 **Consolidation**: Consider debt consolidation for multiple debts",
          "🚫 **Avoid New Debt**: Stop accumulating while paying off existing debt"
        ]
      },
      
      retirement: {
        keywords: ['retirement', '401k', 'ira', 'pension', 'social security', 'retirement planning'],
        responses: [
          "Planning for retirement early gives you the best advantage:",
          "⏰ **Start Early**: Time is your biggest asset in retirement planning",
          "💰 **401(k) Match**: Take full advantage of employer matching",
          "📈 **IRA Options**: Consider Traditional vs Roth IRA benefits",
          "🎯 **Rule of Thumb**: Save 10-15% of income for retirement",
          "📊 **Diversify**: Mix stocks, bonds, and other assets"
        ]
      },
      
      credit: {
        keywords: ['credit score', 'credit report', 'credit card', 'credit history', 'fico'],
        responses: [
          "Good credit opens doors to better financial opportunities:",
          "📊 **Credit Score Factors**: Payment history (35%), amounts owed (30%), length of history (15%)",
          "✅ **Build Credit**: Use credit cards responsibly, pay on time",
          "📈 **Monitor Regularly**: Check credit reports annually",
          "🚫 **Avoid**: Late payments, high credit utilization, too many applications",
          "💡 **Pro Tip**: Keep credit utilization below 30%"
        ]
      },
      
      general: {
        keywords: ['help', 'what', 'how', 'explain', 'learn', 'beginner', 'start'],
        responses: [
          "I'm here to help you with all things financial literacy! Here are some topics I can assist with:",
          "💰 **Budgeting**: Creating and managing budgets",
          "📈 **Investing**: Understanding investment basics",
          "💳 **Credit**: Building and maintaining good credit",
          "🎯 **Goal Setting**: Planning financial objectives",
          "📚 **Education**: Explaining financial concepts",
          "What specific area would you like to explore?"
        ]
      }
    };
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.openChat();
    } else {
      this.closeChat();
    }
  }

  openChat() {
    this.chatWindow.classList.add('active');
    this.inputField.focus();
    this.isOpen = true;
  }

  closeChat() {
    this.chatWindow.classList.remove('active');
    this.isOpen = false;
  }

  addWelcomeMessage() {
    // Welcome message is already in HTML
  }

  sendMessage() {
    const message = this.inputField.value.trim();
    if (!message) return;

    // Add user message
    this.addMessage(message, 'user');
    this.inputField.value = '';
    
    // Process and respond
    setTimeout(() => {
      this.processMessage(message);
    }, 500);
  }

  handleQuickAction(action) {
    const actionMessages = {
      budgeting: "Tell me about budgeting basics",
      investing: "How do I start investing?",
      saving: "What are the best saving strategies?",
      debt: "Help me manage my debt"
    };
    
    const message = actionMessages[action];
    this.addMessage(message, 'user');
    
    setTimeout(() => {
      this.processMessage(message);
    }, 500);
  }

  addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (sender === 'bot') {
      // Parse bot responses (support for arrays and strings)
      if (Array.isArray(content)) {
        content.forEach((line, index) => {
          if (line.startsWith('**') && line.endsWith('**')) {
            const strong = document.createElement('strong');
            strong.textContent = line.slice(2, -2);
            messageContent.appendChild(strong);
            messageContent.appendChild(document.createElement('br'));
          } else if (line.startsWith('📊') || line.startsWith('💰') || line.startsWith('🎯') || 
                     line.startsWith('💡') || line.startsWith('🚨') || line.startsWith('📈') || 
                     line.startsWith('⚠️') || line.startsWith('⏰') || line.startsWith('📝') || 
                     line.startsWith('🚫') || line.startsWith('✅') || line.startsWith('📚')) {
            const p = document.createElement('p');
            p.textContent = line;
            messageContent.appendChild(p);
          } else {
            const p = document.createElement('p');
            p.textContent = line;
            messageContent.appendChild(p);
          }
        });
      } else {
        const p = document.createElement('p');
        p.textContent = content;
        messageContent.appendChild(p);
      }
    } else {
      const p = document.createElement('p');
      p.textContent = content;
      messageContent.appendChild(p);
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();
    
    // Store in history
    this.messageHistory.push({ content, sender, timestamp: new Date() });
  }

  processMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response = null;
    let matchedCategory = null;
    
    // Show typing indicator
    this.showTypingIndicator();
    
    setTimeout(() => {
      this.hideTypingIndicator();
      
      // Check for exact matches first
      for (const [category, data] of Object.entries(this.faqDatabase)) {
        if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
          response = data.responses;
          matchedCategory = category;
          break;
        }
      }
      
      // If no specific match, try general responses
      if (!response) {
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
          response = [
            "Hello! 👋 I'm your FinWise assistant. I can help you with budgeting, investing, saving, debt management, and more!",
            "What financial topic would you like to explore today?"
          ];
        } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
          response = [
            "You're welcome! 😊 I'm here whenever you need help with your financial journey.",
            "Feel free to ask me anything about personal finance!"
          ];
        } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
          response = [
            "Goodbye! 👋 Remember, financial literacy is a journey, not a destination.",
            "Come back anytime you need guidance on your financial goals!"
          ];
        } else {
          response = [
            "I understand you're asking about: \"" + message + "\"",
            "While I'm designed to help with financial literacy topics, I might not have specific information about that.",
            "Here are some areas I can definitely help with:",
            "💰 Budgeting and expense tracking",
            "📈 Investment basics and strategies", 
            "💳 Credit management and building",
            "🎯 Financial goal setting",
            "📚 Understanding financial concepts",
            "Could you rephrase your question or ask about one of these topics?"
          ];
        }
      }
      
      this.addMessage(response, 'bot');
      
      // Update context for follow-up questions
      this.currentContext = matchedCategory;
      
    }, 1000 + Math.random() * 1000); // Simulate thinking time
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'message-content';
    
    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    dots.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    
    typingContent.appendChild(dots);
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(typingContent);
    
    this.messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  // Utility method to add new FAQ entries
  addFAQ(category, keywords, responses) {
    if (!this.faqDatabase[category]) {
      this.faqDatabase[category] = { keywords: [], responses: [] };
    }
    this.faqDatabase[category].keywords.push(...keywords);
    this.faqDatabase[category].responses.push(...responses);
  }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if chatbot elements exist
  if (document.getElementById('chatbot-toggle')) {
    window.finWiseChatbot = new FinWiseChatbot();
  }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FinWiseChatbot;
}
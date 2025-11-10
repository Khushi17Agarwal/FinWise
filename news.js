const container = document.getElementById("news-container");

// ✅ Using your NewsAPI key
const API_KEY = "886c98cf66ee4ad8a577cffdcd20c24e";
const API_URL = `https://newsapi.org/v2/everything?q=finance%20OR%20investment%20OR%20stock%20market&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`;

async function fetchFinancialNews() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Network issue");

    const data = await response.json();
    container.innerHTML = "";

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = `<p style="text-align:center;">No financial news available at the moment.</p>`;
      return;
    }

    data.articles.forEach(article => {
      const card = document.createElement("div");
      card.classList.add("news-card");

      const image = article.urlToImage || "https://via.placeholder.com/320x180?text=Finance+News";
      const title = article.title || "Untitled Article";
      const description = article.description
        ? article.description.slice(0, 120) + "..."
        : "Read the full article for details.";
      const source = article.source?.name || "Unknown Source";
      const date = article.publishedAt
        ? new Date(article.publishedAt).toLocaleDateString()
        : "N/A";

      card.innerHTML = `
        <img src="${image}" alt="News Image" />
        <div class="news-content">
          <h3>${title}</h3>
          <p>${description}</p>
          <div class="news-meta">
            <span>${source}</span>
            <span>${date}</span>
          </div>
          <a href="${article.url}" target="_blank" class="read-more">Read More</a>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching financial news:", error);
    container.innerHTML = `<p style="color:red;text-align:center;">Failed to load news. Please try again later.</p>`;
  }
}

fetchFinancialNews();

// Authentication functionality for news page
document.addEventListener("DOMContentLoaded", function() {
  // Login functionality
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      
      if (email && password) {
        // Simulate login process
        const loginBtn = this.querySelector(".auth-btn");
        loginBtn.textContent = "Logging in...";
        loginBtn.disabled = true;
        
        setTimeout(() => {
          alert("Welcome back to FinWise! 🎉");
          document.getElementById("loginModal").style.display = "none";
          loginBtn.textContent = "Login";
          loginBtn.disabled = false;
          loginForm.reset();
        }, 1500);
      }
    });
  }

  // Signup functionality
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const ageRange = document.getElementById("ageRange").value;
      const agreeTerms = document.getElementById("agreeTerms").checked;
      
      if (password !== confirmPassword) {
        alert("Passwords don't match! Please try again.");
        return;
      }
      
      if (!agreeTerms) {
        alert("Please agree to the Terms of Service and Privacy Policy.");
        return;
      }
      
      if (name && email && password && ageRange) {
        // Simulate signup process
        const signupBtn = this.querySelector(".auth-btn");
        signupBtn.textContent = "Creating Account...";
        signupBtn.disabled = true;
        
        setTimeout(() => {
          alert(`Welcome to FinWise, ${name}! 🎉 Your account has been created successfully.`);
          document.getElementById("signupModal").style.display = "none";
          signupBtn.textContent = "Create Account";
          signupBtn.disabled = false;
          signupForm.reset();
        }, 2000);
      }
    });
  }

  // Modal switching functionality
  const showSignupLink = document.getElementById("showSignup");
  const showLoginLink = document.getElementById("showLogin");
  
  if (showSignupLink) {
    showSignupLink.addEventListener("click", function(e) {
      e.preventDefault();
      document.getElementById("loginModal").style.display = "none";
      document.getElementById("signupModal").style.display = "block";
    });
  }
  
  if (showLoginLink) {
    showLoginLink.addEventListener("click", function(e) {
      e.preventDefault();
      document.getElementById("signupModal").style.display = "none";
      document.getElementById("loginModal").style.display = "block";
    });
  }

  // Login button in navbar
  const loginNavLink = document.querySelector('a[href="#"]');
  if (loginNavLink && loginNavLink.textContent.trim() === "Login") {
    loginNavLink.addEventListener("click", function(e) {
      e.preventDefault();
      document.getElementById("loginModal").style.display = "block";
    });
  }

  // Modal functionality
  const modals = document.querySelectorAll(".modal");
  const closeBtns = document.querySelectorAll(".close");

  // Close modals when clicking X
  closeBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      this.closest(".modal").style.display = "none";
    });
  });

  // Close modals when clicking outside
  window.addEventListener("click", function(event) {
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
});

// Chatbot functionality for news page
document.addEventListener("DOMContentLoaded", function() {
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotContainer = document.getElementById("chatbotContainer");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatbotInput = document.getElementById("chatbotInput");
  const chatbotSend = document.getElementById("chatbotSend");
  const chatbotMessages = document.getElementById("chatbotMessages");

  if (chatbotToggle && chatbotContainer) {
    // Toggle chatbot
    chatbotToggle.addEventListener("click", function() {
      chatbotContainer.classList.toggle("active");
      if (chatbotContainer.classList.contains("active")) {
        chatbotInput.focus();
      }
    });

    // Close chatbot
    if (chatbotClose) {
      chatbotClose.addEventListener("click", function() {
        chatbotContainer.classList.remove("active");
      });
    }

    // Send message function
    function sendMessage() {
      const message = chatbotInput.value.trim();
      if (message) {
        // Add user message
        addMessage(message, "user");
        chatbotInput.value = "";
        
        // Generate bot response
        setTimeout(() => {
          const response = generateResponse(message);
          addMessage(response, "bot");
        }, 1000);
      }
    }

    // Send button click
    if (chatbotSend) {
      chatbotSend.addEventListener("click", sendMessage);
    }

    // Enter key press
    if (chatbotInput) {
      chatbotInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
          sendMessage();
        }
      });
    }

    // Add message to chat
    function addMessage(text, sender) {
      const messageDiv = document.createElement("div");
      messageDiv.className = `chatbot-message ${sender}-message`;
      messageDiv.innerHTML = `<p>${text}</p>`;
      chatbotMessages.appendChild(messageDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Generate bot responses
    function generateResponse(userMessage) {
      const message = userMessage.toLowerCase();
      
      // News related responses
      if (message.includes("news") || message.includes("market") || message.includes("stock")) {
        return "Great question about financial news! 📰 Here's what you should know:<br><br>" +
               "• Stay informed but don't make emotional decisions<br>" +
               "• Focus on long-term trends rather than daily fluctuations<br>" +
               "• Use news to understand market sentiment, not timing<br>" +
               "• Consider multiple sources for balanced perspectives<br><br>" +
               "The news on this page is updated regularly. What specific market topic interests you?";
      }
      
      // Budget related responses
      if (message.includes("budget") || message.includes("expense") || message.includes("income")) {
        return "Great question about budgeting! 💰 Here are some key tips:<br><br>" +
               "• Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings<br>" +
               "• Track your expenses for at least one month<br>" +
               "• Use our Budget Calculator tool in Resources<br>" +
               "• Set up automatic transfers to savings<br><br>" +
               "Would you like me to explain any of these tips in more detail?";
      }
      
      // Investment related responses
      if (message.includes("invest") || message.includes("portfolio")) {
        return "Investing is a great way to build wealth! 📈 Here's what you should know:<br><br>" +
               "• Start with index funds for diversification<br>" +
               "• Consider your risk tolerance and timeline<br>" +
               "• Use our Investment Calculator to see potential returns<br>" +
               "• Don't try to time the market - invest consistently<br><br>" +
               "Remember: Past performance doesn't guarantee future results!";
      }
      
      // Debt related responses
      if (message.includes("debt") || message.includes("loan") || message.includes("credit")) {
        return "Managing debt is crucial for financial health! 💳 Here are some strategies:<br><br>" +
               "• Pay high-interest debt first (debt avalanche)<br>" +
               "• Consider debt consolidation if rates are high<br>" +
               "• Use our Debt Calculator to plan payments<br>" +
               "• Avoid taking on new debt while paying off existing<br><br>" +
               "Would you like help creating a debt payoff plan?";
      }
      
      // Savings related responses
      if (message.includes("save") || message.includes("emergency") || message.includes("goal")) {
        return "Building savings is essential! 🎯 Here's how to get started:<br><br>" +
               "• Build an emergency fund (3-6 months expenses)<br>" +
               "• Set specific, measurable financial goals<br>" +
               "• Use our Financial Goal Planner tool<br>" +
               "• Automate your savings transfers<br><br>" +
               "What specific savings goal are you working towards?";
      }
      
      // Greeting responses
      if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
        return "Hello! 👋 I'm here to help you with all things finance. " +
               "You can ask me about budgeting, investing, debt management, savings goals, or any financial questions you have!";
      }
      
      // Help responses
      if (message.includes("help") || message.includes("what can you do")) {
        return "I can help you with:<br><br>" +
               "💰 Budget planning and expense tracking<br>" +
               "📈 Investment strategies and portfolio advice<br>" +
               "🎯 Setting and achieving financial goals<br>" +
               "💳 Debt management and payoff strategies<br>" +
               "📚 Financial literacy and education<br><br>" +
               "Just ask me anything about personal finance!";
      }
      
      // Default response
      return "That's an interesting question! 🤔 While I specialize in personal finance topics like budgeting, investing, debt management, and financial planning, I'd be happy to help you with any financial questions you have. " +
             "Try asking me about:<br><br>" +
             "• How to create a budget<br>" +
             "• Investment strategies for beginners<br>" +
             "• Debt payoff methods<br>" +
             "• Building an emergency fund<br>" +
             "• Financial goal setting";
    }
  }
});
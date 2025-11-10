// Highlight active navbar link
const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {
  link.addEventListener("click", function() {
    // Only update active-link class for top-level navigation links
    if (this.closest('.dropdown-menu') === null) {
        navLinks.forEach(l => l.classList.remove("active-link"));
        this.classList.add("active-link");
    }
  });
});

// Update active link based on current page
document.addEventListener("DOMContentLoaded", function() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    // Check for exact page match or index.html when path is empty
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active-link");
    } else {
      link.classList.remove("active-link");
    }
    
    // Also check for the main "Resources" link if any of its dropdown items lead to the current page's base URL
    if (currentPage === "resources.html" && link.getAttribute("href") === "resources.html") {
        link.classList.add("active-link");
    }
  });
});

// Authentication functionality
document.addEventListener("DOMContentLoaded", function() {
  // Login functionality
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      if (!email || !password) return;

      const loginBtn = this.querySelector(".auth-btn");
      loginBtn.textContent = "Logging in...";
      loginBtn.disabled = true;

      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.ok) {
            const msg = data.message || "Login failed";
            throw new Error(msg);
          }
          // Persist minimal session indicator
          try {
            localStorage.setItem("finwiseUser", JSON.stringify(data.user));
          } catch (_) {}
          document.getElementById("loginModal").style.display = "none";
          // Redirect to home page
          window.location.href = "index.html";
        })
        .catch((err) => {
          alert(err.message || "Unable to login. Please try again.");
        })
        .finally(() => {
          loginBtn.textContent = "Login";
          loginBtn.disabled = false;
        });
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

      if (!(name && email && password && ageRange)) return;

      const signupBtn = this.querySelector(".auth-btn");
      signupBtn.textContent = "Creating Account...";
      signupBtn.disabled = true;

      fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.ok) {
            const msg = data.message || "Signup failed";
            throw new Error(msg);
          }
          alert(`Welcome to FinWise, ${name}! 🎉 Your account has been created successfully.`);
          document.getElementById("signupModal").style.display = "none";
          // Optionally auto-fill login email
          const loginEmail = document.getElementById("loginEmail");
          if (loginEmail) loginEmail.value = email;
          // Show login modal
          document.getElementById("loginModal").style.display = "block";
        })
        .catch((err) => {
          alert(err.message || "Unable to sign up. Please try again.");
        })
        .finally(() => {
          signupBtn.textContent = "Create Account";
          signupBtn.disabled = false;
        });
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
});

// Tool buttons functionality
const toolBtns = document.querySelectorAll(".tool-btn");
toolBtns.forEach(btn => {
  btn.addEventListener("click", function() {
    const toolName = this.closest(".tool-card").querySelector("h4").textContent;
    
    // Open appropriate modal based on tool name
    if (toolName.includes("Budget Calculator")) {
      document.getElementById("budgetModal").style.display = "block";
    } else if (toolName.includes("Investment Calculator")) {
      document.getElementById("investmentModal").style.display = "block";
    } else if (toolName.includes("Financial Goal Planner")) {
      document.getElementById("goalModal").style.display = "block";
    } else if (toolName.includes("Debt Calculator")) {
      document.getElementById("debtModal").style.display = "block";
    }
  });
});

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

// Budget Calculator functionality
document.getElementById("calculateBudget").addEventListener("click", function() {
  const income = parseFloat(document.getElementById("monthlyIncome").value) || 0;
  const housing = parseFloat(document.getElementById("housing").value) || 0;
  const utilities = parseFloat(document.getElementById("utilities").value) || 0;
  const groceries = parseFloat(document.getElementById("groceries").value) || 0;
  const transportation = parseFloat(document.getElementById("transportation").value) || 0;
  const entertainment = parseFloat(document.getElementById("entertainment").value) || 0;
  const other = parseFloat(document.getElementById("other").value) || 0;
  
  const totalExpenses = housing + utilities + groceries + transportation + entertainment + other;
  const remaining = income - totalExpenses;
  const savingsRate = income > 0 ? (remaining / income * 100).toFixed(1) : 0;
  
  let results = `
    <h4>📊 Budget Analysis</h4>
    <p><span class="highlight">Monthly Income:</span> $${income.toLocaleString()}</p>
    <p><span class="highlight">Total Expenses:</span> $${totalExpenses.toLocaleString()}</p>
    <p><span class="highlight">Remaining Amount:</span> <span class="${remaining >= 0 ? 'positive' : 'negative'}">$${remaining.toLocaleString()}</span></p>
    <p><span class="highlight">Savings Rate:</span> <span class="${remaining >= 0 ? 'positive' : 'negative'}">${savingsRate}%</span></p>
  `;
  
  if (remaining < 0) {
    results += `<p class="negative">⚠️ You're spending more than you earn! Consider reducing expenses.</p>`;
  } else if (remaining > 0) {
    results += `<p class="positive">✅ Great! You have money left over for savings and investments.</p>`;
  }
  
  document.getElementById("budgetResults").innerHTML = results;
});

// Investment Calculator functionality
document.getElementById("calculateInvestment").addEventListener("click", function() {
  const initialAmount = parseFloat(document.getElementById("initialAmount").value) || 0;
  const monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value) || 0;
  const annualReturn = parseFloat(document.getElementById("annualReturn").value) || 0;
  const years = parseFloat(document.getElementById("investmentYears").value) || 0;
  
  const monthlyReturn = annualReturn / 100 / 12;
  const totalMonths = years * 12;
  
  // Calculate compound interest with monthly contributions
  let futureValue = initialAmount;
  let totalContributions = initialAmount;
  
  for (let month = 0; month < totalMonths; month++) {
    futureValue = futureValue * (1 + monthlyReturn) + monthlyContribution;
    totalContributions += monthlyContribution;
  }
  
  const totalGains = futureValue - totalContributions;
  
  let results = `
    <h4>📈 Investment Projection</h4>
    <p><span class="highlight">Initial Investment:</span> $${initialAmount.toLocaleString()}</p>
    <p><span class="highlight">Monthly Contribution:</span> $${monthlyContribution.toLocaleString()}</p>
    <p><span class="highlight">Total Contributions:</span> $${totalContributions.toLocaleString()}</p>
    <p><span class="highlight">Projected Value:</span> <span class="positive">$${futureValue.toLocaleString()}</span></p>
    <p><span class="highlight">Total Gains:</span> <span class="positive">$${totalGains.toLocaleString()}</span></p>
    <p><span class="highlight">Return on Investment:</span> <span class="positive">${((totalGains / totalContributions) * 100).toFixed(1)}%</span></p>
  `;
  
  document.getElementById("investmentResults").innerHTML = results;
});

// Financial Goal Planner functionality
document.getElementById("calculateGoal").addEventListener("click", function() {
  const goalName = document.getElementById("goalName").value || "Financial Goal";
  const goalAmount = parseFloat(document.getElementById("goalAmount").value) || 0;
  const currentSavings = parseFloat(document.getElementById("currentSavings").value) || 0;
  const monthlySaving = parseFloat(document.getElementById("monthlySaving").value) || 0;
  const goalYears = parseFloat(document.getElementById("goalYears").value) || 0;
  
  const remainingAmount = goalAmount - currentSavings;
  const monthsToGoal = goalYears * 12;
  const requiredMonthlySaving = remainingAmount / monthsToGoal;
  const currentTimeline = remainingAmount / monthlySaving;
  
  let results = `
    <h4>🎯 Goal Analysis: ${goalName}</h4>
    <p><span class="highlight">Target Amount:</span> $${goalAmount.toLocaleString()}</p>
    <p><span class="highlight">Current Savings:</span> $${currentSavings.toLocaleString()}</p>
    <p><span class="highlight">Remaining Amount:</span> $${remainingAmount.toLocaleString()}</p>
    <p><span class="highlight">Monthly Saving:</span> $${monthlySaving.toLocaleString()}</p>
    <p><span class="highlight">Required Monthly Saving:</span> <span class="${monthlySaving >= requiredMonthlySaving ? 'positive' : 'negative'}">$${requiredMonthlySaving.toFixed(2)}</span></p>
    <p><span class="highlight">Time to Goal:</span> <span class="${currentTimeline <= monthsToGoal ? 'positive' : 'negative'}">${(currentTimeline / 12).toFixed(1)} years</span></p>
  `;
  
  if (monthlySaving >= requiredMonthlySaving) {
    results += `<p class="positive">✅ You're on track to reach your goal!</p>`;
  } else {
    results += `<p class="negative">⚠️ You need to save more per month to reach your goal on time.</p>`;
  }
  
  document.getElementById("goalResults").innerHTML = results;
});

// Debt Calculator functionality
document.getElementById("calculateDebt").addEventListener("click", function() {
  const debtAmount = parseFloat(document.getElementById("debtAmount").value) || 0;
  const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;
  const monthlyPayment = parseFloat(document.getElementById("monthlyPayment").value) || 0;
  
  const monthlyInterestRate = interestRate / 100 / 12;
  let remainingDebt = debtAmount;
  let totalInterest = 0;
  let monthsToPayoff = 0;
  
  // Calculate payoff timeline
  while (remainingDebt > 0 && monthsToPayoff < 600) { // Max 50 years
    const interestPayment = remainingDebt * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    
    if (principalPayment <= 0) {
      monthsToPayoff = 999; // Will never pay off
      break;
    }
    
    remainingDebt -= principalPayment;
    totalInterest += interestPayment;
    monthsToPayoff++;
  }
  
  const yearsToPayoff = monthsToPayoff / 12;
  const totalPaid = debtAmount + totalInterest;
  
  let results = `
    <h4>💳 Debt Payoff Analysis</h4>
    <p><span class="highlight">Debt Amount:</span> $${debtAmount.toLocaleString()}</p>
    <p><span class="highlight">Interest Rate:</span> ${interestRate}%</p>
    <p><span class="highlight">Monthly Payment:</span> $${monthlyPayment.toLocaleString()}</p>
    <p><span class="highlight">Total Interest:</span> <span class="negative">$${totalInterest.toLocaleString()}</span></p>
    <p><span class="highlight">Total Amount Paid:</span> $${totalPaid.toLocaleString()}</p>
    <p><span class="highlight">Time to Payoff:</span> <span class="${monthsToPayoff < 600 ? 'positive' : 'negative'}">${yearsToPayoff.toFixed(1)} years</span></p>
  `;
  
  if (monthsToPayoff >= 600) {
    results += `<p class="negative">⚠️ Your monthly payment is too low to pay off this debt. Consider increasing payments.</p>`;
  } else {
    results += `<p class="positive">✅ You can pay off this debt in ${yearsToPayoff.toFixed(1)} years!</p>`;
  }
  
  document.getElementById("debtResults").innerHTML = results;
});

// Chatbot functionality
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
      if (message.includes("invest") || message.includes("stock") || message.includes("portfolio")) {
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
      
      // General financial literacy
      if (message.includes("learn") || message.includes("education") || message.includes("teach")) {
        return "Financial literacy is so important! 📚 Here's how to improve:<br><br>" +
               "• Watch our video tutorials in Resources<br>" +
               "• Read the featured articles we've curated<br>" +
               "• Take online courses on personal finance<br>" +
               "• Practice with our financial tools<br><br>" +
               "What specific topic would you like to learn more about?";
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

// Course buttons functionality
const courseBtns = document.querySelectorAll(".course-btn");
courseBtns.forEach(btn => {
  btn.addEventListener("click", function() {
    const courseName = this.closest(".course-card").querySelector("h4").textContent;
    alert(`Exploring ${courseName}...`);
  });
});

// Smooth scrolling for dropdown links on the same page
document.querySelectorAll('.dropdown-menu a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const hash = href.substring(href.indexOf('#'));
        
        // Check if the link points to the CURRENT page AND contains a hash fragment
        if (href.startsWith(window.location.pathname.split("/").pop() + '#') || href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
        // If it points to resources.html#section from another page, the browser's default
        // behavior (load new page then scroll to fragment) will handle it.
    });
});
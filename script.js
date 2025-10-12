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

// Simple demo alert for login
const loginForm = document.querySelector(".login-form");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    alert("Welcome back to FinWise!");
  });
}

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
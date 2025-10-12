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

// Tool modal + buttons functionality
(function initTools() {
  const modal = document.getElementById("tool-modal");
  const modalContent = document.getElementById("tool-modal-content");
  const toolBtns = document.querySelectorAll(".tool-btn");

  if (!toolBtns.length || !modal || !modalContent) return;

  const openToolModal = (toolKey, titleText) => {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    modalContent.innerHTML = renderTool(toolKey, titleText);

    // Attach per-tool handlers after render
    if (toolKey === "budget") {
      attachBudgetCalculatorHandlers();
    }
  };

  const closeToolModal = () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    modalContent.innerHTML = "";
  };

  // Close on overlay or close button
  modal.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.getAttribute && target.getAttribute("data-close") === "true") {
      closeToolModal();
    }
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeToolModal();
    }
  });

  // Map title to internal tool key
  const getToolKeyFromTitle = (title) => {
    const t = (title || "").toLowerCase();
    if (t.includes("budget")) return "budget";
    if (t.includes("investment")) return "investment";
    if (t.includes("goal")) return "goals";
    if (t.includes("debt")) return "debt";
    return "unknown";
  };

  toolBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const titleEl = this.closest(".tool-card").querySelector("h4");
      const titleText = titleEl ? titleEl.textContent.trim() : "Tool";
      const toolKey = getToolKeyFromTitle(titleText);
      openToolModal(toolKey, titleText);
    });
  });

  function renderTool(toolKey, titleText) {
    if (toolKey === "budget") return renderBudgetCalculator(titleText);
    // Simple stubs for others
    return `
      <h3>${titleText}</h3>
      <p>This tool is coming soon. Stay tuned!</p>
      <div class="tool-actions">
        <button class="button-secondary" data-close="true">Close</button>
      </div>
    `;
  }

  function renderBudgetCalculator(titleText) {
    return `
      <h3>${titleText}</h3>
      <form id="budget-form" class="tool-form" novalidate>
        <div class="tool-grid">
          <div class="form-group">
            <label for="income">Monthly Income</label>
            <input id="income" name="income" type="number" min="0" step="0.01" placeholder="e.g. 5000" required />
          </div>
          <div class="form-group">
            <label for="housing">Housing</label>
            <input id="housing" name="housing" type="number" min="0" step="0.01" placeholder="e.g. 1200" />
          </div>
          <div class="form-group">
            <label for="utilities">Utilities</label>
            <input id="utilities" name="utilities" type="number" min="0" step="0.01" placeholder="e.g. 200" />
          </div>
          <div class="form-group">
            <label for="food">Food</label>
            <input id="food" name="food" type="number" min="0" step="0.01" placeholder="e.g. 400" />
          </div>
          <div class="form-group">
            <label for="transport">Transport</label>
            <input id="transport" name="transport" type="number" min="0" step="0.01" placeholder="e.g. 150" />
          </div>
          <div class="form-group">
            <label for="insurance">Insurance</label>
            <input id="insurance" name="insurance" type="number" min="0" step="0.01" placeholder="e.g. 300" />
          </div>
          <div class="form-group">
            <label for="entertainment">Entertainment</label>
            <input id="entertainment" name="entertainment" type="number" min="0" step="0.01" placeholder="e.g. 120" />
          </div>
          <div class="form-group">
            <label for="other">Other</label>
            <input id="other" name="other" type="number" min="0" step="0.01" placeholder="e.g. 100" />
          </div>
          <div class="form-group">
            <label for="savings">Planned Savings</label>
            <input id="savings" name="savings" type="number" min="0" step="0.01" placeholder="e.g. 500" />
          </div>
        </div>
        <div class="tool-actions">
          <button type="button" class="button-secondary" id="budget-reset">Reset</button>
          <button type="submit" class="tool-btn">Calculate</button>
        </div>
      </form>
      <div id="budget-summary" class="summary-grid" aria-live="polite"></div>
    `;
  }

  function attachBudgetCalculatorHandlers() {
    const form = document.getElementById("budget-form");
    const summary = document.getElementById("budget-summary");
    const resetBtn = document.getElementById("budget-reset");
    if (!form || !summary || !resetBtn) return;

    const parseNumber = (value) => {
      const n = parseFloat(String(value).replace(/,/g, ""));
      return Number.isFinite(n) ? n : 0;
    };

    resetBtn.addEventListener("click", () => {
      form.reset();
      summary.innerHTML = "";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const income = parseNumber(form.income.value);
      const housing = parseNumber(form.housing.value);
      const utilities = parseNumber(form.utilities.value);
      const food = parseNumber(form.food.value);
      const transport = parseNumber(form.transport.value);
      const insurance = parseNumber(form.insurance.value);
      const entertainment = parseNumber(form.entertainment.value);
      const other = parseNumber(form.other.value);
      const plannedSavings = parseNumber(form.savings.value);

      const totalExpenses = housing + utilities + food + transport + insurance + entertainment + other;
      const leftoverAfterExpenses = income - totalExpenses;
      const leftoverAfterAll = income - (totalExpenses + plannedSavings);
      const savingsRate = income > 0 ? (plannedSavings / income) * 100 : 0;

      const rateBadgeClass = savingsRate >= 20 ? "good" : savingsRate >= 5 ? "warn" : "danger";
      const rateBadgeText = savingsRate >= 20 ? "Healthy" : savingsRate >= 5 ? "Okay" : "Low";

      summary.innerHTML = `
        <div class="summary-card">
          <span class="label">Total Expenses</span>
          <span class="value">$${totalExpenses.toFixed(2)}</span>
        </div>
        <div class="summary-card">
          <span class="label">Planned Savings</span>
          <span class="value">$${plannedSavings.toFixed(2)}</span>
        </div>
        <div class="summary-card">
          <span class="label">Leftover After All</span>
          <span class="value">$${leftoverAfterAll.toFixed(2)}</span>
        </div>
        <div class="summary-card">
          <span class="label">Savings Rate</span>
          <span class="value">${savingsRate.toFixed(1)}%</span>
          <span class="badge ${rateBadgeClass}">${rateBadgeText}</span>
        </div>
      `;
    });
  }
})();

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
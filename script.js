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
    alert(`Launching ${toolName}...`);
  });
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
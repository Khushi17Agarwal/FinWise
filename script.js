// Highlight active navbar link
const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {
  link.addEventListener("click", function() {
    navLinks.forEach(l => l.classList.remove("active-link"));
    this.classList.add("active-link");
  });
});

// Update active link based on current page
document.addEventListener("DOMContentLoaded", function() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active-link");
    } else {
      link.classList.remove("active-link");
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

// Smooth scrolling for dropdown links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});
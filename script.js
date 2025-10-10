// Highlight active navbar link
const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// Simple demo alert for login
document.querySelector(".login-form").addEventListener("submit", e => {
  e.preventDefault();
  alert("Welcome back to FinWise!");
});

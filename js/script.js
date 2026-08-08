
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const progress = document.getElementById("scrollProgress");
// const form = document.getElementById("contactForm");
// const formStatus = document.getElementById("formStatus");

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
} else {
  root.setAttribute(
    "data-theme",
    window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
  );
}

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("portfolio-theme", next);
});

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  menuToggle.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.textContent = "☰";
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const navItems = [...document.querySelectorAll(".nav-links a")];

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${height > 0 ? (scrollTop / height) * 100 : 0}%`;

  let current = "home";
  sections.forEach(section => {
    if (scrollTop >= section.offsetTop - 180) current = section.id;
  });

  navItems.forEach(item => {
    item.classList.toggle("active", item.getAttribute("href") === `#${current}`);
  });
}
window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

const observer = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();

// form.addEventListener("submit", e => {
//   e.preventDefault();
//   const data = new FormData(form);
//   const name = data.get("name");
//   formStatus.textContent = `Thanks ${name}! This demo form is ready to connect to Formspree, EmailJS, or your backend.`;
//   form.reset();
// });


const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxnXljxFCHmQrILjPatAaK6SWXimT6wSGJutlUFzTC-hqKNk0goaudJYIPbboZjnr40/exec";

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const submitButton =
        form.querySelector("button[type='submit']");

    const originalText =
        submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = "Sending...";

    formStatus.textContent = "";

    const formData = new FormData(form);

    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message")
    };

    try {

        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(data)
        });

        formStatus.textContent =
            "Message sent successfully!";

        formStatus.style.color = "#63d49a";

        form.reset();

    } catch (error) {

        console.error("Error:", error);

        formStatus.textContent =
            "Something went wrong. Please try again.";

        formStatus.style.color = "#ff6b6b";

    } finally {

        submitButton.disabled = false;
        submitButton.innerHTML = originalText;

    }

});
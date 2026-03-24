// ===============================
// SMOOTH SCROLL TO ABOUT
// ===============================

const aboutBtn = document.getElementById("aboutBtn");

if (aboutBtn) {
    aboutBtn.addEventListener("click", () => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: "smooth" });
        }
    });
}

// ===============================
// FADE-IN ANIMATION (Intersection Observer)
// ===============================

const fadeElements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, { threshold: 0.2 });

fadeElements.forEach(el => observer.observe(el));

// ===============================
// HAMBURGER MENU
// ===============================

const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        navbar.classList.toggle("active");
    });
}

// ===============================
// DARK / LIGHT MODE TOGGLE
// ===============================

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem("theme", "dark");
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// ===============================
// CONTACT FORM WITH SUCCESS UI
// ===============================

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = this.querySelector("input[name='name']").value.trim();
        const email = this.querySelector("input[name='email']").value.trim();
        const message = this.querySelector("textarea[name='message']").value.trim();
        const button = this.querySelector("button");

        if (!name || !email || !message) {
            formMessage.textContent = "Please fill all fields.";
            formMessage.className = "error";
            return;
        }

        button.textContent = "Sending...";
        button.disabled = true;

        try {
            const response = await fetch("/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, message })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Error sending message");
            }

            formMessage.textContent = "Message sent successfully!";
            formMessage.className = "success";
            contactForm.reset();

        } catch (error) {
            formMessage.textContent = "Unable to send message. Try again later.";
            formMessage.className = "error";
        }

        button.textContent = "Send Message";
        button.disabled = false;
    });
}
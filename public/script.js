// Smooth scroll to About section
const aboutBtn = document.getElementById("aboutBtn");

if (aboutBtn) {
    aboutBtn.addEventListener("click", () => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: "smooth" });
        }
    });
}


// Contact Form Submission
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = this.querySelector("input[name='name']").value.trim();
        const email = this.querySelector("input[name='email']").value.trim();
        const message = this.querySelector("textarea[name='message']").value.trim();

        if (!name || !email || !message) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const response = await fetch("/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, message })
            });

            if (!response.ok) {
                throw new Error("Server response was not ok");
            }

            const result = await response.json();

            alert(result.message || "Message sent successfully!");
            this.reset();

        } catch (error) {
            console.error("Error:", error);
            alert("Unable to send message. Please try again later.");
        }
    });
}
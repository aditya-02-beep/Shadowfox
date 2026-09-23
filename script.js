// ===================================
// Mobile Menu Toggle
// ===================================
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  });
});

// ===================================
// Highlight active nav link on scroll
// ===================================
const sections = document.querySelectorAll(".section");
const navItems = document.querySelectorAll(".nav-link");

function updateActiveNav() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("href") === `#${current}`) {
      item.classList.add("active");
    }
  });
}

// ===================================
// Scroll progress ruler + scroll-to-top visibility
// ===================================
const scrollTopBtn = document.getElementById("scrollTopBtn");
const scrollFill = document.getElementById("scrollFill");

function updateScrollUI() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  scrollFill.style.width = `${progress}%`;

  scrollTopBtn.style.display = window.scrollY > 400 ? "flex" : "none";
}

window.addEventListener("scroll", () => {
  updateActiveNav();
  updateScrollUI();
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Run once on load in case the page opens mid-scroll (e.g. anchor link)
updateActiveNav();
updateScrollUI();

// ===================================
// Theme toggle (Day / Night)
// ===================================
const themeButtons = document.querySelectorAll("[data-theme-btn]");

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.themeBtn;
    document.documentElement.setAttribute("data-theme", theme);

    themeButtons.forEach((b) => {
      const isActive = b === btn;
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  });
});

// ===================================
// Project filtering
// ===================================
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const filterEmpty = document.getElementById("filterEmpty");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const tags = card.dataset.tags || "";
      const matches = filter === "all" || tags.includes(filter);
      card.classList.toggle("is-hidden", !matches);
      if (matches) visibleCount += 1;
    });

    filterEmpty.hidden = visibleCount !== 0;
  });
});

// ===================================
// Copy email to clipboard
// ===================================
const copyEmailBtn = document.getElementById("copyEmailBtn");

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    const email = "aditya.kumar@example.com";
    const originalLabel = copyEmailBtn.textContent;

    try {
      await navigator.clipboard.writeText(email);
      copyEmailBtn.textContent = "Copied";
      copyEmailBtn.classList.add("copied");
    } catch (err) {
      copyEmailBtn.textContent = "Copy failed";
    }

    setTimeout(() => {
      copyEmailBtn.textContent = originalLabel;
      copyEmailBtn.classList.remove("copied");
    }, 2000);
  });
}

// ===================================
// Contact form validation (per field + on submit)
// ===================================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const companyInput = document.getElementById("company"); // honeypot

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldError(input, errorEl, message) {
  input.classList.add("invalid");
  errorEl.textContent = message;
}

function clearFieldError(input, errorEl) {
  input.classList.remove("invalid");
  errorEl.textContent = "";
}

function validateName() {
  const value = nameInput.value.trim();
  if (value === "") {
    setFieldError(nameInput, nameError, "Please enter your name.");
    return false;
  }
  clearFieldError(nameInput, nameError);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  if (value === "") {
    setFieldError(emailInput, emailError, "Please enter your email address.");
    return false;
  }
  if (!emailRegex.test(value)) {
    setFieldError(emailInput, emailError, "Please enter a valid email address.");
    return false;
  }
  clearFieldError(emailInput, emailError);
  return true;
}

function validateMessage() {
  const value = messageInput.value.trim();
  if (value === "") {
    setFieldError(messageInput, messageError, "Please write a message.");
    return false;
  }
  if (value.length < 10) {
    setFieldError(messageInput, messageError, "Your message should be at least 10 characters long.");
    return false;
  }
  clearFieldError(messageInput, messageError);
  return true;
}

nameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
messageInput.addEventListener("blur", validateMessage);

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Honeypot: if this hidden field is filled, silently drop the submission
  if (companyInput && companyInput.value.trim() !== "") {
    formStatus.style.color = "";
    formStatus.textContent = "";
    contactForm.reset();
    return;
  }

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isMessageValid = validateMessage();

  if (!isNameValid || !isEmailValid || !isMessageValid) {
    formStatus.style.color = "var(--accent)";
    formStatus.textContent = "Please fix the highlighted fields before sending.";
    const firstInvalid = contactForm.querySelector(".invalid");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // Since this is a static front-end demo, we just show a success message.
  // To actually send emails, connect this form to a service like Formspree or EmailJS.
  const name = nameInput.value.trim();
  formStatus.style.color = "var(--accent-green)";
  formStatus.textContent = `Thanks, ${name}! Your message has been noted.`;

  contactForm.reset();
});

// ===================================
// Auto-update footer year
// ===================================
document.getElementById("year").textContent = new Date().getFullYear();
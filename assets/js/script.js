// Ajoute une classe seulement lorsque JavaScript est disponible.
document.documentElement.classList.add("js");

// =========================================================
// Navigation mobile
// =========================================================
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

function closeMenu() {
  if (!menuToggle || !menu) return;
  menuToggle.classList.remove("active");
  menu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

// =========================================================
// Apparence de l'en-tête au défilement
// =========================================================
const header = document.querySelector("[data-header]");
function updateHeader() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 20);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// =========================================================
// Année automatique dans le pied de page
// =========================================================
document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

// =========================================================
// Apparition progressive des éléments
// =========================================================
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// =========================================================
// Filtres de la page projets
// Les valeurs data-category et data-year des cartes doivent
// correspondre aux valeurs des listes déroulantes HTML.
// =========================================================
const filterForm = document.querySelector("[data-project-filters]");
if (filterForm) {
  const searchInput = filterForm.querySelector("[data-filter-search]");
  const categorySelect = filterForm.querySelector("[data-filter-category]");
  const yearSelect = filterForm.querySelector("[data-filter-year]");
  const projectCards = [...document.querySelectorAll("[data-project-card]")];
  const resultCount = document.querySelector("[data-results-count]");
  const emptyState = document.querySelector("[data-empty-state]");

  const normalize = (value) => value.toLocaleLowerCase("fr").normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  function filterProjects() {
    const query = normalize(searchInput.value.trim());
    const category = categorySelect.value;
    const year = yearSelect.value;
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const searchableText = normalize(card.dataset.search || card.textContent);
      const matchesSearch = !query || searchableText.includes(query);
      const matchesCategory = category === "all" || card.dataset.category === category;
      const matchesYear = year === "all" || card.dataset.year === year;
      const visible = matchesSearch && matchesCategory && matchesYear;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    resultCount.textContent = String(visibleCount);
    emptyState.hidden = visibleCount !== 0;
  }

  filterForm.addEventListener("input", filterProjects);
  filterForm.addEventListener("change", filterProjects);
  filterForm.addEventListener("reset", () => window.setTimeout(filterProjects, 0));
  filterProjects();
}

// =========================================================
// Galerie / lightbox de la fiche projet
// =========================================================
const lightbox = document.querySelector("[data-lightbox]");
if (lightbox) {
  const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
  const closeButton = lightbox.querySelector("[data-lightbox-close]");
  let lastFocusedElement = null;

  function openLightbox(source, altText) {
    lastFocusedElement = document.activeElement;
    lightboxImage.src = source;
    lightboxImage.alt = altText || "Agrandissement de l'image";
    lightbox.hidden = false;
    document.body.classList.add("menu-open");
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImage.src = "";
    document.body.classList.remove("menu-open");
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      openLightbox(button.dataset.lightboxSrc, image?.alt);
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

// =========================================================
// Formulaire de contact de démonstration
// Pour un vrai envoi, remplacez ce code par Formspree,
// Netlify Forms ou une requête vers votre propre serveur.
// =========================================================
const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) {
  const formStatus = contactForm.querySelector("[data-form-status]");
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }
    formStatus.textContent = "Formulaire valide. Configurez maintenant un service d'envoi pour recevoir les messages.";
    contactForm.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });
  }

  // Destination filtering and search
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("destinationSearch");
  const destinationCards = document.querySelectorAll(".filter-item");

  if (filterButtons.length && destinationCards.length) {
    const applyFilters = () => {
      const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
      const searchValue = (searchInput?.value || "").trim().toLowerCase();

      destinationCards.forEach((card) => {
        const category = (card.dataset.category || "").toLowerCase();
        const text = card.textContent.toLowerCase();
        const matchesFilter =
          activeFilter === "all" ||
          category.includes(activeFilter) ||
          (activeFilter === "country" && text.includes("japan") || text.includes("greece") || text.includes("switzerland") || text.includes("indonesia") || text.includes("france") || text.includes("turkiye") || text.includes("iceland") || text.includes("italy"));

        const matchesSearch =
          !searchValue ||
          text.includes(searchValue);

        card.classList.toggle("hidden", !(matchesFilter && matchesSearch));
      });
    };

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
  }

  // Gallery lightbox
  const galleryItems = document.querySelectorAll(".gallery-item img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeLightbox = document.getElementById("closeLightbox");

  galleryItems.forEach((img) => {
    img.addEventListener("click", () => {
      if (lightbox && lightboxImage) {
        lightboxImage.src = img.src;
        lightbox.classList.add("active");
      }
    });
  });

  if (closeLightbox && lightbox) {
    closeLightbox.addEventListener("click", () => {
      lightbox.classList.remove("active");
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("active");
      }
    });
  }

  // Feedback form validation
  const feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    const nameInput = document.getElementById("name");
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const emailInput = document.getElementById("email");
    const feedbackTypeInput = document.getElementById("feedbackType");
    const messageInput = document.getElementById("message");
    const datetimeInput = document.getElementById("datetime");
    const formMessage = document.getElementById("formMessage");

    const now = new Date();
    const formattedDateNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    if (datetimeInput) {
      datetimeInput.setAttribute("max", formattedDateNow);
    }

    const showError = (fieldId, message) => {
      const errorNode = document.getElementById(fieldId + "Error");
      if (errorNode) errorNode.textContent = message;
    };

    const clearErrors = () => {
      ["name", "email", "feedbackType", "message", "datetime"].forEach((id) => showError(id, ""));
      const genderError = document.getElementById("genderError");
      if (genderError) genderError.textContent = "";
    };

    feedbackForm.addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors();

      let isValid = true;

      if (!nameInput.value.trim()) {
        showError("name", "Please enter your name.");
        isValid = false;
      }

      const selectedGender = [...genderInputs].find((input) => input.checked);
      if (!selectedGender) {
        const genderError = document.getElementById("genderError");
        if (genderError) genderError.textContent = "Please select your gender.";
        isValid = false;
      }

      const emailValue = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailValue || !emailPattern.test(emailValue)) {
        showError("email", "Please enter a valid email address.");
        isValid = false;
      }

      if (!feedbackTypeInput.value) {
        showError("feedbackType", "Please select the type of feedback.");
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        showError("message", "Please write your feedback message.");
        isValid = false;
      }

      if (!datetimeInput.value) {
        showError("datetime", "Please select the date and time.");
        isValid = false;
      } else {
        const selectedDate = new Date(datetimeInput.value);
        const nowDate = new Date();
        if (selectedDate > nowDate) {
          showError("datetime", "Date and time cannot be in the future.");
          isValid = false;
        }
      }

      if (!isValid) {
        if (formMessage) {
          formMessage.textContent = "Please correct the highlighted fields.";
          formMessage.className = "form-message error";
        }
        return;
      }

      feedbackForm.submit();
    });
  }
});
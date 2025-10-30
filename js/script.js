console.log("NASA Space Explorer: JSON mode active");

// Random space fact
const spaceFacts = [
  "Venus rotates clockwise, unlike most planets.",
  "Jupiter’s Great Red Spot is a giant storm that’s lasted over 300 years.",
  "One day on Venus is longer than one year on Venus.",
  "The Sun accounts for 99.8% of our solar system’s total mass.",
  "A teaspoon of neutron star material would weigh about a billion tons.",
  "There may be more stars in the universe than grains of sand on Earth."
];

// Show random fact above gallery
function showRandomFact() {
  const fact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  let factElem = document.getElementById("spaceFact");
  if (!factElem) {
    factElem = document.createElement("div");
    factElem.id = "spaceFact";
    factElem.style.fontSize = "16px";
    factElem.style.marginBottom = "15px";
    factElem.style.textAlign = "center";
    factElem.style.color = "#fff";
    document
      .querySelector(".container")
      .insertBefore(factElem, document.getElementById("gallery"));
  }
  factElem.textContent = `💫 Did You Know? ${fact}`;
}
showRandomFact();

// DOM elements
const getImageBtn = document.getElementById("getImageBtn");
const gallery = document.getElementById("gallery");

// Modal elements
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalExplanation = document.getElementById("modalExplanation");

// JSON data
const apodJSON = "https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json";

// Fetch and display gallery
getImageBtn.addEventListener("click", fetchSpaceImages);

async function fetchSpaceImages() {
  console.log("Fetching APOD-style images...");
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos...</p>
    </div>
  `;

  try {
    const response = await fetch(apodJSON);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    console.log("Data loaded:", data);

    // Filter valid entries
    const entries = data.filter(
      (item) => item.media_type === "image" || item.media_type === "video"
    );

    if (entries.length === 0) {
      gallery.innerHTML = `
        <div class="placeholder">
          <div class="placeholder-icon">🛰️</div>
          <p>No space images found.</p>
        </div>
      `;
      return;
    }

    // Sort by date (latest first)
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Build gallery
    gallery.innerHTML = entries
      .map((item) => {
        const imgSrc =
          item.media_type === "video"
            ? item.thumbnail_url ||
              "https://via.placeholder.com/400x300?text=Video+Preview"
            : item.url;
        return `
          <div class="gallery-item" 
               data-title="${item.title}" 
               data-date="${item.date}" 
               data-explanation="${item.explanation}" 
               data-url="${item.url}" 
               data-hdurl="${item.hdurl || ""}" 
               data-mediatype="${item.media_type}">
            <img src="${imgSrc}" alt="${item.title}">
            <p><strong>${item.title}</strong></p>
            <p>${item.date}</p>
          </div>
        `;
      })
      .join("");

    enableModal();
  } catch (error) {
    console.error("Error:", error);
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🚫</div>
        <p>Failed to load space images. Please try again.</p>
      </div>
    `;
  }
}

// Enable modal
function enableModal() {
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const title = item.dataset.title;
      const date = item.dataset.date;
      const explanation = item.dataset.explanation;
      const url = item.dataset.url;
      const hdurl = item.dataset.hdurl;
      const mediaType = item.dataset.mediatype;

      modalTitle.textContent = title;
      modalDate.textContent = date;
      modalExplanation.textContent = explanation;

      // Clear previous content
      modalImage.style.display = "none";
      const existingVideo = modal.querySelector("iframe");
      if (existingVideo) existingVideo.remove();

      // Image or video logic
      if (mediaType === "video") {
        const iframe = document.createElement("iframe");
        iframe.src = url.includes("youtube.com")
          ? url
          : `https://www.youtube.com/embed/${url}`;
        iframe.width = "100%";
        iframe.height = "400";
        iframe.frameBorder = "0";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        modal.querySelector(".modal-content").insertBefore(iframe, modalTitle);
      } else {
        modalImage.src = hdurl || url;
        modalImage.alt = title;
        modalImage.style.display = "block";
      }

      modal.classList.remove("hidden");
    });
  });
}

// Close modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  const existingVideo = modal.querySelector("iframe");
  if (existingVideo) existingVideo.remove();
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    const existingVideo = modal.querySelector("iframe");
    if (existingVideo) existingVideo.remove();
  }
});


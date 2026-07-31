const form = document.getElementById('add-guidance-form');
const titleInput = document.getElementById('guidance-title');
const descInput = document.getElementById('guidance-desc');
const imageInput = document.getElementById('guidance-image');
const cardsContainer = document.getElementById('cards-container');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const closeModal = document.getElementById('close-modal');

let editIndex = null;

// Load from localStorage or default
const defaultGuidances = [
  {
    title: "Modern Drip & Sprinkler Irrigation",
    desc: "Drip irrigation systems deliver water directly to the plant's root zone, reducing water waste by up to 50%. Ideal for row crops, vineyards, and orchards. It minimizes weed growth by keeping the surrounding soil dry and allows for efficient nutrient application directly through the water system (fertigation). Install standard 16mm laterals and maintain a routine flushing schedule to prevent clogging.",
    image: "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Organic Pest Control Practices",
    desc: "Shift towards natural pest management using Neem oil sprays, which act as a powerful insect repellent without harming beneficial pollinators. Companion planting is another effective method: plant Marigolds near tomatoes to deter nematodes, and plant Garlic/Onions near carrots to repel the carrot fly. Ladybugs and lacewings can be introduced to naturally control aphid populations in your field.",
    image: "/uploads/pest_control.png"
  },
  {
    title: "Soil Health & NPK Management",
    desc: "Healthy soil is the foundation of high crop yields. Regular soil testing helps you understand the exact Nitrogen (N), Phosphorus (P), and Potassium (K) levels in your field, preventing over-fertilization. Incorporate organic matter like compost, green manure, or crop residues to improve soil structure and water retention. Maintain an optimal pH between 6.0 and 7.0 for most vegetables.",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Government Subsidies (PM-Kisan)",
    desc: "Under the PM-Kisan Samman Nidhi scheme, eligible farmers receive ₹6,000 per year in three equal installments directly into their bank accounts. Ensure your Aadhaar is linked to your bank account and land records are verified at the local CSC (Common Service Centre). Additionally, look into the Pradhan Mantri Fasal Bima Yojana (PMFBY) to insure your crops against unpredictable weather and natural calamities.",
    image: "/uploads/pm_kisan.png"
  },
  {
    title: "Crop Rotation Strategies",
    desc: "Crop rotation prevents soil depletion and breaks the lifecycle of pests. A standard strategy is alternating heavy feeders (like Corn or Tomatoes) with nitrogen fixers (like Beans or Peas/Legumes) and light feeders (like Carrots or Radishes). This natural strategy restores soil fertility without expensive synthetic fertilizers and significantly reduces the buildup of soil-borne diseases.",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "Climate & Harvesting Timing",
    desc: "Timing your harvest correctly is critical for preserving crop value. Utilize local agromet advisory services (AAS) and apps like Meghdoot to track accurate localized weather forecasts. Harvest grains during dry periods to ensure low moisture content, preventing fungal growth during storage. For fruits and vegetables, avoid harvesting during the peak heat of the day to maintain firmness and shelf life.",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=800&auto=format&fit=crop"
  }
];

let guidances = JSON.parse(localStorage.getItem('guidances'));
if (!guidances || guidances.length === 0) {
  guidances = defaultGuidances;
  localStorage.setItem('guidances', JSON.stringify(guidances));
} else {
  // Fix broken images for users who already have them cached in localStorage
  let updated = false;
  const brokenLinks = [
    "https://images.unsplash.com/photo-1628189626359-c29ebfeff35d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592659762303-90081d37b9f4?q=80&w=800&auto=format&fit=crop"
  ];
  const newLinks = ["/uploads/pest_control.png", "/uploads/pm_kisan.png"];

  guidances.forEach(g => {
    const idx = brokenLinks.indexOf(g.image);
    if (idx !== -1) {
      g.image = newLinks[idx];
      updated = true;
    }
  });
  if (updated) localStorage.setItem('guidances', JSON.stringify(guidances));
}

// Save to localStorage
function saveToLocalStorage() {
  localStorage.setItem('guidances', JSON.stringify(guidances));
}

// Render all cards
function renderCards() {
  cardsContainer.innerHTML = '';
  guidances.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${item.image}" alt="Guidance Image" />
      <div class="card-content">
        <h3>${item.title}</h3>
        <p>${item.desc.substring(0, 100)}...</p>
        <div class="actions">
          <button class="view-btn" data-index="${index}">Read Article</button>
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </div>
      </div>
    `;
    cardsContainer.appendChild(card);
  });
}

// Handle form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const image = imageInput.value.trim() || "https://source.unsplash.com/400x300/?farm,agriculture,green";

  if (!title || !desc) {
    alert("Please fill in both title and description.");
    return;
  }

  if (editIndex !== null) {
    // Edit mode
    guidances[editIndex] = { title, desc, image };
    editIndex = null;
  } else {
    // Add mode
    guidances.push({ title, desc, image });
  }

  saveToLocalStorage();
  renderCards();
  form.reset();
});

// Handle view/edit/delete
cardsContainer.addEventListener('click', (e) => {
  const index = e.target.dataset.index;
  if (e.target.classList.contains('view-btn')) {
    modalTitle.textContent = guidances[index].title;
    modalDesc.textContent = guidances[index].desc;
    modal.style.display = 'block';
  } else if (e.target.classList.contains('edit-btn')) {
    const guide = guidances[index];
    titleInput.value = guide.title;
    descInput.value = guide.desc;
    imageInput.value = guide.image;
    editIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (e.target.classList.contains('delete-btn')) {
    if (confirm("Are you sure you want to delete this guidance?")) {
      guidances.splice(index, 1);
      saveToLocalStorage();
      renderCards();
    }
  }
});

// Close modal
closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// Initial load
renderCards();
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
let guidances = JSON.parse(localStorage.getItem('guidances')) || [];

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
          <button class="view-btn" data-index="${index}">View</button>
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
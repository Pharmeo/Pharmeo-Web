// Affiche les options de gestion
document.getElementById("toggleGestionPersonnel").addEventListener("click", function () {
    this.style.display = "none";
    document.querySelectorAll(".gestion-options").forEach(option => option.style.display = "inline-block");
});

// Initialise l'affichage basé sur le profil et le username
document.addEventListener("DOMContentLoaded", function () {
    const gestionButton = document.getElementById("toggleGestionPersonnel");
    if (gestionButton) gestionButton.style.display = localStorage.getItem("fk_profil") === "1" ? "block" : "none";

    const usernameButton = document.querySelector('button[data-bs-target="#exampleModal"]');
    const modalUsername = document.getElementById("modalUsername");
    const username = localStorage.getItem("username");
    if (usernameButton && modalUsername && username) {
        usernameButton.textContent = username;
        modalUsername.textContent = username;
    }
});

// Change la vue principale
document.getElementById("parametreBtn")?.addEventListener("click", function () {
    document.getElementById("mainView")?.classList.add("d-none");
    document.getElementById("settingsView")?.classList.remove("d-none");
});

document.getElementById("backBtn")?.addEventListener("click", function () {
    document.getElementById("settingsView")?.classList.add("d-none");
    document.getElementById("mainView")?.classList.remove("d-none");
});

// Active/désactive le bouton d'enregistrement
const inputs = document.querySelectorAll('#identifiant, #password, #confirmPassword, #prenom, #nom, #mobile, #postalCode, #ville');
document.getElementById('registerButton').disabled = true;
inputs.forEach(input => input.addEventListener('input', function () {
    document.getElementById('registerButton').disabled = ![...inputs].every(input => input.value.trim());
}));

// Gère la modale des médicaments
function handleCardClick(medicament) {
    document.getElementById('medicamentName').textContent = medicament.nom;
    document.getElementById('zoneAction').textContent = medicament.zone_action;
    document.getElementById('effetsSecondaires').textContent = medicament.effets_secondaires;
    document.getElementById('composition').textContent = medicament.composition;
    document.getElementById('description').textContent = medicament.description;
    new bootstrap.Modal(document.getElementById('medicamentModal')).show();
}

function attachCardClickEvent(card, medicament) {
    card.addEventListener('click', () => handleCardClick(medicament));
}

// Gère la pagination des médicaments
let currentPage = 1;
const totalItems = 100, itemsPerPage = 25, totalPages = Math.ceil(totalItems / itemsPerPage);

async function loadMedicaments(page = 1) {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token manquant');
        const response = await fetch(`http://localhost:3000/medicaments/${page}`, {
            method: 'GET', headers: { 'Authorization': `${token}` }
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des médicaments');

        const data = await response.json();
        const cardContainer = document.getElementById('medicamentCards');
        cardContainer.innerHTML = '';
        data.medicaments.forEach(medicament => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-3');
            card.innerHTML = `
                <div class="card card-custom">
                    <img src="../Pictures/pictures-medicaments.webp" class="card-img-top" alt="image médicament">
                    <div class="card-body">
                        <h5 class="card-title">${medicament.nom}</h5>
                    </div>
                </div>`;
            attachCardClickEvent(card, medicament);
            cardContainer.appendChild(card);
        });
        currentPage = page;
        renderPagination();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadMedicaments(${currentPage - 1})">&laquo;</a>
        </li>
        ${Array.from({ length: totalPages }, (_, i) => `
            <li class="page-item ${i + 1 === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="loadMedicaments(${i + 1})">${i + 1}</a>
            </li>`).join('')}
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadMedicaments(${currentPage + 1})">&raquo;</a>
        </li>`;
}

// Gère l'état du bouton Réinitialiser
function updateResetButtonState() {
    const selectedFilters = Array.from(document.querySelectorAll('input[name="filters"]:checked'));
    const searchInput = document.getElementById('searchInput')?.value.trim();
    const resetButton = document.getElementById('reset-btn');

    resetButton.disabled = selectedFilters.length === 0 && !searchInput;


    // Désactiver si aucun filtre n'est sélectionné et si le champ de recherche est vide
    if (selectedFilters.length === 0 && !searchInput) {
        resetButton.disabled = true;
    } else {
        resetButton.disabled = false;
    }
}

// Gère la recherche de médicaments
document.getElementById('validate-btn').addEventListener('click', async () => {
    const selectedFilters = Array.from(document.querySelectorAll('input[name="filters"]:checked'))
        .map(checkbox => checkbox.value);
    const searchInput = document.getElementById('searchInput')?.value.trim();

    const token = localStorage.getItem('token');
    if (!token) return console.error('Token manquant');

    let url = 'http://localhost:3000/medicaments';

    // Construire la query string en fonction des entrées
    const queryParams = new URLSearchParams();
    if (searchInput) queryParams.append('name', searchInput);
    if (selectedFilters.length) queryParams.append('system', selectedFilters.join(','));

    url += `?${queryParams.toString()}`;

    try {
        const response = await fetch(url, { method: 'GET', headers: { 'Authorization': `${token}` } });
        if (!response.ok) throw new Error('Erreur lors de la recherche');
        const data = await response.json();

        const cardContainer = document.getElementById('medicamentCards');
        cardContainer.innerHTML = '';

        if (data.medicaments?.length) {
            data.medicaments.forEach(medicament => {
                const card = document.createElement('div');
                card.classList.add('col-md-4', 'mb-3');
                card.innerHTML = `
                    <div class="card card-custom">
                        <img src="../Pictures/pictures-medicaments.webp" class="card-img-top" alt="image médicament">
                        <div class="card-body">
                            <h5 class="card-title">${medicament.nom}</h5>
                        </div>
                    </div>`;
                attachCardClickEvent(card, medicament);
                cardContainer.appendChild(card);
            });
        } else {
            cardContainer.innerHTML = `<p class="text-danger">Aucun médicament trouvé pour la recherche</p>`;
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
});

// Gère la recherche par le bouton de recherche
document.getElementById('searchButton').addEventListener('click', async () => {
    document.getElementById('validate-btn').click();
});

// Charge les médicaments à l'initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadMedicaments();
    updateResetButtonState();
});

// Réinitialise les filtres et recharge la page
document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('filters-form').reset();
    document.getElementById('searchInput').value = '';
    location.reload();
});

// Surveiller les changements dans les filtres et le champ de recherche
document.getElementById('filters-form').addEventListener('change', updateResetButtonState);
document.getElementById('searchInput').addEventListener('input', updateResetButtonState);



// Fonction pour récupérer et afficher les données dans les inputs
document.addEventListener('DOMContentLoaded', () => {

    function populateFields() {
        document.getElementById('identifiant').value = localStorage.getItem('mail') || '';
        document.getElementById('password').value = localStorage.getItem('password') || '';
        document.getElementById('prenom').value = localStorage.getItem('username') || '';
        document.getElementById('nom').value = localStorage.getItem('nom') || '';
        document.getElementById('mobile').value = localStorage.getItem('numero_telephone') || '';
        document.getElementById('postalCode').value = localStorage.getItem('code_postal') || '';
        document.getElementById('ville').value = localStorage.getItem('ville') || '';
        // Gérer le fk_profil pour sélectionner le rôle
        const fkProfil = localStorage.getItem('fk_profil');
        const roleSelect = document.getElementById('role');
        if (fkProfil === '1') {
            roleSelect.value = 'admin';
        } else if (fkProfil === '3') {
            roleSelect.value = 'pharmacien';
        }
    }

    // Appeler la fonction pour initialiser les champs avec les données de localStorage
    populateFields();
});

document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');

    togglePassword.addEventListener('click', () => {
        // Basculer le type d'input entre "password" et "text"
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;

        // Changer l'icône en fonction de l'état
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });
});










//--------------------------------------------------test zones--------------------------------------------------------------------------------\\













































































































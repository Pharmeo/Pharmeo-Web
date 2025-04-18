import { SERVER } from "./const.js"; // Importe l'URL du serveur depuis le fichier const.js

// Attend que le DOM soit complètement chargé
document.addEventListener("DOMContentLoaded", function () {
    // Récupération des éléments HTML par leur ID
    const toggleGestion = document.getElementById("toggleGestionPersonnel");
    const pharmacienButton = document.getElementById("pharmacien-button");
    const suppressionButton = document.getElementById("suppression-button");
    const medicamentButton = document.getElementById("medicament-button");
    const gestionOptions = document.querySelectorAll(".gestion-options");

    let modeSuppression = false; // Booléen pour savoir si on est en mode suppression
    const fk_profil = localStorage.getItem("fk_profil"); // Récupère le profil utilisateur

    // Lorsqu'on clique sur le bouton de gestion
    toggleGestion.addEventListener("click", function () {
        this.style.display = "none"; // Masque le bouton après clic

        if (fk_profil === "3") {
            // Si profil 3 (ex : pharmacien), ajoute dynamiquement les boutons de gestion des médicaments

            // Bouton pour supprimer un médicament
            const medicamentSuppButton = document.createElement("a");
            medicamentSuppButton.id = "medicament-supp-button";
            medicamentSuppButton.className = "gestion-options btn btn-danger";
            medicamentSuppButton.href = "../SuppressionMedicament/suppression-medicament.html";
            medicamentSuppButton.textContent = "Supprimer un médicament";
            medicamentButton.insertAdjacentElement("afterend", medicamentSuppButton);

            // Bouton pour ajouter un médicament
            const medicamentAjoutButton = document.createElement("a");
            medicamentAjoutButton.id = "medicament-ajout-button";
            medicamentAjoutButton.className = "gestion-options btn btn-primary";
            medicamentAjoutButton.href = "../AjoutMedicament/AjoutMedicament.html";
            medicamentAjoutButton.textContent = "Ajouter un médicament";
            medicamentButton.insertAdjacentElement("afterend", medicamentAjoutButton);
        } else {
            // Sinon (autres profils), on affiche toutes les options
            gestionOptions.forEach(option => option.style.display = "inline-block");
        }
    });

    // Gère l'affichage en mode création/suppression
    suppressionButton.addEventListener("click", function () {
        modeSuppression = !modeSuppression; // Bascule le mode

        if (modeSuppression) {
            // Mode suppression activé
            suppressionButton.textContent = "Création";
            suppressionButton.classList.remove("btn-danger");
            suppressionButton.classList.add("btn-primary");

            if (fk_profil === "3") {
                // Pour les pharmaciens
                medicamentButton.textContent = "Supprimer un médicament";
                medicamentButton.href = "../SuppressionMedicament/suppression-medicament.html";
                medicamentButton.classList.remove("btn-primary");
                medicamentButton.classList.add("btn-danger");
            } else {
                // Pour les autres profils (admin ?)
                pharmacienButton.textContent = "Supprimer un pharmacien";
                pharmacienButton.href = "../SuppressionPharmacien/suppression-pharmacien.html";
                medicamentButton.textContent = "Supprimer un médicament";
                medicamentButton.href = "../SuppressionMedicament/suppression-medicament.html";

                // Style danger (rouge)
                pharmacienButton.classList.remove("btn-primary");
                pharmacienButton.classList.add("btn-danger");
                medicamentButton.classList.remove("btn-primary");
                medicamentButton.classList.add("btn-danger");
            }
        } else {
            // Mode création activé
            suppressionButton.textContent = "Suppression";
            suppressionButton.classList.remove("btn-primary");
            suppressionButton.classList.add("btn-danger");

            if (fk_profil === "3") {
                medicamentButton.textContent = "Ajouter un médicament";
                medicamentButton.href = "../AjoutMedicament/AjoutMedicament.html";
                medicamentButton.classList.remove("btn-danger");
                medicamentButton.classList.add("btn-primary");
            } else {
                pharmacienButton.textContent = "Ajouter un pharmacien";
                pharmacienButton.href = "../inscription/pageDinscription.html";
                medicamentButton.textContent = "Ajouter un médicament";
                medicamentButton.href = "../AjoutMedicament/AjoutMedicament.html";

                pharmacienButton.classList.remove("btn-danger");
                pharmacienButton.classList.add("btn-primary");
                medicamentButton.classList.remove("btn-danger");
                medicamentButton.classList.add("btn-primary");
            }
        }
    });
});


// Affiche ou non le bouton de gestion selon le profil + affiche le nom utilisateur
document.addEventListener("DOMContentLoaded", function () {
    const gestionButton = document.getElementById("toggleGestionPersonnel");
    if (gestionButton) gestionButton.style.display = localStorage.getItem("fk_profil") === "1" || "3" ? "block" : "none";

    const usernameButton = document.querySelector('button[data-bs-target="#exampleModal"]');
    const modalUsername = document.getElementById("modalUsername");
    const username = localStorage.getItem("username");
    if (usernameButton && modalUsername && username) {
        usernameButton.textContent = username;
        modalUsername.textContent = username;
    }
});

// Change la vue principale vers la vue paramètres
document.getElementById("parametreBtn")?.addEventListener("click", function () {
    document.getElementById("mainView")?.classList.add("d-none");
    document.getElementById("settingsView")?.classList.remove("d-none");
});

// Revient de la vue paramètres à la vue principale
document.getElementById("backBtn")?.addEventListener("click", function () {
    document.getElementById("settingsView")?.classList.add("d-none");
    document.getElementById("mainView")?.classList.remove("d-none");
});

// Active ou désactive le bouton d’enregistrement selon les champs remplis
const inputs = document.querySelectorAll('#identifiant, #password, #confirmPassword, #prenom, #nom, #mobile, #postalCode, #ville');
document.getElementById('registerButton').disabled = true;
inputs.forEach(input => input.addEventListener('input', function () {
    document.getElementById('registerButton').disabled = ![...inputs].every(input => input.value.trim());
}));

// Affiche les détails d’un médicament dans une modale
function handleCardClick(medicament) {
    document.getElementById('medicamentName').textContent = medicament.nom;
    document.getElementById('zoneAction').textContent = medicament.zone_action;
    document.getElementById('effetsSecondaires').textContent = medicament.effets_secondaires;
    document.getElementById('composition').textContent = medicament.composition;
    document.getElementById('description').textContent = medicament.description;
    new bootstrap.Modal(document.getElementById('medicamentModal')).show();
}

// Ajoute un événement de clic à une carte médicament
function attachCardClickEvent(card, medicament) {
    card.addEventListener('click', () => handleCardClick(medicament));
}

// Gestion de la pagination
let currentPage = 1;
const totalItems = 100, itemsPerPage = 25, totalPages = Math.ceil(totalItems / itemsPerPage);

// Charge les médicaments d’une page donnée
async function loadMedicaments(page = 1) {
    console.log(`Chargement des médicaments pour la page ${page}`);
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token manquant');
        const response = await fetch(`${SERVER}/medicaments/${page}`, {
            method: 'GET',
            headers: { 'Authorization': `${token}` }
        });

        if (!response.ok) throw new Error('Erreur lors de la récupération des médicaments');
        const data = await response.json();

        console.log('Données reçues:', data);

        const cardContainer = document.getElementById('medicamentCards');
        cardContainer.innerHTML = '';
        data.medicaments.forEach(medicament => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-3');
            card.innerHTML = `
                <div class="card card-custom">
                    <img src="../Pictures/medicament.webp" class="card-img-top" alt="image médicament">
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

// Affiche les boutons de pagination
function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const prevBtn = document.createElement('li');
    prevBtn.classList.add('page-item');
    if (currentPage === 1) prevBtn.classList.add('disabled');
    prevBtn.innerHTML = '<a class="page-link" href="#">&laquo;</a>';
    prevBtn.addEventListener('click', () => loadMedicaments(currentPage - 1));
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item');
        if (i === currentPage) pageItem.classList.add('active');
        const link = document.createElement('a');
        link.classList.add('page-link');
        link.href = '#';
        link.textContent = i;
        link.addEventListener('click', () => loadMedicaments(i));
        pageItem.appendChild(link);
        paginationContainer.appendChild(pageItem);
    }

    const nextBtn = document.createElement('li');
    nextBtn.classList.add('page-item');
    if (currentPage === totalPages) nextBtn.classList.add('disabled');
    nextBtn.innerHTML = '<a class="page-link" href="#">&raquo;</a>';
    nextBtn.addEventListener('click', () => loadMedicaments(currentPage + 1));
    paginationContainer.appendChild(nextBtn);
}

// Active/désactive le bouton Réinitialiser en fonction des filtres
function updateResetButtonState() {
    const selectedFilters = Array.from(document.querySelectorAll('input[name="filters"]:checked'));
    const searchInput = document.getElementById('searchInput')?.value.trim();
    const resetButton = document.getElementById('reset-btn');

    resetButton.disabled = selectedFilters.length === 0 && !searchInput;

    if (selectedFilters.length === 0 && !searchInput) {
        resetButton.disabled = true;
    } else {
        resetButton.disabled = false;
    }
}

// Recherche de médicaments selon les filtres ou le champ de recherche
document.getElementById('validate-btn').addEventListener('click', async () => {
    const selectedFilters = Array.from(document.querySelectorAll('input[name="filters"]:checked'))
        .map(checkbox => checkbox.value);
    const searchInput = document.getElementById('searchInput')?.value.trim();

    const token = localStorage.getItem('token');
    if (!token) return console.error('Token manquant');

    let url = `${SERVER}/medicaments`;

    // Construit les paramètres de recherche
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
                        <img src="../Pictures/medicament.webp" class="card-img-top" alt="image médicament">
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

// Quand on clique sur le bouton de recherche, on lance la recherche
document.getElementById('searchButton').addEventListener('click', async () => {
    document.getElementById('validate-btn').click();
});

// Lors du chargement de la page, on charge les médicaments + état du bouton reset
document.addEventListener('DOMContentLoaded', () => {
    loadMedicaments();
    updateResetButtonState();
});

// Bouton Réinitialiser : réinitialise les filtres et recharge la page
document.getElementById('reset-btn').addEventListener('click', () => {
    document.getElementById('filters-form').reset();
    document.getElementById('searchInput').value = '';
    location.reload();
});

// Met à jour le bouton reset en fonction des filtres
document.getElementById('filters-form').addEventListener('change', updateResetButtonState);

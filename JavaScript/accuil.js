import { SERVER } from "./const.js";

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
        const response = await fetch(`${SERVER}/medicaments/${page}`, {
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

    let url = `${SERVER}/medicaments`;

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
        document.getElementById('adresse').value = localStorage.getItem('adresse') || '';
    }

    populateFields();
});

document.addEventListener("DOMContentLoaded", function () {
    const postalCodeInput = document.getElementById("postalCode");
    const mobileInput = document.getElementById("mobile");

    // Validation du code postal (5 caractères max)
    postalCodeInput.addEventListener("input", function () {
        if (postalCodeInput.value.length > 5) {
            postalCodeInput.value = postalCodeInput.value.substring(0, 5);
        }
    });

    // Validation du numéro de téléphone (15 caractères max)
    mobileInput.addEventListener("input", function () {
        if (mobileInput.value.length > 15) {
            mobileInput.value = mobileInput.value.substring(0, 15);
        }
    });
});

// Ajout : Fonction pour enregistrer les modifications via l'API
document.getElementById('registerButton')?.addEventListener('click', async function () {
    const messageContainer = document.getElementById('messageContainer');
    try {
        messageContainer.innerHTML = '';

        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token manquant');

        // Récupération des valeurs des champs
        const identifiant = document.getElementById('identifiant').value.trim();
        const motDePasse = document.getElementById('password').value.trim();
        const prenom = document.getElementById('prenom').value.trim();
        const nom = document.getElementById('nom').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const adresse = document.getElementById('adresse').value.trim();
        const ville = document.getElementById('ville').value.trim();
        const codePostal = document.getElementById('postalCode').value.trim();

        const payload = {
            compte_a_modifier: { nom_compte: identifiant },
            nom_compte: identifiant,
            mot_de_passe: motDePasse,
            nom: nom,
            prenom: prenom,
            numero_telephone: mobile,
            mail: identifiant,
            adresse: adresse,
            ville: ville,
            code_postal: codePostal
        };

        // Vérifier si le prénom ou le mot de passe ont été modifiés
        const isPrénomChanged = localStorage.getItem('prenom') !== prenom;
        const isMotDePasseChanged = localStorage.getItem('password') !== motDePasse;
        
        // Enregistrer les modifications via l'API
        const response = await fetch(`${SERVER}/updateClient`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Échec de l\'enregistrement');

        const result = await response.json();
        console.log('Modifications enregistrées avec succès', result);

        // Enregistrer les nouvelles valeurs dans localStorage
        Object.entries(payload).forEach(([key, value]) => {
            if (typeof value === 'string') {
                localStorage.setItem(key, value);
            }
        });

        messageContainer.innerHTML = '<p style="color: green;">Vos modifications ont été enregistrées avec succès !</p>';

        // Si le prénom ou le mot de passe ont été modifiés, déconnecter l'utilisateur
        if (isPrénomChanged || isMotDePasseChanged) {
            localStorage.removeItem('token');
            window.location.href = '../Connexion/Accuil.html'; // Redirection vers la page de connexion
        } else {
            // Sinon, recharger la page
            location.reload();
        }

    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        messageContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
    }
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
document.addEventListener("DOMContentLoaded", function () {

    const gestionButton = document.getElementById("gestionPersonnelButton");
    const fkProfil = localStorage.getItem("fk_profil");


    // Afficher ou masquer le bouton "Gestion personnel"
    if (fkProfil === "1") {
        gestionButton.style.display = "block";
    } else {
        gestionButton.style.display = "none";
    }

    const usernameButton = document.querySelector('button[data-bs-target="#exampleModal"]');
    const modalUsername = document.getElementById("modalUsername");
    const username = localStorage.getItem("username");


    if (username) {
        usernameButton.textContent = username;
        modalUsername.textContent = username;
    }

});

// Gestion du changement de vue dans la modale
document.getElementById("parametreBtn").addEventListener("click", function () {
    document.getElementById("mainView").classList.add("d-none");
    document.getElementById("settingsView").classList.remove("d-none");
});

document.getElementById("backBtn").addEventListener("click", function () {
    document.getElementById("settingsView").classList.add("d-none");
    document.getElementById("mainView").classList.remove("d-none");
});



// Sélection des éléments d'entrée et du bouton
const inputs = document.querySelectorAll('#identifiant, #password, #confirmPassword, #prenom, #nom, #mobile, #postalCode, #ville');
const registerButton = document.getElementById('registerButton');

// Fonction pour vérifier si tous les champs sont remplis
function checkInputs() {
    let allFilled = true;
    inputs.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
        }
    });
    registerButton.disabled = !allFilled;
}

// Ajouter des écouteurs d'événement pour vérifier les champs lorsque l'utilisateur tape
inputs.forEach(input => {
    input.addEventListener('input', checkInputs);
});

//-------------------------------------------------------------------------------------------------------------------\\
// Gestion de l'affichage de la modale
function handleCardClick(medicament) {
    // Remplir les détails du médicament dans la modale
    document.getElementById('medicamentName').textContent = medicament.nom;
    document.getElementById('zoneAction').textContent = medicament.zone_action;
    document.getElementById('effetsSecondaires').textContent = medicament.effets_secondaires;
    document.getElementById('composition').textContent = medicament.composition;
    document.getElementById('description').textContent = medicament.description;

    // Afficher la modale
    const medicamentModal = new bootstrap.Modal(document.getElementById('medicamentModal'));
    medicamentModal.show();
}

// Ajouter l'événement pour chaque carte
function attachCardClickEvent(card, medicament) {
    card.addEventListener('click', () => handleCardClick(medicament));
}
//-------------------------------------------------------------------------------------------------------------------\\


let currentPage = 1;
const totalItems = 100; // Exemple : total de médicaments dans la base (devra être récupéré dynamiquement)
const itemsPerPage = 25; // Médicaments par page
const totalPages = Math.ceil(totalItems / itemsPerPage); // Nombre total de pages

// Charger les médicaments pour une page donnée
async function loadMedicaments(page = 1) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token manquant');
            return;
        }

        const response = await fetch(`http://localhost:3000/medicaments/${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des médicaments');
        }

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
                </div>
            `;

            // Attacher l'événement pour ouvrir la modale
            attachCardClickEvent(card, medicament);

            cardContainer.appendChild(card);
        });

        currentPage = page;
        renderPagination();
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Générer les boutons de pagination
function renderPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    // Bouton "Précédent"
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `
        <a class="page-link" href="#" aria-label="Previous" onclick="loadMedicaments(${currentPage - 1})">
            <span aria-hidden="true">&laquo;</span>
        </a>
    `;
    paginationContainer.appendChild(prevLi);

    // Boutons numérotés
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `
            <a class="page-link" href="#" onclick="loadMedicaments(${i})">${i}</a>
        `;
        paginationContainer.appendChild(li);
    }

    // Bouton "Suivant"
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `
        <a class="page-link" href="#" aria-label="Next" onclick="loadMedicaments(${currentPage + 1})">
            <span aria-hidden="true">&raquo;</span>
        </a>
    `;
    paginationContainer.appendChild(nextLi);
}

// Charger la première page au démarrage
document.addEventListener('DOMContentLoaded', () => loadMedicaments());


//-------------------------------------------------------------------------------------------------------------------\\
// Gestion de la recherche
document.getElementById('searchButton').addEventListener('click', async () => {
    const searchInput = document.getElementById('searchInput').value.trim();
    const token = localStorage.getItem('token'); // Récupérer le token
    const paginationContainer = document.getElementById('pagination'); // Conteneur de pagination

    if (!token) {
        console.error('Token manquant');
        return;
    }

    const url = searchInput
        ? `http://localhost:3000/search/${searchInput}`
        : 'http://localhost:3000/medicaments';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': ` ${token}`, // Ajouter le token dans les headers
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des médicaments');
        }

        const data = await response.json();
        const cardContainer = document.getElementById('medicamentCards');
        cardContainer.innerHTML = '';

        if (data.medicaments && data.medicaments.length > 0) {
            data.medicaments.forEach(medicament => {
                const card = document.createElement('div');
                card.classList.add('col-md-4', 'mb-3');
                card.innerHTML = `
                    <div class="card card-custom">
                        <img src="../Pictures/pictures-medicaments.webp" class="card-img-top" alt="image médicament">
                        <div class="card-body">
                            <h5 class="card-title">${medicament.nom}</h5>
                        </div>
                    </div>
                `;
                attachCardClickEvent(card, medicament);
                
                cardContainer.appendChild(card);
            });

            // Masquer la pagination si une recherche est effectuée
            if (searchInput) {
                paginationContainer.style.display = 'none';
            } else {
                paginationContainer.style.display = 'block';
            }

        } else {
            cardContainer.innerHTML = `<p class="text-danger">Aucun médicament trouvé pour "${searchInput}"</p>`;
            paginationContainer.style.display = 'none'; // Masquer la pagination si aucun résultat
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
});

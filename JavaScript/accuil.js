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
    const username = localStorage.getItem("username");


    if (username) {
        usernameButton.textContent = username;
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
// Fonction pour charger les médicaments
async function loadMedicaments() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token manquant');
            return;
        }

        const response = await fetch('http://localhost:3000/medicaments', {
            method: 'GET',
            headers: {
                'Authorization': `${token}`, // Ajouter le token dans les headers
            }
        });
        console.log(response)

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
            cardContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Charger les médicaments au chargement de la page
document.addEventListener('DOMContentLoaded', loadMedicaments);

//-------------------------------------------------------------------------------------------------------------------\\
// Gestion de la recherche
document.getElementById('searchButton').addEventListener('click', async () => {
    const searchInput = document.getElementById('searchInput').value.trim();
    const token = localStorage.getItem('token'); // Récupérer le token
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
                cardContainer.appendChild(card);
            });
        } else {
            cardContainer.innerHTML = `<p class="text-danger">Aucun médicament trouvé pour "${searchInput}"</p>`;
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
});

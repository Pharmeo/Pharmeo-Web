import { SERVER } from "./const.js"; // Importation de l'URL du serveur depuis un fichier de constantes

document.addEventListener("DOMContentLoaded", () => {
    // Récupération des éléments HTML nécessaires
    const tableBody = document.getElementById("medicamentTableBody");
    const paginationContainer = document.getElementById("pagination");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    
    let currentPage = 1; // Page actuelle, initialisée à 1
    const maxPages = 4; // Limite du nombre de pages affichées
    const token = localStorage.getItem("token"); // Récupération du token d'authentification depuis le stockage local

    // Fonction pour récupérer les médicaments depuis l'API
    async function fetchMedicaments(page = 1, search = "") {
        let url = `${SERVER}/medicaments/${page}`; // URL par défaut avec la pagination
        if (search) {
            url = `${SERVER}/medicaments?name=${search}`; // Si une recherche est effectuée, on change l'URL
        }

        try {
            const response = await fetch(url, {
                headers: { "Authorization": `${token}` } // Ajout du token dans les requêtes pour l'authentification
            });

            const data = await response.json(); // Conversion de la réponse en JSON
            displayMedicaments(data.medicaments); // Affichage des médicaments dans le tableau
            updatePagination(); // Mise à jour de la pagination
        } catch (error) {
            console.error("Erreur lors de la récupération des médicaments:", error);
        }
    }

    // Fonction pour afficher les médicaments dans le tableau HTML
    function displayMedicaments(medicaments) {
        tableBody.innerHTML = ""; // Nettoyage du tableau avant d'ajouter de nouveaux éléments
        medicaments.forEach(medicament => {
            const row = document.createElement("tr"); // Création d'une ligne pour chaque médicament
            row.innerHTML = `
                <td>${medicament.nom}</td>
                <td>${medicament.zone_action}</td>
                <td>${medicament.effets_secondaires}</td>
                <td>${medicament.composition}</td>
                <td>${medicament.description}</td>
                <td><button class="btn btn-danger btn-sm delete-btn" data-id="${medicament.identifiant}"><i class="fas fa-trash"></i></button></td>
            `;
            tableBody.appendChild(row); // Ajout de la ligne au tableau
        });
    }

    // Fonction pour mettre à jour la pagination
    function updatePagination() {
        paginationContainer.innerHTML = ""; // Nettoyage de la pagination

        // Bouton précédent «
        const prevItem = document.createElement("li");
        prevItem.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
        prevItem.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
        prevItem.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--; // Décrémentation de la page actuelle
                fetchMedicaments(currentPage); // Rechargement des médicaments pour la nouvelle page
            }
        });
        paginationContainer.appendChild(prevItem);

        // Création des boutons de pagination (limité à maxPages)
        for (let i = 1; i <= maxPages; i++) {
            const li = document.createElement("li");
            li.className = `page-item ${i === currentPage ? "active" : ""}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener("click", () => {
                currentPage = i; // Mise à jour de la page actuelle
                fetchMedicaments(currentPage); // Chargement des médicaments correspondants
            });
            paginationContainer.appendChild(li);
        }

        // Bouton suivant »
        const nextItem = document.createElement("li");
        nextItem.className = `page-item ${currentPage === maxPages ? "disabled" : ""}`;
        nextItem.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
        nextItem.addEventListener("click", () => {
            if (currentPage < maxPages) {
                currentPage++; // Incrémentation de la page actuelle
                fetchMedicaments(currentPage); // Rechargement des médicaments pour la nouvelle page
            }
        });
        paginationContainer.appendChild(nextItem);
    }

    // Gestion du bouton de recherche
    searchButton.addEventListener("click", () => {
        const searchQuery = searchInput.value.trim(); // Récupération et nettoyage de la valeur du champ de recherche
        currentPage = 1; // Réinitialisation à la première page lors d'une recherche
        fetchMedicaments(currentPage, searchQuery); // Appel de l'API avec le terme de recherche
    });

    // Chargement initial des médicaments
    fetchMedicaments(currentPage);
});

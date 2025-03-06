import { SERVER } from "./const.js";

document.addEventListener('DOMContentLoaded', async () => {
    await loadComptes();
});

async function loadComptes() {
    console.log('Chargement des comptes...');
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token manquant');

        const response = await fetch(`${SERVER}/comptes`, {
            method: 'GET',
            headers: { 'Authorization': `${token}` }
        });

        if (!response.ok) throw new Error('Erreur lors de la récupération des comptes');
        const data = await response.json();

        console.log('Données reçues:', data);

        const tableBody = document.querySelector('tbody');
        tableBody.innerHTML = '';

        data.comptes.forEach(compte => {
            if (!compte.identifiant) {
                console.warn("Compte sans identifiant détecté:", compte);
                return; // On ignore les comptes sans identifiant
            }

            console.log(`Compte chargé: ID=${compte.identifiant}, Nom=${compte.nom}`);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${compte.nom || "Non défini"}</td>
                <td>${compte.prenom || "Non défini"}</td>
                <td>${compte.nom_compte || "Non défini"}</td>
                <td>${compte.numero_telephone || "Non défini"}</td>
                <td>${compte.mail || "Non défini"}</td>
                <td>${compte.adresse || "Non défini"}</td>
                <td>${compte.ville || "Non défini"}</td>
                <td>${compte.code_postal || "Non défini"}</td>
                <td>
                    <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#confirmModal">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            `;

            // Ajout d'un écouteur d'événements pour définir l'ID du compte à supprimer
            const deleteButton = row.querySelector("button");

            deleteButton.addEventListener("click", function () {
                console.log("Bouton cliqué pour l'ID:", compte.identifiant);
                setRow(compte.identifiant);
            });

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erreur:', error);
    }
}

let selectedCompteId = null;

function setRow(compteId) {
    console.log("setRow appelée avec compteId:", compteId);
    if (!compteId) {
        console.error("Erreur: compteId est undefined !");
        return;
    }
    selectedCompteId = compteId;
}

// Rendre setRow accessible globalement si nécessaire
window.setRow = setRow;

document.getElementById('confirmDelete').addEventListener('click', async () => {
    console.log("Bouton de suppression confirmé. ID sélectionné:", selectedCompteId);

    if (!selectedCompteId) {
        console.error("Aucun compte sélectionné pour suppression !");
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token manquant');

        console.log(`Suppression du compte ID: ${selectedCompteId}`);

        const response = await fetch(`${SERVER}/compte/${selectedCompteId}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `${token}`, 
                'Content-Type': 'application/json'
            }
        });

        console.log(`Statut de la requête DELETE: ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur lors de la suppression: ${response.status} - ${errorText}`);
        }

        console.log(`Compte ${selectedCompteId} supprimé avec succès`);
        await loadComptes(); // Recharger la liste après suppression

    } catch (error) {
        console.error('Erreur:', error);
    }
});

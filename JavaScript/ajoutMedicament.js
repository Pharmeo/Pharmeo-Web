import { SERVER } from "./const.js";

const nom = document.getElementById('nom');
const zoneAction = document.getElementById('zoneAction');
const effetsSecondaires = document.getElementById('effetsSecondaires');
const composition = document.getElementById('composition');
const description = document.getElementById('description');
const registerButton = document.getElementById('registerButton');
const nomError = document.getElementById('nomError');

// Fonction pour vérifier si tous les champs sont remplis
function checkInputs() {
    const inputs = [nom, zoneAction, effetsSecondaires, composition, description];
    let allFilled = true;

    inputs.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
        }
    });

    if (nom.value.trim().length < 2) {
        nomError.style.display = 'block';
        allFilled = false;
    } else {
        nomError.style.display = 'none';
    }

    registerButton.disabled = !allFilled;
}

// Ajoute un écouteur d'événement pour chaque champ
[nom, zoneAction, effetsSecondaires, composition, description].forEach(input => {
    input.addEventListener('input', checkInputs);
});

// Fonction d'envoi des données au serveur
async function sendPostRequest() {
    const data = {
        nom: nom.value.trim(),
        zone_action: zoneAction.value,
        effets_secondaires: effetsSecondaires.value.trim(),
        composition: composition.value.trim(),
        description: description.value.trim()
    };

    try {
        const response = await fetch(`${SERVER}/createMedicament`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Médicament ajouté avec succès !');
            window.location.href = "../Accuil/home.html";
        } else {
            alert('Erreur lors de l\'ajout du médicament');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de l\'envoi des données');
    }
}

// Ajoute un écouteur d'événement pour le bouton d'enregistrement
registerButton.addEventListener('click', function (event) {
    event.preventDefault();
    sendPostRequest();
});

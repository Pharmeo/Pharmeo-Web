import { SERVER } from './const.js';

// Sélection du champ identifiant, du bouton et de la zone d'erreur
const identifiantInput = document.getElementById('identifiant');
const sendPasswordButton = document.getElementById('sendPasswordButton');
const errorMessage = document.getElementById('errorMessage');

// Fonction pour vérifier si le champ identifiant est rempli
function checkIdentifiant() {
    sendPasswordButton.disabled = identifiantInput.value.trim() === '';
    errorMessage.style.display = 'none'; // Cacher l'erreur quand l'utilisateur saisit un email
}

// Ajouter un écouteur d'événement sur le champ identifiant
identifiantInput.addEventListener('input', checkIdentifiant);

// Redirection lors du clic sur le bouton "Renvoyer mot de passe"
sendPasswordButton.addEventListener('click', async function () {
    const email = identifiantInput.value.trim();

    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem('token');

    // Vérifier si le token existe
    if (!token) {
        return;
    }

    // Vérifier si l'email saisi correspond à celui stocké dans le localStorage
    const storedEmail = localStorage.getItem('mail');
    if (email !== storedEmail) {
        return;
    }

    // Construire le JSON avec l'email de l'utilisateur
    const payload = {
        to: email
    };

    try {
        const response = await fetch(`${SERVER}/sendmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Échec de l\'envoi du mail');

        // Redirection vers l'URL souhaitée si l'email est valide
        window.location.href = "../Connexion/Accuil.html";
    } catch (error) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = `Erreur : ${error.message}`;
    }
});

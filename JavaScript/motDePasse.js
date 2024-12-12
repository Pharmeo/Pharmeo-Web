// Sélection du champ identifiant et du bouton
const identifiantInput = document.getElementById('identifiant');
const sendPasswordButton = document.getElementById('sendPasswordButton');

// Fonction pour vérifier si le champ identifiant est rempli
function checkIdentifiant() {
    sendPasswordButton.disabled = identifiantInput.value.trim() === '';
}

// Ajouter un écouteur d'événement sur le champ identifiant
identifiantInput.addEventListener('input', checkIdentifiant);

// Redirection lors du clic sur le bouton "Renvoyer mot de passe"
sendPasswordButton.addEventListener('click', function () {
    const email = identifiantInput.value.trim();

    // Vérifie si l'email est reconnu
    if (email === "toto@gmail.com" || email === "admin@example.com") {
        // Redirection vers l'URL souhaitée si l'email est valide
        window.location.href = "../Connexion/Accuil.html";
    } else {
        // Affiche un message d'erreur si l'email n'est pas reconnu
        alert("Email non reconnu.");
    }
});

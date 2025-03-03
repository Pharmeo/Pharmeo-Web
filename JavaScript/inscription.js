import { SERVER } from "./const.js";

const identifiant = document.getElementById('identifiant');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const prenom = document.getElementById('prenom');
const nom = document.getElementById('nom');
const mobile = document.getElementById('mobile');
const postalCode = document.getElementById('postalCode');
const ville = document.getElementById('ville');
const adresse = document.getElementById('adresse');
const role = document.getElementById('role');
const registerButton = document.getElementById('registerButton');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Validation de l'email
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Vérification des mots de passe
function validatePasswords() {
    return password.value === confirmPassword.value;
}

// Fonction pour vérifier si tous les champs sont remplis et valides
function checkInputs() {
    const inputs = [identifiant, password, confirmPassword, prenom, nom, mobile, postalCode, adresse, ville, role];
    let allFilled = true;

    // Vérifie que chaque champ est rempli
    inputs.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
        }
    });

    // Valide l'email
    if (!validateEmail(identifiant.value)) {
        emailError.style.display = 'block';
        allFilled = false;
    } else {
        emailError.style.display = 'none';
    }

    // Valide les mots de passe
    if (!validatePasswords()) {
        passwordError.style.display = 'block';
        allFilled = false;
    } else {
        passwordError.style.display = 'none';
    }

    // Active ou désactive le bouton d'inscription
    registerButton.disabled = !allFilled;
}

// Ajoute un écouteur d'événement pour chaque champ
const inputs = [identifiant, password, confirmPassword, prenom, nom, mobile, postalCode, adresse, ville, role];
inputs.forEach(input => {
    input.addEventListener('input', checkInputs);
});

// Envoi de la requête POST
async function sendPostRequest() {
    if (!validatePasswords()) {
        alert('Les mots de passe ne correspondent pas');
        return;
    }

    // Prépare les données pour l'envoi
    const data = {
        fk_profil: role.value === 'admin' ? '1' : '3',
        nom_compte: identifiant.value,
        mot_de_passe: password.value,
        nom: nom.value,
        prenom: prenom.value,
        numero_telephone: mobile.value,
        mail: identifiant.value,
        adresse: adresse.value,
        ville: ville.value,
        code_postal: postalCode.value
    };

    // Récupère le token depuis le stockage local
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Token manquant');
        return;
    }

    // Envoi de la requête à l'API
    try {
        const response = await fetch(`${SERVER}/createClient`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.href = "../Accuil/home.html";
        } else {
            alert('Erreur lors de la création de l\'utilisateur');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de l\'envoi des données');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('togglePasswords');

    // Fonction de basculement de la visibilité
    const toggleVisibility = () => {
        // Alterner le type des deux champs
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        confirmPasswordInput.type = type;

        // Changer l'icône en fonction de l'état
        togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
        toggleConfirmPassword.textContent = type === 'password' ? '👁️' : '🙈';
    };

    // Ajouter l'événement de clic pour le toggle unique
    togglePassword.addEventListener('click', toggleVisibility);
    toggleConfirmPassword.addEventListener('click', toggleVisibility);
});



// Ajoute un écouteur d'événement pour le bouton d'inscription
registerButton.addEventListener('click', function (event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire
    sendPostRequest();
});

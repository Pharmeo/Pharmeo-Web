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

    inputs.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
        }
    });

    if (!validateEmail(identifiant.value)) {
        emailError.style.display = 'block';
        allFilled = false;
    } else {
        emailError.style.display = 'none';
    }

    if (!validatePasswords()) {
        passwordError.style.display = 'block';
        allFilled = false;
    } else {
        passwordError.style.display = 'none';
    }

    registerButton.disabled = !allFilled;
}

// Écouteurs d'événements
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
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Token manquant');
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/createClient', {
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

registerButton.addEventListener('click', function (event) {
    event.preventDefault();
    sendPostRequest();
});
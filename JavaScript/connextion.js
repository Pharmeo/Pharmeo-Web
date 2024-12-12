// Sélection des éléments du DOM
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const forgotPasswordButton = document.getElementById('forgotPasswordButton');

// Validation des champs de saisie
function validateInputs() {
    loginButton.disabled = !(emailInput.value.trim() && passwordInput.value.trim());
    forgotPasswordButton.disabled = !emailInput.value.trim();
}

// Gestion des erreurs
const passwordError = document.getElementById('passwordError');
function showError(message) {
    passwordError.textContent = message;
}
function clearError() {
    passwordError.textContent = '';
}

// Connexion
async function handleLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const loginData = { name: email, password: password };

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            const error = await response.json();
            showError(error.message || 'Une erreur est survenue.');
            return;
        }

        clearError();
        const loginResult = await response.json();
        localStorage.setItem('token', loginResult.token);

        const userResponse = await fetch('http://localhost:3000/compte', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loginResult.token}`,
            },
            body: JSON.stringify(loginData),
        });

        if (!userResponse.ok) throw new Error('Erreur lors de la récupération des informations utilisateur.');

        const userData = await userResponse.json();
        localStorage.setItem('fk_profil', userData.compte.fk_profil);
        localStorage.setItem('username', userData.compte.prenom);
        window.location.href = "../Accuil/home.html";
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        showError('Une erreur est survenue. Veuillez réessayer.');
    }
}

// Mot de passe oublié
function handleForgotPassword() {
    const email = emailInput.value.trim();
    if (email === "toto@gmail.com" || email === "admin@example.com") {
        window.location.href = "../MotDePasse/motDePasse.html";
    } else {
        alert("Email non reconnu pour la récupération du mot de passe.");
    }
}

// Ajout des écouteurs
emailInput.addEventListener('input', validateInputs);
passwordInput.addEventListener('input', validateInputs);
loginButton.addEventListener('click', handleLogin);
forgotPasswordButton.addEventListener('click', handleForgotPassword);
validateInputs();

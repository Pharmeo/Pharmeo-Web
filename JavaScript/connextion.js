// Sélection des éléments du DOM
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const forgotPasswordButton = document.getElementById('forgotPasswordButton');

// Fonction de validation des champs de saisie
function validateInputs() {
    // Le bouton "loginButton" est activé seulement si les deux champs (email et mot de passe) sont remplis
    loginButton.disabled = !(emailInput.value.trim() && passwordInput.value.trim());

    // Le bouton "forgotPasswordButton" est activé seulement si le champ email est rempli
    forgotPasswordButton.disabled = !emailInput.value.trim();
}

// Fonction pour gérer la soumission du formulaire de connexion
async function handleLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const loginData = {
        name: email,
        password: password,
    };

    try {
        // Étape 1 : Effectuer la connexion
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });
        

        if (!response.ok) {
            const error = await response.json();
            alert(error.message || 'Une erreur est survenue.');
            return;
        }

        const loginResult = await response.json();
        //console.log("fonction salaupe",loginResult.token);     
        localStorage.setItem('token', loginResult.token);

        // Étape 2 : Récupérer les informations utilisateur
        const userResponse = await fetch('http://localhost:3000/compte', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loginResult.token}`,
            },
            body: JSON.stringify(loginData),
        });

        if (!userResponse.ok) {
            throw new Error('Erreur lors de la récupération des informations utilisateur.');
        }

        const userData = await userResponse.json();
        
        localStorage.setItem('fk_profil', userData.compte.fk_profil);
        
        localStorage.setItem('username', userData.compte.prenom);




        // Étape 3 : Rediriger vers la page d'accueil
        window.location.href = "../Accuil/home.html";
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    }
}




//------------------------------------------------------------------------------------------------\\





// Fonction pour gérer l'oubli de mot de passe
function handleForgotPassword() {
    const email = emailInput.value.trim();

    // Vérifie si l'email est reconnu avant de rediriger
    if (email === "toto@gmail.com" || email === "admin@example.com") {
        window.location.href = "../MotDePasse/motDePasse.html";
    } else {
        alert("Email non reconnu pour la récupération du mot de passe.");
    }
}

// Ajouter les écouteurs d'événements
emailInput.addEventListener('input', validateInputs);
passwordInput.addEventListener('input', validateInputs);

// Gestion des boutons
loginButton.addEventListener('click', handleLogin);
forgotPasswordButton.addEventListener('click', handleForgotPassword);

// Initialiser la validation lors du chargement de la page
validateInputs();

const bouton = document.getElementById("btnConnexion");
const message = document.getElementById("messageConnexion");

bouton.addEventListener("click", async () => {
    console.log("Bouton connexion clique");

    const email = document.getElementById("identifiant")
        .value.trim();

    const motDePasse = document.getElementById("motDePasseConnexion")
        .value;

    if (!email || !motDePasse) {
        message.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    bouton.disabled = true;
    message.textContent = "Connexion en cours...";

    try {
        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: motDePasse
            });

        if (error) {
            message.textContent =
                "Courriel ou mot de passe incorrect.";
            console.error(error);
            return;
        }
        console.log("Utilisateur connecte :", data.user);
        console.log("Session creee :", !!data.session);

        // Récupérer automatiquement l'utilisateur connecté
const user = data.user;

if (!user) {
    message.textContent = "Utilisateur introuvable.";
    return;
}

// Récupérer son prénom et son nom
const prenom = user.user_metadata?.prenom || "";
const nom = user.user_metadata?.nom || "";

const nomComplet = `${prenom} ${nom}`.trim();

// Enregistrer automatiquement son profil dans Supabase
const { error: profilError } = await supabaseClient
    .from("Profiles")
    .upsert({
        id: user.id,
        nom: nomComplet
    }, {
        onConflict: "id"
    });

if (profilError) {
    console.error("Erreur du profil :", profilError.message);
    message.textContent = "Impossible d'enregistrer le profil.";
    return;
}

        message.textContent = "Connexion réussie !";

        window.location.href = "messagerie.html";

    } catch (erreur) {
        console.error(erreur);
        message.textContent =
            "Erreur de connexion au serveur.";
    } finally {
        bouton.disabled = false;
    }
});
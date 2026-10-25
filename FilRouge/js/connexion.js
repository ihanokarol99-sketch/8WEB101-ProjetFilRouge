const bouton = document.getElementById("btnConnexion");
const message = document.getElementById("messageConnexion");

bouton.addEventListener("click", async () => {

    const email = document.getElementById("identifiant")
        .value.trim();

    const motDePasse = document.getElementById("mot de passe")
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
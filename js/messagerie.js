// Vérifier si l'utilisateur est connecté
async function verifierConnexion() {

    const { data, error } =
        await window.supabaseClient.auth.getUser();

    if (error || !data.user) {
        window.location.replace("connexion.html");
        return false;
    }

    console.log("Utilisateur connecté :", data.user.email);
    return true;
}

// Déconnecter l'utilisateur
async function deconnexion() {

    const { error } =
        await window.supabaseClient.auth.signOut();

    if (error) {
        console.error("Erreur de déconnexion :", error);
        alert("Impossible de se déconnecter.");
        return;
    }

    window.location.replace("connexion.html");
}

// Vérification au chargement de la page
(async () => {
    try {
        const connecte = await verifierConnexion();

        if (connecte) {
            document.body.style.visibility = "visible";
        }
    } catch (erreur) {
        console.error("Erreur de vérification :", erreur);
        window.location.replace("connexion.html");
    }
})();

// Bouton de déconnexion
document.getElementById("btnDeconnexion")
    .addEventListener("click", deconnexion);
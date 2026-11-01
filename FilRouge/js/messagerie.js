// Vérifier si l'utilisateur est connecté
async function verifierConnexion() {

    const { data, error } =
        await window.supabaseClient.auth.getUser();

        console.log("Erreur Supabase :", error);
        console.log("Utilisateur Supabase :", data?.user);

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

// Sélectionner les conversations
document.querySelectorAll(".conversation").forEach(function(conversation) {

    conversation.addEventListener("click", function() {

        // Retirer l'ancienne sélection
        document.querySelectorAll(".conversation").forEach(function(c) {
            c.classList.remove("conversation-active");
        });

        // Activer la conversation choisie
        conversation.classList.add("conversation-active");
        document.getElementById("btnVoirProfil").hidden = false;

        // Récupérer le nom
        const nom = conversation.querySelector("strong").textContent;

        // Afficher le nom dans la discussion
        document.querySelector(".entete-discussion h2").textContent = nom;

        // Afficher un message temporaire
        document.getElementById("listeMessages").textContent =
            "Conversation sélectionnée : " + nom;
    });

});

// Ouvrir le profil du chasseur sélectionné
document.getElementById("btnVoirProfil")
    .addEventListener("click", function () {

        const idDestinataire =
            document.getElementById("receiverId").value.trim();

        if (!idDestinataire) {
            alert("Veuillez d'abord sélectionner une conversation.");
            return;
        }

        window.location.href =
            "profil.html?id=" + encodeURIComponent(idDestinataire);
    });

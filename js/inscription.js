document.addEventListener("DOMContentLoaded", function () {

    const bouton = document.getElementById("boutonInscription");

    bouton.addEventListener("click", async function () {

        // Récupérer les informations
        const prenom = document.getElementById("prenomInscription").value.trim();
        const nom = document.getElementById("nomInscription").value.trim();
        const email = document.getElementById("AdresseInscription").value.trim();
        const utilisateur = document.getElementById("courrielInscription").value.trim();
        const motdepasse = document.getElementById("passwordInscription").value;
        const confirmation = document.getElementById("passInscription").value;

        // Vérifier les champs vides
        if (!prenom || !nom || !email || !utilisateur ||
            !motdepasse || !confirmation) {

            alert("Veuillez remplir tous les champs.");
            return;
        }

        // Vérifier le courriel
        if (!document.getElementById("AdresseInscription").checkValidity()) {
            alert("Veuillez entrer une adresse courriel valide.");
            return;
        }

        // Vérifier la longueur du mot de passe
        if (motdepasse.length < 8) {
            alert("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        // Vérifier les deux mots de passe
        if (motdepasse !== confirmation) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
    
        // Créer le compte dans Supabase
bouton.disabled = true;

try {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: motdepasse,
        options: {
            data: {
                prenom: prenom,
                nom: nom,
                nom_utilisateur: utilisateur
            }
        }
    });

   if (error) {
    console.error("Erreur Supabase :", error);

    alert(
        "Impossible de terminer l'inscription : " +
        error.message
    );
    return;
}

if (!data.user) {
    alert("La création du compte n'a pas pu être confirmée.");
    return;
}

if (!data.session) {
    alert(
        "Inscription réussie ! Vérifiez votre courriel " +
        "pour confirmer votre compte avant de vous connecter."
    );

    window.location.href = "connexion.html";
    return;
}

alert("Compte créé avec succès !");
window.location.href = "information.html";

} catch (erreur) {
    alert("Impossible de contacter Supabase. Vérifiez votre connexion.");
    console.error(erreur);

} finally {
    bouton.disabled = false;
}




        // Validation réussie
        //alert("Informations validées !");

        // Redirection vers la page suivante
        //window.location.href = "information.html";

    });

});
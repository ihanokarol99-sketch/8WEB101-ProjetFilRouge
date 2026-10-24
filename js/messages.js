document.addEventListener("DOMContentLoaded", function () {

    const bouton = document.getElementById("btnEnvoyer");
    const champ = document.getElementById("messageInput");

    bouton.addEventListener("click", async function () {

        const message = champ.value.trim();

        if (!message) {
            alert("Veuillez écrire un message.");
            return;
        }

        const { data, error } =
            await window.supabaseClient.auth.getUser();

        if (error || !data.user) {
            alert("Vous devez être connecté.");
            return;
        }

        console.log("Utilisateur connecté :", data.user.id);
        console.log("Message :", message);

    });

});
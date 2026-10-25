document.addEventListener("DOMContentLoaded", function () {

    const bouton = document.getElementById("btnEnvoyer");
    const champ = document.getElementById("messageInput");
    const destinataire = document.getElementById("receiverId");

    bouton.addEventListener("click", async function () {

        const message = champ.value.trim();
        const receiverId = destinataire.value.trim();

        if (!message || !receiverId) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const { data, error } =
                await window.supabaseClient.auth.getUser();

            if (error || !data.user) {
                alert("Vous devez être connecté.");
                return;
            }

            const senderId = data.user.id;

            const { error: messageError } =
                await window.supabaseClient
                    .from("messages")
                    .insert({
                        sender_id: senderId,
                        receiver_id: receiverId,
                        content: message
                    });

            if (messageError) {
                console.error("Erreur Supabase :", messageError);
                alert("Impossible d'envoyer le message.");
                return;
            }

            alert("Message envoyé avec succès !");
            champ.value = "";

        } catch (erreur) {
            console.error("Erreur :", erreur);
            alert("Une erreur est survenue.");
        }

    });

});
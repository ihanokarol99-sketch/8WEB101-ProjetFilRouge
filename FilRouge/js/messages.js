document.addEventListener("DOMContentLoaded", function () {
    const bouton = document.getElementById("btnEnvoyer");
    const champ = document.getElementById("messageInput");
    const destinataire = document.getElementById("receiverId");
    const liste = document.getElementById("listeMessages");
    const client = window.supabaseClient;

    if (!bouton || !champ || !destinataire || !liste || !client) {
        console.error("Un élément de la messagerie est introuvable.");
        return;
    }

    let utilisateurId = null;

    async function verifierUtilisateur() {
        const { data, error } = await client.auth.getUser();

        if (error || !data.user) {
            console.error("Utilisateur non connecté :", error);
            return false;
        }

        utilisateurId = data.user.id;
        return true;
    }

    async function chargerMessages() {
        const receiverId = destinataire.value.trim();

        console.log("Mon identifiant :", utilisateurId);
        console.log("Identifiant du destinataire :", receiverId);

        if (!receiverId || !utilisateurId) {
            liste.textContent = "Sélectionnez un destinataire.";
            return;
        }

        liste.textContent = "Chargement des messages...";

        const { data, error } = await client
            .from("messages")
            .select("id, sender_id, receiver_id, content, created_at")
            .or(
                `and(sender_id.eq.${utilisateurId},receiver_id.eq.${receiverId}),` +
                `and(sender_id.eq.${receiverId},receiver_id.eq.${utilisateurId})`
            )
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Erreur de chargement :", error);
            liste.textContent = "Impossible de charger les messages.";
            return;
        }

        liste.replaceChildren();

        if (data.length === 0) {
            liste.textContent = "Aucun message pour le moment.";
            return;
        }

        data.forEach(function (message) {
            const element = document.createElement("div");

            const envoye = message.sender_id === utilisateurId;

            element.className = envoye
                ? "message-envoye"
                : "message-recu";

            element.textContent = message.content;
            liste.appendChild(element);
        });

        liste.scrollTop = liste.scrollHeight;
    }

    bouton.addEventListener("click", async function () {
        const message = champ.value.trim();
        const receiverId = destinataire.value.trim();

        if (!message || !receiverId) {
            alert("Veuillez écrire un message et choisir un destinataire.");
            return;
        }

        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(receiverId)) {
            alert("L'identifiant du destinataire est invalide.");
            return;
        }

        if (!utilisateurId && !(await verifierUtilisateur())) {
            alert("Vous devez être connecté.");
            return;
        }

        if (receiverId === utilisateurId) {
            alert("Vous ne pouvez pas vous envoyer un message.");
            return;
        }

        bouton.disabled = true;

        try {
            const { error } = await client
                .from("messages")
                .insert({
                    sender_id: utilisateurId,
                    receiver_id: receiverId,
                    content: message
                });

            if (error) {
                console.error("Erreur d'envoi :", error);
                alert("Impossible d'envoyer le message.");
                return;
            }

            champ.value = "";
            await chargerMessages();

        } catch (erreur) {
            console.error("Erreur :", erreur);
            alert("Une erreur est survenue.");
        } finally {
            bouton.disabled = false;
        }
    });

    destinataire.addEventListener("change", chargerMessages);

    (async function () {
        if (await verifierUtilisateur()) {
            await chargerMessages();
        }
    })();
});


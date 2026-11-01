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

    element.className =
        message.sender_id === utilisateurId
            ? "message-envoye"
            : "message-recu";

    const texte = document.createElement("div");
    texte.textContent = message.content;

    const heure = document.createElement("small");
    heure.className = "heure-message";

    heure.textContent = new Date(
        message.created_at
    ).toLocaleTimeString("fr-CA", {
        hour: "2-digit",
        minute: "2-digit"
    });

    element.appendChild(texte);
    element.appendChild(heure);
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

        if (!(await verifierUtilisateur())) {
            alert("Vous devez être connecté.");
            return;
        }

        if (receiverId === utilisateurId) {
            alert("Vous ne pouvez pas vous envoyer un message.");
            return;
        }

        bouton.disabled = true;

        try {
            console.log("Expéditeur :", utilisateurId);
            console.log("Destinataire :", receiverId);

            const { data: { user } } = await client.auth.getUser();

            console.log("Utilisateur authentifié :", user?.id);
            console.log("Expéditeur :", utilisateurId);
            console.log("Destinataire :", receiverId);

            const { error } = await client
                .from("messages")
                .insert({
                    sender_id: utilisateurId,
                    receiver_id: receiverId,
                    content: message
                });

            if (error) {
                console.error("Erreur Supabase complète :", error);
                alert("Erreur : " + error.message);
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
            await chargerMembres();
            await chargerMessages();

            activerRealtime();
        }
    })();

    async function chargerMembres() {
    const { data, error } = await client
        .from("Profiles")
        .select("id, nom")
        .neq("id", utilisateurId)
        .order("nom");

    if (error) {
        console.error("Erreur membres :", error.message);
        return;
    }

    console.log("Membres récupérés :", data);

    const zone = document.getElementById("listeConversations");

if (!zone) {
    console.error("Zone des conversations introuvable.");
    return;
}

zone.replaceChildren();

data.forEach(membre => {
    const conversation = document.createElement("div");

    conversation.className = "conversation";
    conversation.dataset.userId = membre.id;
    conversation.textContent = membre.nom || "Utilisateur";

    zone.appendChild(conversation);
});
}

let canalMessages = null;

function activerRealtime() {
    canalMessages = client
        .channel("messages-gohunt")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "messages"
            },
            async (payload) => {
                console.log("Nouveau message reçu :", payload);

                await chargerMessages();
            }
        )
        .subscribe((status) => {
            console.log("Realtime :", status);
        });
}

    const zoneConversations =
    document.getElementById("listeConversations");

zoneConversations.addEventListener("click", async function (event) {

    const conversation = event.target.closest(".conversation");

    if (!conversation || !zoneConversations.contains(conversation)) {
        return;
    }

    const userId = conversation.dataset.userId;

    if (!userId) {
        return;
    }

    // Afficher le bouton Voir le profil
    const boutonProfil = document.getElementById("btnVoirProfil");

    if (boutonProfil) {
    boutonProfil.style.display = "inline-block";
    }

    // Sélectionner le destinataire
    destinataire.value = userId;
    console.log("Destinataire selectionne :", destinataire.value);

    // Afficher son nom
    document.getElementById("nomDestinataire").textContent =
        conversation.textContent;

    // Mettre en évidence la conversation active
    zoneConversations.querySelectorAll(".conversation")
        .forEach(c => c.classList.remove("conversation-active"));

    conversation.classList.add("conversation-active");

    // Charger les messages
    await chargerMessages();
    });
});


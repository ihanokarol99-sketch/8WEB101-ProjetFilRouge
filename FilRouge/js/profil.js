
document.addEventListener("DOMContentLoaded", async function () {
    const client = window.supabaseClient;

    const message = document.getElementById("messageProfil");

    if (!client) {
        message.textContent = "Connexion à Supabase indisponible.";
        return;
    }

    const { data: authData, error: authError } =
        await client.auth.getUser();

    if (authError || !authData.user) {
        window.location.href = "connexion.html";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const idProfil = params.get("id") || authData.user.id;

    const { data: profil, error } = await client
        .from("Profiles")
        .select("nom, annees_experience, nombre_gibiers, type_chasse")
        .eq("id", idProfil)
        .single();

    if (error || !profil) {
        message.textContent = "Profil introuvable ou inaccessible.";
        console.error(error);
        return;
    }

    const gibiers = profil.nombre_gibiers ?? 0;

    let score = 0;

    if (gibiers >= 11) score = 5;
    else if (gibiers >= 8) score = 4;
    else if (gibiers >= 5) score = 3;
    else if (gibiers >= 2) score = 2;
    else if (gibiers >= 1) score = 1;

    document.getElementById("nomProfil").textContent =
        profil.nom || "Chasseur";

    document.getElementById("experienceProfil").textContent =
        (profil.annees_experience ?? 0) + " ans";

    document.getElementById("gibiersProfil").textContent = gibiers;

    document.getElementById("chasseProfil").textContent =
        profil.type_chasse || "Non renseigné";

    document.getElementById("etoilesProfil").textContent =
        "★".repeat(score) + "☆".repeat(5 - score);

    document.getElementById("noteProfil").textContent =
        score + "/5 étoiles";
});

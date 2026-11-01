document.addEventListener("DOMContentLoaded", function () {
    const bouton = document.getElementById("btnContinuer");

    bouton.addEventListener("click", async function () {
        const annees = document.getElementById("anneesExperience").value;
        const type = document.getElementById("typeChasse").value;
        const gibiers = document.getElementById("nombreGibiers").value;

        if (annees === "" || type === "" || gibiers === "") {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const client = window.supabaseClient;

        const { data, error: authError } = await client.auth.getUser();

        if (authError || !data.user) {
            alert("Veuillez vous connecter avant de continuer.");
            window.location.href = "connexion.html";
            return;
        }

        const { data: profil, error } = await client
            .from("Profiles")
            .update({
                annees_experience: Number(annees),
                type_chasse: type,
                nombre_gibiers: Number(gibiers)
            })
            .eq("id", data.user.id)
            .select("id");

        if (error) {
            console.error("Erreur Supabase :", error);
            alert("Impossible d'enregistrer les informations.");
            return;
        }

        if (!profil || profil.length === 0) {
            alert("Profil introuvable dans Supabase.");
            return;
        }

        alert("Informations enregistrées avec succès !");
        window.location.href = "accueil.html";
    });
});
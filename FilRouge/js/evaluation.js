document.addEventListener("DOMContentLoaded", function () {

    const gibiers = document.getElementById("nombreGibiers");
    const etoiles = document.getElementById("etoilesChasseur");
    const note = document.getElementById("noteChasseur");

    gibiers.addEventListener("input", function () {

        const nombre = Number(gibiers.value);
        let score = 0;

        if (nombre >= 11) {
            score = 5;
        } else if (nombre >= 8) {
            score = 4;
        } else if (nombre >= 5) {
            score = 3;
        } else if (nombre >= 2) {
            score = 2;
        } else if (nombre >= 1) {
            score = 1;
        }

        etoiles.textContent =
            "★".repeat(score) + "☆".repeat(5 - score);

        note.textContent = score + "/5 étoiles";
    });

});
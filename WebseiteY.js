const gültigeNamen = ["Daniell", "Yasemin", "Yasso", "Belle"];
const passwörter = { "daniell": "0705", "yasemin": "061225", "yasso": "061225", "belle": "061225" };
const passwortLängen = { "daniell": 4, "yasemin": 6, "yasso": 6, "belle": 6 };

const nameEingabe = document.getElementById("nameInput");
const nameFehler = document.getElementById("nameError");
const passwortBereich = document.getElementById("passwort-bereich");
const passwortAnzeige = document.getElementById("passwort-anzeige");
const tastenFeld = document.getElementById("tastenfeld");
const keypadText = document.getElementById("keypad-text");
const passwortFehler = document.getElementById("passwordError");
const countdown = document.getElementById("countdown");

let aktuellerName = "";
let eingegebenesPasswort = "";

// ==================== Countdown ====================
const zielDatum = new Date("2027-11-25T00:00:00");
function updateCountdown() {
    const jetzt = new Date();
    const diff = zielDatum - jetzt;

    if (diff <= 0) {
        countdown.textContent = "🎉 Event erreicht!";
        return;
    }

    const tage = Math.floor(diff / (1000 * 60 * 60 * 24));
    const stunden = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minuten = Math.floor((diff / (1000 * 60)) % 60);
    const sekunden = Math.floor((diff / 1000) % 60);

    countdown.textContent = `${tage}T ${stunden}H ${minuten}M ${sekunden}S`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ==================== Hintergrund & Keypad Text ====================
function hintergrundSetzen(name) {
    switch(name.toLowerCase()) {
        case "daniell":
            document.body.classList.add("daniell-hintergrund");
            document.body.classList.remove("romantischer-hintergrund");
            keypadText.textContent = "Der Meister ist da! Gib dein Passwort ein!";
            break;
        default:
            document.body.classList.add("romantischer-hintergrund");
            document.body.classList.remove("daniell-hintergrund");
            keypadText.textContent = `OOOOOOh meine schöne Frau is da! Gib dein Passwort ein! ❤️`;
            break;
    }
}

// ==================== Name bestätigen ====================
function nameBestätigen() {
    const nameInputVal = nameEingabe.value.trim().toLowerCase();
    const nameGefunden = gültigeNamen.find(n => n.toLowerCase() === nameInputVal);

    if (nameGefunden) {
        aktuellerName = nameGefunden.toLowerCase();

        // Namenseingabe ausblenden
        document.getElementById("name-verification").classList.add("hidden");

        // Passwortbereich erst jetzt anzeigen
        passwortBereich.classList.remove("hidden");

        hintergrundSetzen(aktuellerName);
        eingegebenesPasswort = "";
        erstelleSlots(passwortLängen[aktuellerName]);
        aktualisiereAnzeige();
        passwortFehler.textContent = "";
    } else {
        nameFehler.textContent = "Name nicht gefunden!";
    }
}

// ==================== Passwort-Slots ====================
function erstelleSlots(anzahl) {
    passwortAnzeige.innerHTML = "";
    for (let i = 0; i < anzahl; i++) {
        const slot = document.createElement("div");
        slot.classList.add("passwort-slot");
        passwortAnzeige.appendChild(slot);
    }
}

function aktualisiereAnzeige() {
    const slots = document.querySelectorAll(".passwort-slot");
    slots.forEach((slot, index) => {
        if (index < eingegebenesPasswort.length) {
            slot.classList.add("gefüllt");
            slot.textContent = "●";
        } else {
            slot.classList.remove("gefüllt");
            slot.textContent = "";
        }
    });
}

// ==================== Passwort prüfen ====================
function passwortPrüfen() {
    if (eingegebenesPasswort === passwörter[aktuellerName]) {
        window.location.href = "YassiSeite.html";
    } else {
        passwortFehler.textContent = "Falsches Passwort!";
        eingegebenesPasswort = "";
        aktualisiereAnzeige();
    }
}

// ==================== EventListener ====================
nameEingabe.addEventListener("keyup", (e) => {
    if (e.key === "Enter") nameBestätigen();
});

// ==================== Keypad Klicks + Partikel ====================
tastenFeld.addEventListener("click", (e) => {
    if (e.target.classList.contains("key")) {
        eingegebenesPasswort += e.target.textContent;
        aktualisiereAnzeige();
        erzeugenPartikel(e.target);
    } else if (e.target.id === "clear") {
        eingegebenesPasswort = eingegebenesPasswort.slice(0, -1);
        aktualisiereAnzeige();
    } else if (e.target.id === "submitPassword") {
        passwortPrüfen();
    }
});

// ==================== Tastatureingabe ====================
document.addEventListener("keydown", (e) => {
    if (!passwortBereich.classList.contains("hidden")) {
        if (e.key >= "0" && e.key <= "9") {
            eingegebenesPasswort += e.key;
            aktualisiereAnzeige();
            const keyButton = Array.from(tastenFeld.children).find(btn => btn.textContent === e.key);
            if (keyButton) erzeugenPartikel(keyButton);
        } else if (e.key === "Backspace") {
            eingegebenesPasswort = eingegebenesPasswort.slice(0, -1);
            aktualisiereAnzeige();
        } else if (e.key === "Enter") {
            passwortPrüfen();
        }
    }
});

// ==================== Partikel Funktion ====================
function erzeugenPartikel(button) {
    for (let i = 0; i < 6; i++) {
        const partikel = document.createElement("span");
        partikel.classList.add("particle");
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        partikel.style.setProperty('--x', x);
        partikel.style.setProperty('--y', y);
        button.appendChild(partikel);
        setTimeout(() => { partikel.remove(); }, 500);
    }
}

document.getElementById("back").addEventListener("click", () => {
    window.location.href = "index.html";
});

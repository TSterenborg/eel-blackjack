export function disableDevTools() {
    let bannedKeys = ["F5", "F11", "F12"]
    let bannedCtrlKeys = ["R", "W", "T", "U", "P", "S", "F", "G", "H", "J", "N", "-", "="]
    let bannedCtrlShiftKeys = ["I", "J", "G", "W", "_", "+", "O", "P", "C"]

    document.addEventListener("keydown", (event) => {
        if ((event.ctrlKey && bannedCtrlKeys.includes(event.key.toUpperCase())) || (event.ctrlKey && event.shiftKey && bannedCtrlShiftKeys.includes(event.key.toUpperCase())) || bannedKeys.includes(event.key.toUpperCase())) {
            event.preventDefault();
            event.stopPropagation();
        }
    });
}

export function playRandomChipSound() {
    let chipSounds = ["chipsCollide1.ogg", "chipsCollide2.ogg", "chipsCollide3.ogg"];
    let randomChipSound = chipSounds[Math.floor(Math.random() * chipSounds.length)];
    let audio = new Audio("../assets/sfx/chips/" + randomChipSound);
    
    audio.play();
}
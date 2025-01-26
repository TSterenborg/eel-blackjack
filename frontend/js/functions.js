// BETTING SYSTEM

export function dealNow() {
    document.getElementById('placeBetAnimation1').classList.add('fade-out');

    let icon = document.getElementById('icon');

    icon.classList.add("deal-icon-shrink");
    icon.classList.remove("deal-icon-shrink");
    icon.innerText = "check_circle";
    icon.classList.add("deal-icon-grow")


    setTimeout(function() {
        document.getElementById('placeBetAnimation2').classList.add('fade-out');
    }, 700);

    // setTimeout(() => {
    //     document.getElementById("placeBetContainer").remove();
    // }, 1200);

    setTimeout(() => {
        document.getElementById("placeBetContainer").style.display = "none";
    }, 1200);

    setTimeout(() => {
        let game_hands = document.getElementById('gameHands');
        game_hands.style.display = "block";
    }, 1200);

    setTimeout(() => {
        let game_hands = document.getElementById('game-decision-id');
        game_hands.style.display = "flex";
    }, 1200);

}
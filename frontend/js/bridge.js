import { playRandomChipSound } from './utils.js';

// BETTING SYSTEM

export function updateBalances() {
    eel.get_player_balance()(function(result) {
        document.getElementById('balance').innerText =  "$ " + result.balance;
        document.getElementById('gameBalance').innerText =  "$ " + result.game_balance;

        document.getElementById('gameChipsContainer').innerHTML = '';

        result.game_chips.forEach(function(chip, index) {
            let chipElement = document.createElement('div');
            chipElement.classList.add('overlay-bottom-mid-chips-slot');
            chipElement.classList.add('slot' + (index + 1));
            
            let chipImage = document.createElement('img');
            chipImage.src = `./assets/img/chips/${chip.value}.svg`;
            chipImage.alt = chip.value;
            
            chipElement.appendChild(chipImage);
            document.getElementById('gameChipsContainer').appendChild(chipElement);
        });
    });
}

export function buyChip(chipValue) {
    const maxChips = 5
    eel.get_player_balance()(function(result) {
        if (result) {
            if (result.game_chips.length >= maxChips) {
                console.log("Maximum number of chips reached:", maxChips);
            } else {
                eel.buy_chip(chipValue)(function(success) {
                    if (success) {
                        console.log("Chip bought successfully:", chipValue);
                        playRandomChipSound();
                        updateBalances();
                    } else {
                        console.log("Insufficient balance to buy chip:", chipValue);
                    }
                });
            }
        } else {
            console.error("Failed to get player balance.");
        }
    });
}

export function undoLastChip() {
    eel.undo_last_chip()(function(result) {
        if (result) {
            console.log("Last chip undone successfully.");
            playRandomChipSound();
            updateBalances();
        } else {
            console.log("Failed to undo last chip.");
        }
    });
}

export function clearChips() {
    eel.clear_chips()(function(result) {
        if (result) {
            console.log("Chips cleared successfully.");
            updateBalances();
        } else {
            console.log("Failed to clear chips.");
        }
    });
}

export function updateHands() {
    eel.get_hands()(function(result) {
        const playerHandDiv = document.getElementById('playerHand');
        const dealerHandDiv = document.getElementById('dealerHand');

        playerHandDiv.innerHTML = '';
        dealerHandDiv.innerHTML = '';

        result.player.forEach(card => {
            let cardElement = document.createElement('img');
            cardElement.src = `./assets/img/deck/${card}`;
            cardElement.alt = card;
            playerHandDiv.appendChild(cardElement);
        });

        result.dealer.forEach(card => {
            let cardElement = document.createElement('img');
            cardElement.src = `./assets/img/deck/${card}`;
            cardElement.alt = card;
            dealerHandDiv.appendChild(cardElement);
        });
    });
}
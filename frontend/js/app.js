import { updateBalances, buyChip, undoLastChip, clearChips, updateHands } from './bridge.js';
import { dealNow } from './functions.js';
import { disableDevTools } from './utils.js';

export function CustomUpdateHands() {
    eel.get_hands()(function(hands) {
        console.log("Player's Hand: ", hands.player);
        console.log("Dealer's Hand: ", hands.dealer);

        function getCardValue(rank) {
            switch (rank) {
                case '2': case '3': case '4': case '5': case '6':
                case '7': case '8': case '9': case '10':
                    return parseInt(rank);
                case 'joker': case 'queen': case 'king':
                    return 10;
                case 'ace':
                    return 11;
                default:
                    return 0;
            }
        }

        let playerHandValue = hands.player.reduce((total, card) => {
            let [, rank] = card.split('-');
            rank = rank.split('.')[0];
            let value = getCardValue(rank);
            return total + value;
        }, 0);

        console.log("Player's Hand Value: " + playerHandValue);

        let dealerHandValue = hands.dealer.reduce((total, card) => {
            let [, rank] = card.split('-');
            rank = rank.split('.')[0];
            let value = getCardValue(rank);
            return total + value;
        }, 0);

        console.log("Dealer's Hand Value: " + dealerHandValue);

        if (playerHandValue > 21) {
            determineWinner(playerHandValue,dealerHandValue)
            return
        }

    });
}


function determineWinner(playerHandValue, dealerHandValue) {
    let winner;

    console.log("Player's Hand Value: ", playerHandValue);
    console.log("Dealer's Hand Value: ", dealerHandValue);

    if (playerHandValue > 21) {
        winner = "Dealer wins, Player busts";
        console.log("Winner: " + winner);
        eel.handle_winnings_or_losses(false);  // Player loses
        setTimeout(startNewGame, 2000); 
        document.getElementById("showLoss").style.display = "block"
        return;
    } 
    
    if (dealerHandValue > 21) {
        winner = "Player wins, Dealer busts";
        console.log("Winner: " + winner);
        eel.handle_winnings_or_losses(true);  // Player wins
        setTimeout(startNewGame, 2000); 
        document.getElementById("showWin").style.display = "block"
        return;
    } 
    
    if (playerHandValue === dealerHandValue) {
        winner = "It's a tie";
        console.log("Winner: " + winner);
        eel.handle_tie()  // No winner, player loses
        setTimeout(startNewGame, 2000);
        document.getElementById("showTie").style.display = "block"
        return;
    } 
    
    if (playerHandValue > dealerHandValue) {
        winner = "Player wins";
        console.log("Winner: " + winner);
        eel.handle_winnings_or_losses(true);  // Player wins
        setTimeout(startNewGame, 2000);
        document.getElementById("showWin").style.display = "block"
        return;
    } 
    
    winner = "Dealer wins";
    console.log("Winner: " + winner);
    eel.handle_winnings_or_losses(false);  // Player loses
    document.getElementById("showLoss").style.display = "block"
    setTimeout(startNewGame, 2000);
}



function startNewGame() {
    eel.start_new_round()(function(result) {
        if (result) {
            console.log("New round started");

            let icon = document.getElementById('icon');
            icon.innerText = "playing_cards";


            document.getElementById('placeBetContainer').style.display = 'block';
            document.getElementById('placeBetContainer').classList.remove('fade-out');
            document.getElementById('placeBetAnimation1').classList.remove('fade-out');
            document.getElementById('placeBetAnimation2').classList.remove('fade-out');

            
            updateBalances()

            document.getElementById("showWin").style.display = "none"
            document.getElementById("showLoss").style.display = "none"
            document.getElementById("showTie").style.display = "none"
            
            setTimeout(() => {
                let game_hands = document.getElementById('gameHands');
                game_hands.style.display = "none";
            }, 100);
        
            setTimeout(() => {
                let game_hands = document.getElementById('game-decision-id');
                game_hands.style.display = "none";
            }, 100);

            
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const chipButtons = document.querySelectorAll('.place-bet-chip-button');
    chipButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chipValue = parseInt(this.dataset.value);
            buyChip(chipValue);
        });
    });

    document.getElementById('undoButton').addEventListener('click', undoLastChip);
    document.getElementById('clearChipsButton').addEventListener('click', clearChips);

    document.getElementById('dealNowButton').addEventListener('click', () => {
        eel.get_player_balance()(function(result) {
            if (result) {
                if (result.game_chips.length > 0) {
                    dealNow();
                    updateHands();
                } else {
                    console.log("Minimum number of chips not reached: 1");
                }
            }
        });
    });

    document.getElementById('option-button-hit').addEventListener('click', () => {
        eel.hit()(function(result) {
            if (result) {
                CustomUpdateHands();
                updateHands()
            }
        });
    });

    document.getElementById('option-button-stand').addEventListener('click', async () => {
        let result = await eel.player_stand()();

        if (result) {
            console.log("Dealer's turn");
            updateHands();

            eel.get_hands()(function(hands) {
                function getCardValue(rank) {
                    switch (rank) {
                        case '2': case '3': case '4': case '5': case '6':
                        case '7': case '8': case '9': case '10':
                            return parseInt(rank);
                        case 'joker': case 'queen': case 'king':
                            return 10;
                        case 'ace':
                            return 11;
                        default:
                            return 0;
                    }
                }

                let playerHandValue = hands.player.reduce((total, card) => {
                    let [, rank] = card.split('-');
                    rank = rank.split('.')[0];
                    let value = getCardValue(rank);
                    return total + value;
                }, 0);

                console.log("Player's Hand Value: " + playerHandValue);

                
        

                if (hands.dealer.length > 0) {
                    let dealerHandValue = hands.dealer.reduce((total, card) => {
                        let [, rank] = card.split('-');
                        rank = rank.split('.')[0];
                        let value = getCardValue(rank);
                        return total + value;
                    }, 0);

                    console.log("Dealer's Hand Value: " + dealerHandValue);

                    determineWinner(playerHandValue, dealerHandValue);
                }
            });
        }
    });

    updateBalances();
    updateHands();
});
document.getElementById('placeBetContainer').style.display = 'block';
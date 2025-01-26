import eel

from backend.classes.game_balance import GameBalance
from backend.classes.round_handler import RoundHandler

MAX_CHIPS = 5

player_balance = GameBalance()
playing = True

round_handler = RoundHandler('./frontend/json/deck_of_cards.json')
round_handler.start_new_round()

@eel.expose
def get_player_balance():
    return {
        'balance': player_balance.balance,
        'game_balance': player_balance.game_balance,
        'game_chips': player_balance.game_chips
    }

@eel.expose
def buy_chip(chip_value):
    if len(player_balance.game_chips) < MAX_CHIPS:
        success = player_balance.buy_chips(chip_value)
        return success    
    else:
        return False

@eel.expose
def clear_chips():
    for chip in player_balance.game_chips:
        player_balance.add_balance(chip['value'])

    player_balance.clear_chips()

    return True

@eel.expose
def undo_last_chip():
    if player_balance.game_chips:
        last_chip_value = player_balance.game_chips[-1]['value']
        player_balance.add_balance(last_chip_value)
        player_balance.subtract_game_balance(last_chip_value)
        player_balance.game_chips.pop()
        return True
    else:
        return False

@eel.expose
def player_stand():
    return round_handler.player_stand()

@eel.expose
def hit():
    if round_handler.playing:
        round_handler.hit(round_handler.player_hand)
        if round_handler.calculate_hand_value(round_handler.player_hand) > 21:
            round_handler.playing = False
            round_handler.dealer_play()
    return round_handler.get_hands()

@eel.expose
def get_hands():
    return round_handler.get_hands()

@eel.expose
def start_new_round():
    round_handler.start_new_round()
    return round_handler.get_hands()

@eel.expose
def handle_winnings_or_losses(player_wins):
    if player_wins:
        handle_player_win()
    else:
        handle_player_loss()

def handle_player_win():
    global player_balance
    chips_total = sum(chip['value'] for chip in player_balance.game_chips)
    payout = chips_total * 2

    player_balance.game_chips = []
    player_balance.game_balance = 0

    player_balance.add_balance(payout)

@eel.expose
def handle_tie():
    global player_balance
    chips_total = sum(chip['value'] for chip in player_balance.game_chips)
    payout = chips_total

    player_balance.game_chips = []
    player_balance.game_balance = 0

    player_balance.add_balance(payout)


def handle_player_loss():
    global player_balance

    player_balance.game_chips = []
    player_balance.game_balance = 0

eel.init("frontend")
eel.start("index.html", size=(1200, 650))
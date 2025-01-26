from typing import Dict, List, Optional
from backend.classes.deck import Deck
from backend.classes.hand import Hand

class RoundHandler:
    def __init__(self, json_path: str) -> None:
        self.json_path: str = json_path
        self.deck: Deck = Deck(self.json_path)
        self.deck.shuffle()
        self.player_hand: Hand = Hand()
        self.dealer_hand: Hand = Hand()
        self.playing: bool = True

    def start_new_round(self) -> None:
        self.deck = Deck(self.json_path)
        self.deck.shuffle()
        self.player_hand = Hand()
        self.dealer_hand = Hand()
        self.playing = True

        self.player_hand.add_card(self.deck.deal())
        self.player_hand.add_card(self.deck.deal())
        self.dealer_hand.add_card(self.deck.deal())
        self.dealer_hand.add_card(self.deck.deal())

    def hit(self, hand: Hand) -> None:
        hand.add_card(self.deck.deal())
        hand.adjust_for_ace()

    def dealer_play(self) -> str:
        while self.calculate_hand_value(self.dealer_hand) < 17:
            self.hit(self.dealer_hand)
        self.playing = False
        return self.determine_winner()

    def calculate_hand_value(self, hand: Hand) -> int:
        value = sum(card.value for card in hand.cards)
        if value > 21 and any(card.rank == 'A' for card in hand.cards):
            value -= 10
        return value

    def get_hands(self) -> Dict[str, List[str]]:
        player_cards = [card.__str__() for card in self.player_hand.cards]
        dealer_cards = [card.__str__() for card in self.dealer_hand.cards]
        return {'player': player_cards, 'dealer': dealer_cards}

    def determine_winner(self) -> str:
        player_value = self.calculate_hand_value(self.player_hand)
        dealer_value = self.calculate_hand_value(self.dealer_hand)

        if player_value > 21:
            return "Dealer wins, Player busts"
        elif dealer_value > 21:
            return "Player wins, Dealer busts"
        elif player_value == dealer_value:
            return "It's a tie"
        elif player_value > dealer_value:
            return "Player wins"
        else:
            return "Dealer wins"

    def player_stand(self) -> Optional[str]:
        if self.playing:
            self.playing = False
            return self.dealer_play() 
        return None

import json
import random
from typing import List, Optional
from .card import Card

class Deck:
    def __init__(self, json_path: str) -> None:
        self.deck: List[Card] = []
        self.load_deck(json_path)

    def load_deck(self, json_path: str) -> None:
        with open(json_path, 'r') as file:
            card_data = json.load(file)
        for suit in card_data['suits']:
            for rank in card_data['ranks']:
                value = card_data['values'][rank]
                self.deck.append(Card(suit, rank, value))

    def shuffle(self) -> None:
        random.shuffle(self.deck)

    def deal(self) -> Optional[Card]:
        return self.deck.pop() if self.deck else None

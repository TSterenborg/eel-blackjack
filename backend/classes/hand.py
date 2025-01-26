from typing import List
from .card import Card

class Hand:
    def __init__(self) -> None:
        self.cards: List[Card] = []
        self.value: int = 0
        self.aces: int = 0

    def add_card(self, card: Card) -> None:
        self.cards.append(card)
        self.value += card.value
        if card.rank == "A":
            self.aces += 1

    def adjust_for_ace(self) -> None:
        while self.value > 21 and self.aces:
            self.value -= 10
            self.aces -= 1

    def __str__(self) -> str:
        return ', '.join([str(card) for card in self.cards]) + f" (Total value: {self.value})"

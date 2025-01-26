from typing import List, Dict
from .balance import Balance

class GameBalance(Balance):
    def __init__(self) -> None:
        super().__init__()
        self.game_balance: int = 0
        self.game_chips: List[Dict[str, int]] = []

    def add_game_balance(self, amount: int) -> None:
        self.game_balance += amount
    
    def subtract_game_balance(self, amount: int) -> None:
        self.game_balance -= amount

    def buy_chips(self, chip_value: int) -> bool:
        if self.balance >= chip_value:
            self.game_chips.append({'value': chip_value})
            self.subtract_balance(chip_value) 
            self.add_game_balance(chip_value)
            return True
        else:
            return False
        
    def clear_chips(self) -> None:
        self.game_chips = []
        self.game_balance = 0
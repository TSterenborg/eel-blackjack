class Card:
    def __init__(self, suit: str, rank: str, value: int) -> None:
        self.suit: str = suit
        self.rank: str = rank
        self.value: int = value
    
    def __str__(self) -> str:
        return f"{self.suit}-{self.rank}.svg"

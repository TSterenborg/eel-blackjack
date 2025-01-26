class Balance:
    def __init__(self) -> None:
        self.balance: int = 500

    def add_balance(self, amount: int) -> None:
        self.balance += amount

    def subtract_balance(self, amount: int) -> None:
        self.balance -= amount
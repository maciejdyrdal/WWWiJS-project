__all__ = ["PLAYER1", "PLAYER2", "Game"]

PLAYER1, PLAYER2 = "red", "yellow"
DIRECTIONS = ["north", "east", "south", "west"]


class Player:
    def __init__(self, column, row, direction):
        self.lives = 1
        self.column = column
        self.row = row
        self.direction = direction
        self.damage = 1

    def move(self, column, row, direction):
        if abs(self.column - column) <= 1 and abs(self.row - row) <= 1 and 0 <= column <= 3 and 0 <= row <= 4 and not ((column == 0 and row >= 3) or (column == 3 and row <= 1) or (column == 1 and row == 1) or (column == 2 and row == 3)) and direction in DIRECTIONS:
            self.column, self.row, self.direction = column, row, direction
        else:
            raise RuntimeError("Illegal move.")
        
    @property
    def position_in_front(self):
        position_in_front = None
        if self.direction == "north":
            position_in_front = (self.column, self.row + 1)
        elif self.direction == "east":
            position_in_front = (self.column + 1, self.row)
        elif self.direction == "south":
            position_in_front = (self.column, self.row - 1)
        elif self.direction == "west":
            position_in_front = (self.column - 1, self.row)

        return position_in_front
    
    def take_damage(self, damage):
        self.lives -= damage
            

class Game:
    def __init__(self):
        self.moves = []
        self.winner = None
        self.player1 = Player(1, 1, "north")
        self.player2 = Player(4, 5, "south")


    @property
    def last_player(self):
        """
        Player who played the last move.

        """
        return PLAYER1 if len(self.moves) % 2 else PLAYER2

    @property
    def last_player_won(self):
        """
        Whether the last move is winning.

        """
        if self.last_player == PLAYER1:
            return (self.player1.lives <= 0)
        elif self.last_player == PLAYER2:
            return (self.player2.lives <= 0)


    def play(self, player, column, row, direction, is_attacking=False):
        """
        Play a move in a column.

        Returns the row where the checker lands.

        Raises :exc:`RuntimeError` if the move is illegal.

        """

        if player == self.last_player:
            raise RuntimeError("It isn't your turn.")

        if player == PLAYER1 and self.player2.column == column and self.player2.row == row:
            raise RuntimeError("This slot is full.")
        
        if player == PLAYER2 and self.player1.column == column and self.player1.row == row:
            raise RuntimeError("This slot is full.")
        
        if (column == 1 and row >= 4) or (column == 4 and row <= 2) or (column == 2 and row == 2) or (column == 3 and row == 4) or column < 1 or column > 4 or row < 1 or row > 5:
            raise RuntimeError("Illegal move.")

        if direction not in DIRECTIONS:
            raise RuntimeError("Invalid direction.")
        
        if player == PLAYER1:
            if self.player1.direction == "north" and column == self.player1.column and row == self.player1.row + 1:
                self.player1.column, self.player1.row = column, row
            elif self.player1.direction == "east" and column == self.player1.column + 1 and row == self.player1.row:
                self.player1.column, self.player1.row = column, row
            elif self.player1.direction == "south" and column == self.player1.column and row == self.player1.row - 1:
                self.player1.column, self.player1.row = column, row
            elif self.player1.direction == "west" and column == self.player1.column - 1 and row == self.player1.row:
                self.player1.column, self.player1.row = column, row
            elif column == self.player1.column and row == self.player1.row:
                self.player1.column, self.player1.row = column, row
            else:
                raise RuntimeError("Can't move there mate.")

        if player == PLAYER2:
            if self.player2.direction == "north" and column == self.player2.column and row == self.player2.row + 1:
                self.player2.column, self.player2.row = column, row
            elif self.player2.direction == "east" and column == self.player2.column + 1 and row == self.player2.row:
                self.player2.column, self.player2.row = column, row
            elif self.player2.direction == "south" and column == self.player2.column and row == self.player2.row - 1:
                self.player2.column, self.player2.row = column, row
            elif self.player2.direction == "west" and column == self.player2.column - 1 and row == self.player2.row:
                self.player2.column, self.player2.row = column, row
            elif column == self.player2.column and row == self.player2.row:
                self.player2.column, self.player2.row = column, row
            else:
                raise RuntimeError("Can't move there mate.")
        
        if player == PLAYER1:
            self.player1.direction = direction

        if player == PLAYER2:
            self.player2.direction = direction

        if is_attacking:
            if player == PLAYER1 and self.player1.position_in_front == (self.player2.column, self.player2.row):
                self.player2.take_damage(self.player1.damage)
            elif player == PLAYER2 and self.player2.position_in_front == (self.player1.column, self.player1.row):
                self.player1.take_damage(self.player2.damage)

        self.moves.append((player, column, row, direction, is_attacking))

        if self.winner is None and self.last_player_won:
            self.winner = self.last_player

        return column, row, direction, is_attacking

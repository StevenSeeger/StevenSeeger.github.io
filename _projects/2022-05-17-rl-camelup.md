---
title: "Playing Camel Up with Reinforcement Learning"
permalink: /projects/rl_camelup/
---

Start Date: 17 May 2022

End Date: ???

This was a project that I started in graduate school. Unfortunately, then, my algorithm never got great at playing, the code was super janky, etc. That code can be found here: `really cool link`.

Now that I have graduated, and don't have to be up until 2 or 3 AM for several weeks debugging code, tweaking parameters, and crying, thought that revamping the whole project would be a really neat idea. Hopefully I won't regret it, but I imagine that I probably will.

## Creating the Game

In order to make it possible to have an algorithm learn to play the game, the game must exist. In code. Which... I'm not an expert coder by any means. So this process is gonna be long and hard. Filled with lots of crying, cursing and googling. Which for a person my age, seems to be just a normal day. So I will count that as a win!

### Board

Creating a board for camel up seems like the easiest place to start. Its actually a fairly simple board (because it a board game for children), so that hopefully means it will be easy to code. There are two components of the board that need to be tracked. The first being the board itself, and the second of the stable of the camels and if they have left or not yet. The reason why the second thing is important, instead of allowing all the camels to start on a start place is that they have different move mechanics when on the actual board. When on the actual board, camels can stack on top of one another and move with other pieces. The other thing we want to track on the board is if any player has left a trap card on the board.

The code for that is as follows (where `CAMEL_COLORS` is defined as `['blue', 'green', 'orange', 'yellow', 'white']`):

```python
from constants import CAMEL_COLORS

class Board:
    """Object that creates a camel up board"""

    def __init__(self) -> None:
        self.board = self._create_board_dictionary()
        self.camel_starting_hub = CAMEL_COLORS.copy()

    def _create_board_dictionary(self) -> dict:
        """Create a board of 17 spaces, where area 16 is past the finish line"""
        board_dict = dict()
        for i in range(0, 18):
            board_dict[i] = []
        
        return board_dict

    def _print_board(self) -> None:
        """Print the board for debugging purposes"""
        print(self.camel_starting_hub)
        print(self.board)

    def roll_dice(self) -> None:
        """Allows player to roll dice"""
```
from dataclasses import dataclass
from typing import List


@dataclass
class Card:
    value: int
    revealed: bool


@dataclass
class Player:
    name: str
    chips: int
    cards: List[Card]  # algo-ordered


@dataclass
class State:
    player_turn: str  # which player causes the state change
    players: List[Player]


class Action:
    pass


class StayAction(Action):
    """ only valid if the player has at least attacked successfully once on the player's turn """


@dataclass
class AttackAction(Action):
    target_player: str
    card_index: int  # the n'th rank (0 based, 0 rank is the smallest card) card of the target player
    guess: int


""" API to be implemented by user """
"""
def state_stream(state: State):
    # this function is called when the game state is changed
    # "state" is the newset state

def action():
    # called when the user has to do an action 
    # (all previous states are accessible by the "state_stream" callback)

    # return: an instance of <Action>
"""



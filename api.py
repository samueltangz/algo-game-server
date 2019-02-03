from dataclasses import dataclass
from typing import List
from enum import Enum


class Color(Enum):
    WHITE = 0
    BLACK = 1


@dataclass
class Card:
    value: int
    color: Color
    revealed: bool


@dataclass
class Player:
    name: str
    chips: int
    cards: List[Card]  # algo-ordered


class Action:
    pass


@dataclass
class State:
    player_turn: str  # which player causes the state change
    players: List[Player]
    action: Action  # action taken by that player


class StayAction(Action):
    """ only valid if the player has at least attacked successfully once on the player's turn """


@dataclass
class AttackAction(Action):
    target_player: str
    card_index: int  # the n'th rank (0 based, 0 rank is the smallest card) card of the target player
    guess: int
    card_to_use: Card  # must use the new card added or if no card is added, user has to choose 1 of his unrevealed card


""" API to be implemented by user """
"""
def state_stream(state: State):
    # this function is called when the game state is changed
    # "state" is the newset state

def action():
    # called when the user has to do an action 
    # (all previous states are accessible by the "state_stream" callback)
    # Note: how many cards on the deck remain is implicit (user has to keep track of that)

    # return: an instance of <Action>
"""



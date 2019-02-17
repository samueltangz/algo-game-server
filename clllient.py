import time
import requests
import json
import random
from z3 import *

def get_val(val, col):
    if col == 'black':
        return 2 * val
    else:
        return 2 * val + 1

DOMAIN = 'http://0.0.0.0:14938'

def me():
    global TOKEN
    r = requests.get(DOMAIN + '/users/me', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def top10():
    global TOKEN
    r = requests.get(DOMAIN + '/users/top10')
    return r.status_code, r.text

def create_room():
    global TOKEN
    r = requests.post(DOMAIN + '/rooms', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def join_room(room_id):
    global TOKEN
    r = requests.post(DOMAIN + '/rooms/join/' + room_id, headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def leave_room():
    global TOKEN
    r = requests.delete(DOMAIN + '/rooms/join', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def ready():
    global TOKEN
    r = requests.put(DOMAIN + '/rooms/ready', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def unready():
    global TOKEN
    r = requests.delete(DOMAIN + '/rooms/ready', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def pick(card_id):
    global TOKEN
    r = requests.post(DOMAIN + '/games/action/pick', headers = {
        'authorization': 'Bearer %s' % TOKEN
    }, json={
        'card_id': int(card_id)
    })
    return r.status_code, r.text

def attack(card_id, value):
    global TOKEN
    r = requests.post(DOMAIN + '/games/action/attack', headers = {
        'authorization': 'Bearer %s' % TOKEN
    }, json={
        'card_id': int(card_id),
        'value': int(value)
    })
    return r.status_code, r.text

def keep():
    global TOKEN
    r = requests.post(DOMAIN + '/games/action/keep', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def get_board():
    global TOKEN
    r = requests.get(DOMAIN + '/games', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

TOKEN = raw_input('TOKEN > ').strip()

while True:
    time.sleep(5)
    _, me_obj = me()
    me_obj = json.loads(me_obj)['user']
    if 'roomId' not in me_obj:
        print 'Create room'
        create_room()
    elif 'gameId' not in me_obj:
        # print 'Ready'
        ready()
    else:
        _, board_obj = get_board()
        board_obj = json.loads(board_obj)['boardState']
        if board_obj['players'][board_obj['metadata']['currentTurn'] - 1] != me_obj['id']:
            continue
        print 'My turn!'
        # Game
        cards = []
        guess_id = []
        s = Solver()
        for i in range(24):
            cards.append(Int('card_%d' % i))
            s.add(0 <= cards[i], cards[i] <= 23)
            s.add(Distinct(cards))
        for hand in board_obj['hands']:
            for card in hand:
                if 'value' in card:
                    s.add(cards[card['id'] - board_obj['id'] * 24 + 23] == get_val(card['value'], card['color']))
                elif card['color'] == 'black':
                    s.add(cards[card['id'] - board_obj['id'] * 24 + 23] % 2 == 0)
                    guess_id.append(card['id'] - board_obj['id'] * 24 + 23)
                else:
                    s.add(cards[card['id'] - board_obj['id'] * 24 + 23] % 2 == 1)
                    guess_id.append(card['id'] - board_obj['id'] * 24 + 23)
            for ind in range(1, len(hand)):
                card = hand[ind]
                card_prev = hand[ind - 1]
                s.add(cards[card_prev['id'] - board_obj['id'] * 24 + 23] < cards[card['id'] - board_obj['id'] * 24 + 23])
        assert s.check() == sat
        m = s.model()
        if random.randint(0, 15) >= board_obj['metadata']['attackCount']:
            guess = guess_id[random.randint(0, len(guess_id) - 1)]
            print 'Guessing card #%d to be %d' % (guess, m[cards[guess]].as_long() / 2)
            attack(guess + board_obj['id'] * 24 - 23, m[cards[guess]].as_long() / 2)
        else:
            keep()
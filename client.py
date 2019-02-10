import time
import requests

DOMAIN = 'http://0.0.0.0:14938'
TOKEN = 'xCYZnHjSfm62W5Mg9XfPt2KCucwlfexXIwyqZNkDZ-8'
TOKEN = 'iAUAKT30rIJvp4lVcbfEhHaZOsIX5oITKHVSXXSsaYM'

def me():
    r = requests.get(DOMAIN + '/users/me', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def top10():
    r = requests.get(DOMAIN + '/users/top10')
    return r.status_code, r.text

def create_room():
    r = requests.post(DOMAIN + '/rooms', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def join_room(room_id):
    r = requests.post(DOMAIN + '/rooms/join/' + room_id, headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def leave_room():
    r = requests.delete(DOMAIN + '/rooms/join', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def ready():
    r = requests.put(DOMAIN + '/rooms/ready', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def unready():
    r = requests.delete(DOMAIN + '/rooms/ready', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def pick(game_id, card_id):
    r = requests.post(DOMAIN + '/games/action/pick', headers = {
        'authorization': 'Bearer %s' % TOKEN
    }, json={
        'game_id': int(game_id),
        'card_id': int(card_id)
    })
    return r.status_code, r.text

def attack(game_id, card_id, value):
    r = requests.post(DOMAIN + '/games/action/attack', headers = {
        'authorization': 'Bearer %s' % TOKEN
    }, json={
        'game_id': int(game_id),
        'card_id': int(card_id),
        'value': int(value)
    })
    return r.status_code, r.text

def keep(game_id):
    r = requests.post(DOMAIN + '/games/action/keep', headers = {
        'authorization': 'Bearer %s' % TOKEN
    }, json={
        'game_id': int(game_id)
    })
    return r.status_code, r.text

while True:
    t = int(raw_input('TKN > ').strip())
    if t == 0:
        TOKEN = 'xCYZnHjSfm62W5Mg9XfPt2KCucwlfexXIwyqZNkDZ-8'
    elif t == 1:
        TOKEN = 'iAUAKT30rIJvp4lVcbfEhHaZOsIX5oITKHVSXXSsaYM'
    else:
        TOKEN = 'pc5LQulClke89o_E0Wyu6-uQzfx0eMpHuuSv4h4xTg4'
    r = raw_input('ACT > ').strip()
    if r == 'me':
        print me()
    elif r == 'top10':
        print top10()
    elif r == 'create_room':
        print create_room()
    elif r == 'join_room':
        room_id = raw_input('RID > ')
        print join_room(room_id)
    elif r == 'leave_room':
        print leave_room()
    elif r == 'ready':
        print ready()
    elif r == 'unready':
        print unready()
    elif r == 'pick':
        game_id = raw_input('GID > ')
        card_id = raw_input('CID > ')
        print pick(game_id, card_id)
    elif r == 'attack':
        game_id = raw_input('GID > ')
        card_id = raw_input('CID > ')
        value = raw_input('VAL > ')
        print attack(game_id, card_id, value)
    elif r == 'keep':
        game_id = raw_input('GID > ')
        print keep(game_id)
import time
import requests

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

TOKEN = raw_input('TOKEN > ').strip()
print me()

while True:
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
        card_id = raw_input('CID > ')
        print pick(card_id)
    elif r == 'attack':
        card_id = raw_input('CID > ')
        value = raw_input('VAL > ')
        print attack(card_id, value)
    elif r == 'keep':
        print keep()
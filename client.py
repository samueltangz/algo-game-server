import time
import requests

DOMAIN = 'http://0.0.0.0:14938'
TOKEN = 'xCYZnHjSfm62W5Mg9XfPt2KCucwlfexXIwyqZNkDZ-8'

def me():
    r = requests.get(DOMAIN + '/users/me', headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def top10():
    r = requests.get(DOMAIN + '/users/top10')
    return r.status_code, r.text

def join_game(game_id):
    r = requests.get(DOMAIN + '/games/%d' % game_id, json = {
        'action': 'join'
    }, headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def leave_game():
    r = requests.get(DOMAIN + '/games', json = {
        'action': 'leave'
    }, headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def ready_game():
    r = requests.get(DOMAIN + '/games', json = {
        'action': 'ready'
    }, headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

def unready_game():
    r = requests.get(DOMAIN + '/games', json = {
        'action': 'unready'
    }, headers = {
        'authorization': 'Bearer %s' % TOKEN
    })
    return r.status_code, r.text

print me()
print top10()
print join_game(1)
time.sleep(3)
print ready_game()
time.sleep(3)
print unready_game()
time.sleep(3)
print leave_game()

# base64.urlsafe_b64encode(os.urandom(32))[:-1]
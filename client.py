import requests

DOMAIN = 'http://0.0.0.0:3000'

def me(token):
    r = requests.get(DOMAIN + '/users/me', headers = {
        'authorization': 'Bearer %s' % token
    })
    return r.text

print me('testing')
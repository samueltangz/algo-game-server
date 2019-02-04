import requests

DOMAIN = 'http://0.0.0.0:14938'

def me(token):
    r = requests.get(DOMAIN + '/users/me', headers = {
        'authorization': 'Bearer %s' % token
    })
    return r.text

def top10():
    r = requests.get(DOMAIN + '/users/top10')
    return r.text

print me('xCYZnHjSfm62W5Mg9XfPt2KCucwlfexXIwyqZNkDZ-8')
print top10()

# base64.urlsafe_b64encode(os.urandom(32))[:-1]
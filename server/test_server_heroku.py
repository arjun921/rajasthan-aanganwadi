import requests


root = 'https://rajasthan-aanganwadi.herokuapp.com'


def test_user_login_functional():
    data = {'email': 'a@g.c',
            'pwd': 'hash',
            'token': 'a'*50}
    url = root + '/user/login'
    resp = requests.post(url, json=data)
    assert resp.status_code == 200, resp.text

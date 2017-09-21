import os
import requests


if os.environ.get('TEST_HEROKU'):
    root = 'https://rajasthan-aanganwadi.herokuapp.com'
else:
    root = 'http://localhost:8000'


# ################################### /user/create
def test_user_create_works():
    data = {
            'email': 'e@mail2',
            'pwd': 'hash',
            'name': 'dummy',
            'address': 'addum',
            'mobile': '1234567890'
            }
    url = root + '/user/create'
    resp = requests.post(url, json=data)
    assert resp.status_code == 200, resp.text


def test_user_create_fails_on_non_json():
    data = {
            'email': 'e@mail',
            'pwd': 'hash',
            'name': 'dummy',
            'address': 'addum',
            'mobile': '1234567890'
            }
    url = root + '/user/create'
    resp = requests.post(url, data=data)
    assert resp.status_code == 422, resp.text


def test_user_create_fails_for_missing_keys():
    data = {
            'email': 'e@mail',
            'pwd': 'hash',
            'name': 'dummy',
            'address': 'addum',
            'mobile': '1234567890'
            }
    for key in sorted(list(data.keys())):
        d = dict(data)
        d.pop(key)
        url = root + '/user/create'
        resp = requests.post(url, json=d)
        assert resp.status_code == 422, resp.text


def test_user_create_fails_for_duplicate_email():
    data = {
            'email': 'e@mail',
            'pwd': 'hash',
            'name': 'dummy',
            'address': 'addum',
            'mobile': '1234567890'
            }
    url = root + '/user/create'
    resp = requests.post(url, json=data)  # send this once to ensure
    resp = requests.post(url, json=data)  # send this once to fail
    assert resp.status_code == 422, resp.text


# ################################### /user/login
def test_user_login_works():
    data = {'email': 'e@mail2',
            'pwd': 'hash',
            'token': 'a'*100}
    url = root + '/user/login'
    resp = requests.post(url, json=data)
    assert resp.status_code == 200, resp.text


def test_user_login_fails_for_unreadable_json():
    data = {'email': 'e@mail2',
            'pwd': 'hash',
            'token': 'a'*100}
    url = root + '/user/login'
    resp = requests.post(url, data=data)
    assert resp.status_code == 422, resp.text


def test_user_login_fails_for_missing_keys():
    data = {'email': 'e@mail',
            'pwd': 'hash',
            'token': 'a'*100}
    for key in sorted(list(data.keys())):
        d = dict(data)
        d.pop(key)
        url = root + '/user/login'
        resp = requests.post(url, json=d)
        assert resp.status_code == 422, resp.text


def test_user_login_fails_for_wrong_token_length():
    data = {'email': 'e@mail',
            'pwd': 'hash',
            'token': 'a'*10}
    url = root + '/user/login'
    resp = requests.post(url, json=data)
    assert resp.status_code == 422, resp.text


def test_user_login_fails_for_repeated_token():
    data = {'email': 'e@mail',
            'pwd': 'hash',
            'token': 'a'*100}
    url = root + '/user/login'
    resp = requests.post(url, json=data)  # once to ensure this happens
    resp = requests.post(url, json=data)  # once to ensure this fails
    assert resp.status_code == 422, resp.text
    assert resp.text == 'regenerate token', resp.text


# ################################### /user/logout
def test_user_logout_works():
    data = {'token': 'a'*100}
    url = root + '/user/logout'
    resp = requests.post(url, json=data)
    assert resp.status_code == 200, resp.text


def test_user_logout_fails_for_non_json():
    data = {'token': 'a'*100}
    url = root + '/user/logout'
    resp = requests.post(url, data=data)
    assert resp.status_code == 422, resp.text


def test_user_logout_fails_for_missing_keys():
    data = {'token': 'a'*100}
    url = root + '/user/logout'
    for key in sorted(list(data.keys())):
        d = dict(data)
        d.pop(key)
        resp = requests.post(url, json=d)
        assert resp.status_code == 422, resp.text

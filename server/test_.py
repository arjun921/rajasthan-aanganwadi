import os
import pytest
import requests


if os.environ.get('TEST_HEROKU'):
    root = 'https://rajasthan-aanganwadi.herokuapp.com'
else:
    root = 'http://localhost:8000'


def point(url):
    return root + url


active_urls = ['/user/login',
               '/user/logout',
               '/user/create',
               '/user/delete',
               # '/content/',
               # '/content/create',
               # '/content/list',
               # '/content/access',
               # '/content/remove',
               # '/content/activate',
               # '/content/deactivate',
               # '/form/',
               # '/form/list',
               # '/form/create',
               # '/form/submit',
               # '/form/delete',
               # '/form/activate'
               ]


@pytest.fixture
def user():
    # create a user
    data = {'email': 'a@g.c',
            'address': 'a',
            'name': 'a',
            'mobile': '1234567890',
            'pwd': 'hash'}
    resp = requests.post(point('/user/create'), json=data)
    assert resp.status_code == 200, resp.text
    yield data  # PERFORM TEST
    data = {'email': 'a@g.c', 'token': 'a'*100}
    resp = requests.post(point('/user/delete'), json=data)


@pytest.fixture
def loggeduser(user):
    token = 'a'*100
    d = {'email': user['email'], 'pwd': user['pwd'], 'token': token}
    resp = requests.post(point('/user/login'), json=d)
    assert resp.status_code == 200, resp.text
    yield d  # do tests
    d = {'token': token}
    resp = requests.post(point('/user/logout'), json=d)


# TESTS---------------------------------------------------------------
def test_user_delete_works():
    # create a user
    data = {'email': 'a@g.c',
            'address': 'a',
            'name': 'a',
            'mobile': '1234567890',
            'pwd': 'hash'}
    resp = requests.post(point('/user/create'), json=data)
    assert resp.status_code == 200, resp.text
    # remove
    data = {'email': 'a@g.c', 'token': 'a'*100}
    resp = requests.post(point('/user/delete'), json=data)
    assert resp.status_code == 200, resp.text


def test_user_create_works():
    # create a user
    data = {'email': 'a@g.c',
            'address': 'a',
            'name': 'a',
            'mobile': '1234567890',
            'pwd': 'hash'}
    resp = requests.post(point('/user/create'), json=data)
    assert resp.status_code == 200, resp.text
    # remove
    data = {'email': 'a@g.c', 'token': 'a'*100}
    resp = requests.post(point('/user/delete'), json=data)


def test_user_logout_works(loggeduser):
    d = {'token': loggeduser['token']}
    resp = requests.post(point('/user/logout'), json=d)
    assert resp.status_code == 200, resp.text


def test_user_login_works(user):
    token = 'a'*100
    d = {'email': user['email'], 'pwd': user['pwd'], 'token': token}
    resp = requests.post(point('/user/login'), json=d)
    assert resp.status_code == 200, resp.text
    d = {'token': token}
    resp = requests.post(point('/user/logout'), json=d)
    assert resp.status_code == 200, resp.text


# --------------------------------------------------common tests

def test_non_json_failure_on_active_url_list():
    for url in active_urls:
        resp = requests.post(point(url))
        assert resp.status_code == 422, resp.text
        resp = requests.post(point(url), data={})
        assert resp.status_code == 422, resp.text


def test_options_on_active_urls():
    for url in active_urls:
        resp = requests.options(point(url))
        assert resp.status_code == 200, resp.text
        assert 'Access-Control-Allow-Origin' in resp.headers
        assert 'Access-Control-Allow-Methods' in resp.headers
        assert 'Access-Control-Allow-Headers' in resp.headers

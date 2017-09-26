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
               '/form',
               '/form/list',
               '/form/create',
               '/form/submit',
               '/form/delete',
               ]


@pytest.fixture
def user(admin):
    # create a user
    data = {'email': 'a@g.c',
            'address': 'a',
            'name': 'a',
            'mobile': '1234567890',
            'pwd': 'hash',
            "token": admin['token']
            }
    resp = requests.post(point('/user/create'), json=data)
    assert resp.status_code == 200, resp.text
    yield data  # PERFORM TEST
    data = {'email': 'a@g.c', 'token': admin['token']}
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


@pytest.fixture
def admin():
    d = {'email': 'admin@g.c', 'pwd': 'hash', 'token': '1'*100}
    resp = requests.post(point('/user/login'), json=d)
    assert resp.status_code == 200, resp.text
    yield d
    d = {'token': '1'*100}
    resp = requests.post(point('/user/logout'), json=d)


@pytest.fixture
def form(admin):
    data = {'formid': 'f1',
            'title': 'form1',
            'fields': [
                        {'id': '1',
                         'label': 'name',
                         'kind': 'text', 'misc': []},
                        {'id': '2',
                         'label': 'name',
                         'kind': 'text', 'misc': []},
                        ],
            "token": admin['token']
            }
    resp = requests.post(point('/form/create'), json=data)
    assert resp.status_code == 200, resp.text
    yield data
    d = {'token': data['token'], 'formid': data['formid']}
    resp = requests.post(point('/form/delete'), json=d)


# TESTS---------------------------------------------------------------
def test_form_submit_fails_for_duplicate_items(form, loggeduser):
    data = {'token': loggeduser['token'],
            'formid': form['formid'],
            'data': [
                {'id': '1', 'value': 'a'},
                {'id': '1', 'value': 'a'}
                ]
            }
    resp = requests.post(point('/form/submit'), json=data)
    assert resp.status_code == 422, resp.text


def test_form_submit_works(form, loggeduser):
    data = {'token': loggeduser['token'],
            'formid': form['formid'],
            'data': [
                {'id': '1', 'value': 'a'},
                {'id': '2', 'value': 'a'}
                ]
            }
    resp = requests.post(point('/form/submit'), json=data)
    assert resp.status_code == 200, resp.text


def test_form_delete_fails_for_non_admin(form, loggeduser):
    d = {'token': loggeduser['token'], 'formid': form['formid']}
    resp = requests.post(point('/form/delete'), json=d)
    assert resp.status_code == 403, resp.text


def test_form_delete_works(form):
    d = {'token': form['token'], 'formid': form['formid']}
    resp = requests.post(point('/form/delete'), json=d)
    assert resp.status_code == 200, resp.text


def test_form_create_works(admin):
    data = {'formid': 'f1',
            'title': 'form1',
            'fields': [
                        {'id': '1',
                         'label': 'name',
                         'kind': 'text', 'misc': []},
                        {'id': '2',
                         'label': 'name',
                         'kind': 'text', 'misc': []},
                        ],
            "token": admin['token']
            }
    resp = requests.post(point('/form/create'), json=data)
    assert resp.status_code == 200, resp.text


def test_form_create_fails_for_non_admin(loggeduser):
    data = {'formid': 'f1',
            'title': 'form1',
            'fields': [
                        {'id': '1',
                         'label': 'name',
                         'kind': 'text', 'misc': []},
                        {'id': '2',
                         'label': 'name',
                         'kind': 'text', 'misc': []},
                        ],
            "token": loggeduser['token']
            }
    resp = requests.post(point('/form/create'), json=data)
    assert resp.status_code == 403, resp.text


def test_form_list_fails_for_unlogged_user():
    data = {'token': 'b'*100}
    resp = requests.post(point('/form/list'), json=data)
    assert resp.status_code == 422, resp.text


def test_form_list_works(loggeduser):
    data = {'token': loggeduser['token']}
    resp = requests.post(point('/form/list'), json=data)
    assert resp.status_code == 200, resp.text


def test_user_delete_fails_for_non_admin(admin, loggeduser):
    # remove
    data = {'email': loggeduser['email'], 'token': loggeduser['token']}
    resp = requests.post(point('/user/delete'), json=data)
    assert resp.status_code == 403, resp.text


def test_user_delete_works(admin, user):
    # remove
    data = {'email': user['email'], 'token': admin['token']}
    resp = requests.post(point('/user/delete'), json=data)
    assert resp.status_code == 200, resp.text


def test_user_create_works(admin):
    # create a user
    data = {'email': 'a@g.c',
            'address': 'a',
            'name': 'a',
            'mobile': '1234567890',
            'pwd': 'hash',
            'token': admin['token']}
    resp = requests.post(point('/user/create'), json=data)
    assert resp.status_code == 200, resp.text
    # remove
    data = {'email': 'a@g.c', 'token': admin['token']}
    resp = requests.post(point('/user/delete'), json=data)


def test_user_create_fails_for_non_admin(admin, loggeduser):
    # create a user
    data = {'email': 'a@g.c2',
            'address': 'a',
            'name': 'a',
            'mobile': '1234567890',
            'pwd': 'hash',
            'token': loggeduser['token']}
    resp = requests.post(point('/user/create'), json=data)
    assert resp.status_code == 403, resp.text


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

import os
import pytest
import filecmp
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
               '/content/create',
               '/content/list',
               '/content',
               '/content/delete',
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
    d = {'email': 'arjoonn.94@gmail.com', 'pwd': 'hash', 'token': '1'*100}
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


@pytest.fixture
def resource(tmpdir, admin):
    p = tmpdir.mkdir("sub").join("hello.txt")
    p.write("content")
    files = {'upload': p.open('rb')}
    values = {'token': admin['token']}
    r = requests.post(point('/content/create'), files=files, data=values)
    assert r.status_code == 200, r.text
    yield r.text, p.open('rb'), admin['token']
    # TODO: remove resource
    data = {'token': admin['token'], 'fname': r.text}
    r = requests.post(point('/content/delete'), json=data)


# TESTS---------------------------------------------------------------
def test_resource_retreival_fails_for_unlogged_user(resource):
    fname, f, tok = resource
    tok = tok[1:] + 'a'
    data = {'token': tok, 'fname': fname}
    r = requests.post(point('/content'), json=data)
    assert r.status_code == 403, r.text


def test_resource_retreival_works(resource, loggeduser):
    fname, f, tok = resource
    tok = loggeduser['token']
    data = {'token': tok, 'fname': fname}
    r = requests.post(point('/content'), json=data)
    assert r.status_code == 200, r.text
    data = r.content.decode()
    known = f.read().decode()
    assert isinstance(known, str), type(known)


def test_resource_list_lists_resources_when_present(resource, loggeduser):
    fname, f, tok = resource
    data = {'token': loggeduser['token']}
    r = requests.post(point('/content/list'), json=data)
    assert r.status_code == 200, r.text
    assert fname in [i['fname'] for i in r.json()['contents']]
    data = {'token': tok}
    r = requests.post(point('/content/list'), json=data)
    assert r.status_code == 200, r.text
    assert fname in [i['fname'] for i in r.json()['contents']]


def test_resource_delete_fails_for_non_admin(resource, loggeduser):
    fname, f, tok = resource
    data = {'token': loggeduser['token'], 'fname': fname}
    r = requests.post(point('/content/delete'), json=data)
    assert r.status_code == 403, r.text


def test_resource_delete_works(resource):
    fname, f, tok = resource
    data = {'token': tok, 'fname': fname}
    r = requests.post(point('/content/delete'), json=data)
    assert r.status_code == 200, r.text


def test_resource_create_fails_for_invalid_token(resource):
    fname, f, tok = resource
    files = {'upload': f}
    values = {'token': tok[1:]+'a'}
    r = requests.post(point('/content/create'), files=files, data=values)
    assert r.status_code == 403, r.text
    values = {'token': tok[1:]}
    r = requests.post(point('/content/create'), files=files, data=values)
    assert r.status_code == 422, r.text


def test_resource_create_fails_for_non_admin(resource, loggeduser):
    fname, f, tok = resource
    tok = loggeduser['token']
    files = {'upload': f}
    values = {'token': tok}
    r = requests.post(point('/content/create'), files=files, data=values)
    assert r.status_code == 403, r.text


def test_resource_create_works(resource):
    fname, f, tok = resource
    files = {'upload': f}
    values = {'token': tok}
    r = requests.post(point('/content/create'), files=files, data=values)
    assert r.status_code == 200, r.text


def test_form_retreival_fails_for_unlogged_user(form, loggeduser):
    data = {'token': loggeduser['token'][1:]+'1', 'formid': form['formid']}
    resp = requests.post(point('/form'), json=data)
    assert resp.status_code == 403, resp.text


def test_form_retreival_fails_for_invalid_formid(form, loggeduser):
    data = {'token': loggeduser['token'], 'formid': form['formid']+'salt'}
    resp = requests.post(point('/form'), json=data)
    assert resp.status_code == 404, resp.text


def test_form_retreival_works(form, loggeduser):
    data = {'token': loggeduser['token'], 'formid': form['formid']}
    resp = requests.post(point('/form'), json=data)
    assert resp.status_code == 200, resp.text


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
    assert resp.status_code == 403, resp.text


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


def test_dummy_file_retreival(loggeduser):
    token = loggeduser['token']
    r = requests.post(point('/content/list'),
                      json={'token': token})
    assert r.status_code == 200, r.text
    for data in r.json()['contents']:
        fname = data['fname']
        json = {'token': token, 'fname': fname}
        r = requests.post(point('/content'), json=json)
        r = requests.get(point(r.json()['url']))
        with open(fname, 'wb') as handle:
            for block in r.iter_content(1024):
                handle.write(block)
        assert filecmp.cmp(fname, 'UPLOAD/'+fname)
        os.remove(fname)


def test_dummy_file_retreival_fails_for_dual_use_of_link(loggeduser):
    token = loggeduser['token']
    r = requests.post(point('/content/list'),
                      json={'token': token})
    assert r.status_code == 200, r.text
    for data in r.json()['contents']:
        fname = data['fname']
        json = {'token': token, 'fname': fname}
        r1 = requests.post(point('/content'), json=json)
        r = requests.get(point(r1.json()['url']))
        with open(fname, 'wb') as handle:
            for block in r.iter_content(1024):
                handle.write(block)
        assert filecmp.cmp(fname, 'UPLOAD/'+fname)
        os.remove(fname)
        r = requests.get(point(r1.json()['url']))
        assert r.status_code == 404


def test_cors_on_active_urls():
    for url in active_urls:
        # for OPTIONS
        resp = requests.options(point(url))
        data = (url, resp.status_code, resp.text)
        assert resp.status_code == 200, data
        assert 'Access-Control-Allow-Origin' in resp.headers, data
        assert resp.headers['Access-Control-Allow-Origin'] == '*', data
        assert 'Access-Control-Allow-Methods' in resp.headers, data
        assert resp.headers['Access-Control-Allow-Methods'] == 'POST, OPTIONS'
        assert 'Access-Control-Allow-Headers' in resp.headers, data
        # for POST
        resp = requests.post(point(url))
        data = (url, resp.status_code, resp.text)
        assert 'Access-Control-Allow-Origin' in resp.headers, data
        assert resp.headers['Access-Control-Allow-Origin'] == '*', data
        assert 'Access-Control-Allow-Methods' in resp.headers, data
        assert resp.headers['Access-Control-Allow-Methods'] == 'POST, OPTIONS'
        assert 'Access-Control-Allow-Headers' in resp.headers, data

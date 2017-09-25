import os
import requests


if os.environ.get('TEST_HEROKU'):
    root = 'https://rajasthan-aanganwadi.herokuapp.com'
else:
    root = 'http://localhost:8000'


testcount = '0'
# TODO: Use fixtures to remove the need to testcount


# ################################### /form/list
def test_form_url_fails_for_non_existant_form_id():
    global testcount
    testcount = str(int(testcount) + 1)
    token = (testcount*100)[:100]
    data = {'token': token, 'formid': 'dummy'}
    url = root + '/form'
    resp = requests.post(url, json=data)
    assert resp.status_code == 404, resp.text


def test_form_url_fails_for_missing_keys():
    global testcount
    testcount = str(int(testcount) + 1)
    token = (testcount*100)[:100]
    data = {'token': token, 'formid': 'dummy'}
    url = root + '/form'
    for key in list(data.keys()):
        d = dict(data)
        d.pop(key)
        resp = requests.post(url, json=d)
        assert resp.status_code == 422, resp.text


def test_form_url_fails_for_non_json():
    global testcount
    testcount = str(int(testcount) + 1)
    token = (testcount*100)[:100]
    data = {'token': token}
    url = root + '/form'
    resp = requests.post(url, data=data)
    assert resp.status_code == 422, resp.text


def test_form_url_fails_for_missing_token():
    global testcount
    testcount = str(int(testcount) + 1)
    data = {}
    url = root + '/form'
    resp = requests.post(url, json=data)
    assert resp.status_code == 422, resp.text


def test_form_list_works():
    global testcount
    testcount = str(int(testcount) + 1)
    token = (testcount*100)[:100]
    data = {'token': token}
    url = root + '/form/list'
    resp = requests.post(url, json=data)
    assert resp.status_code == 200, resp.text


def test_form_list_fails_for_non_json():
    global testcount
    testcount = str(int(testcount) + 1)
    token = (testcount*100)[:100]
    data = {'token': token}
    url = root + '/form/list'
    resp = requests.post(url, data=data)
    assert resp.status_code == 422, resp.text


def test_form_list_fails_for_missing_token():
    global testcount
    testcount = str(int(testcount) + 1)
    data = {}
    url = root + '/form/list'
    resp = requests.post(url, json=data)
    assert resp.status_code == 422, resp.text


def test_form_list_fails_for_invalid_token_len():
    global testcount
    testcount = str(int(testcount) + 1)
    token = (testcount*100)[:99]
    data = {'token': token}
    url = root + '/form/list'
    resp = requests.post(url, data=data)
    assert resp.status_code == 422, resp.text
    token = (testcount*101)[:101]
    data = {'token': token}
    url = root + '/form/list'
    resp = requests.post(url, data=data)
    assert resp.status_code == 422, resp.text


def _test_form_list_fails_for_invalid_user():
    global testcount
    testcount = str(int(testcount) + 1)
    assert False, 'NOT IMPLEMENTED'


def _test_form_list_fails_for_invalid_token():
    global testcount
    testcount = str(int(testcount) + 1)
    token = (testcount * 100)[:100]
    data = {'token': token}
    url = root + '/form/list'
    resp = requests.post(url, json=data)
    assert resp.status_code == 403, resp.text


def _test_form_create_works():
    global testcount
    testcount = str(int(testcount) + 1)
    data = {
            'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'name': 'dummy',
            'address': 'addum',
            'mobile': '1234567890'
            }
    url = root + '/user/create'
    resp = requests.post(url, json=data)  # create a user
    assert resp.status_code == 200, "user creation not working"
    # --------------login
    token = (testcount * 100)[:100]
    data = {'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'token': token}
    url = root + '/user/login'
    resp = requests.post(url, json=data)
    assert resp.status_code == 200, "User login not working"
    # --------------test for form listing
    data = {'token': token}
    url = root + '/form/list'
    resp = requests.post(url, json=data)
    assert resp.status_code == 200, resp.text


# ################################### /user/create
def test_user_create_works():
    global testcount
    testcount = str(int(testcount) + 1)
    data = {
            'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'name': 'dummy',
            'address': 'addum',
            'mobile': '1234567890'
            }
    url = root + '/user/create'
    resp = requests.post(url, json=data)
    assert resp.status_code == 200, resp.text


def test_user_create_fails_on_non_json():
    global testcount
    testcount = str(int(testcount) + 1)
    data = {
            'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'name': 'dummy',
            'address': 'addum',
            'mobile': '1234567890'
            }
    url = root + '/user/create'
    resp = requests.post(url, data=data)
    assert resp.status_code == 422, resp.text


def test_user_create_fails_for_missing_keys():
    global testcount
    testcount = str(int(testcount) + 1)
    data = {
            'email': 'e@mail'+testcount,
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
    global testcount
    testcount = str(int(testcount) + 1)
    data = {
            'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'name': 'dummy',
            'address': 'addum',
            'mobile': '1234567890'
            }
    url = root + '/user/create'
    resp = requests.post(url, json=data)  # send this once to ensure
    resp2 = requests.post(url, json=data)  # send this once to fail
    assert resp2.status_code == 422, (resp.text, resp2.text)


# ################################### /user/login
def test_user_login_works():
    global testcount
    testcount = str(int(testcount) + 1)
    # ----- create user
    data = {
            'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'name': 'dummy',
            'address': 'addum',
            'mobile': '1234567890'
            }
    url = root + '/user/create'
    resp = requests.post(url, json=data)  # send this once to ensure
    # ----------login
    data = {'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'token': 'a'*100}
    url = root + '/user/login'
    resp = requests.post(url, json=data)
    assert resp.status_code == 200, resp.text


def test_user_login_fails_for_unreadable_json():
    global testcount
    testcount = str(int(testcount) + 1)
    data = {'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'token': 'a'*100}
    url = root + '/user/login'
    resp = requests.post(url, data=data)
    assert resp.status_code == 422, resp.text


def test_user_login_fails_for_missing_keys():
    global testcount
    testcount = str(int(testcount) + 1)
    data = {'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'token': 'a'*100}
    for key in sorted(list(data.keys())):
        d = dict(data)
        d.pop(key)
        url = root + '/user/login'
        resp = requests.post(url, json=d)
        assert resp.status_code == 422, resp.text


def test_user_login_fails_for_wrong_token_length():
    global testcount
    testcount = str(int(testcount) + 1)
    data = {'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'token': 'a'*10}
    url = root + '/user/login'
    resp = requests.post(url, json=data)
    assert resp.status_code == 422, resp.text


def test_user_login_fails_for_repeated_token():
    global testcount
    testcount = str(int(testcount) + 1)
    data = {
            'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'name': 'dummy',
            'address': 'addum',
            'mobile': '1234567890'
            }
    url = root + '/user/create'
    resp = requests.post(url, json=data)
    assert resp.status_code == 200, resp.text
    data = {'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'token': 'a'*100}
    url = root + '/user/login'
    resp = requests.post(url, json=data)  # once to ensure this happens
    resp2 = requests.post(url, json=data)  # once to ensure this fails
    assert resp2.status_code == 422, (resp.text, resp2.text)


# ################################### /user/logout
def test_user_logout_works():
    global testcount
    testcount = str(int(testcount) + 1)
    # -----create
    data = {
            'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'name': 'dummy',
            'address': 'addum',
            'mobile': '1234567890'
            }
    url = root + '/user/create'
    resp = requests.post(url, json=data)
    assert resp.status_code == 200, resp.text
    # -----login
    data = {'email': 'e@mail'+testcount,
            'pwd': 'hash',
            'token': 'b'*100}
    url = root + '/user/login'
    resp = requests.post(url, json=data)  # login ensure
    # ---------logout
    data = {'token': 'b'*100}
    url = root + '/user/logout'
    resp = requests.post(url, json=data)
    assert resp.status_code == 200, resp.text


def test_user_logout_fails_for_non_json():
    global testcount
    testcount = str(int(testcount) + 1)
    data = {'token': 'a'*100}
    url = root + '/user/logout'
    resp = requests.post(url, data=data)
    assert resp.status_code == 422, resp.text


def test_user_logout_fails_for_missing_keys():
    global testcount
    testcount = str(int(testcount) + 1)
    data = {'token': 'a'*100}
    url = root + '/user/logout'
    for key in sorted(list(data.keys())):
        d = dict(data)
        d.pop(key)
        resp = requests.post(url, json=d)
        assert resp.status_code == 422, resp.text


# ################################## CORS tests
def test_cors_urls():
    global testcount
    testcount = str(int(testcount) + 1)
    urls = ['/user/login',
            '/user/logour',
            '/user/create',
            # '/content/',
            # '/content/create',
            # '/content/list',
            # '/content/access',
            # '/content/remove',
            # '/content/activate',
            # '/content/deactivate',
            # '/form/',
            '/form/list',
            # '/form/create',
            # '/form/submmit',
            # '/form/deactivate',
            # '/form/activate'
            ]
    for url in urls:
        resp = requests.options(root + url)
        assert resp.status_code == 200, (url)
        assert all(i in resp.headers for i in ['Access-Control-Allow-Origin',
                                               'Access-Control-Allow-Methods',
                                               'Access-Control-Allow-Headers'])

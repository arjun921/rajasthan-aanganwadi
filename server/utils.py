import os
from pymongo import MongoClient


MONGO_URL = os.environ.get('MONGO_URL')
if MONGO_URL:
    client = MongoClient()
    dev = False
else:
    dev = True
    tokens = {}
    users = []


def is_valid_login_request(request):
    "Is this a valid login request?"
    json = None
    try:
        json = request.json
    except Exception as e:
        return (422, 'JSON unreadable', None)
    else:
        if not all(i in json for i in ['email', 'pwd', 'token']):
            return (422, 'email|pwd|token not in JSON', None)
        if len(json['token']) != 100:
            return (422, 'token len invalid', None)
        if not is_token_available(json['token']):
            return (422, 'regenerate token', None)
        # OK
        return (200, 'OK', json)


def is_valid_logout_request(request):
    "Is this a valid logout request?"
    try:
        json = request.json
    except:
        return (422, 'JSON unreadable', None)
    else:
        if 'token' not in json:
            return (422, 'token not in JSON', None)
        if len(json['token']) != 100:
            return (422, 'token len invalid', None)
        if not is_token_available(json['token']):
            return (422, 'invalid token', None)
        # OK
        return (200, 'OK', json)


def is_valid_user_info(request):
    "Is this valid info to create a new user?"
    try:
        json = request.json
    except:
        return (422, 'JSON unreadable', None)
    else:
        if all(i not in json
               for i in ['email', 'pwd', 'name',
                         'address', 'mobile']):
            return (422, 'keys missing in JSON', None)
        # OK
        return (200, 'OK', json)


def is_token_available(token):
    "Is the token available in the database?"
    if not dev:  # NOTE: remove this
        count = client.aang.tokens.find({'token': token}).count()
        return count == 0
    else:
        count = tokens.get(token)
        return token is not None


def login_user(json):
    "Create an entry in the token table"
    email, pwd, token = json['email'], json['pwd'], json['token']
    logid = {'email': email, 'pwd': pwd, 'token': token}
    if not dev:  # NOTE: remove this
        client.aang.tokens.insert_one(logid)
    else:
        tokens[token] = logid


def logout_user(json):
    "Remove this entry from the token table"
    token = json['token']
    if not dev:  # NOTE: remove this
        client.aang.tokens.find_one_and_delete({"token": token})
    else:
        if token in tokens:
            tokens.pop(token)


def create_user(json):
    "Create a user with this information"
    data = dict(email=json['email'],
                pwd=json['pwd'],
                name=json['name'],
                aadhaar=json['address'],
                mobile=json['mobile'])
    if not dev:  # NOTE: remove this
        client.aang.users.insert_one(data)
    else:
        if data not in users:
            users.append(data)

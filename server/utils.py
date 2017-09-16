from pymongo import MongoClient


client = MongoClient()


def is_valid_login_request(request):
    "Is this a valid login request?"
    json = None
    try:
        json = request.json()
    except:
        return (422, 'JSON unreadable', json)
    else:
        if not all(i in json for i in ['uname', 'pwd', 'token']):
            return (422, 'uname|pwd|token not in JSON', json)
        if len(json['token']) != 100:
            return (422, 'token len invalid', json)
        if not is_token_available(json['token']):
            return (422, 'regenerate token', json)
        # OK
        return (200, 'OK', json)


def is_valid_logout_request(request):
    "Is this a valid logout request?"
    json = None
    try:
        json = request.json()
    except:
        return (422, 'JSON unreadable', json)
    else:
        if 'token' not in json:
            return (422, 'token not in JSON', json)
        if len(json['token']) != 100:
            return (422, 'token len invalid', json)
        if not is_token_available(json['token']):
            return (422, 'invalid token', json)
        # OK
        return (200, 'OK', json)


def is_token_available(token):
    "Is the token available in the database?"
    count = client.aang.tokens.find({'token': token}).count()
    return count == 0


def login_user(json):
    "Create an entry in the token table"
    uname, pwd, token = json['uname'], json['pwd'], json['token']
    logid = {'uname': uname, 'pwd': pwd, 'token': token}
    client.aang.tokens.insert_one(logid)


def logout_user(json):
    "Remove this entry from the token table"
    token = json['token']
    client.aang.tokens.find_one_and_delete({"token": token})

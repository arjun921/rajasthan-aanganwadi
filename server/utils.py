from db import DB

db = DB()


def is_json_readable(request):
    "Is the json readable in this request?"
    try:
        json = request.json
        if json is None:
            raise Exception('Json unreadable')
    except:
        return False
    else:
        return True


def is_valid_login_request(request):
    "Is this a valid login request?"
    if is_json_readable(request):
        json = request.json
        if not all(i in json for i in ['email', 'pwd', 'token']):
            return (422, 'email|pwd|token not in JSON', None)
        if len(json['token']) != 100:
            return (422, 'token len invalid', None)
        if db.token_present(json['token']):
            return (422, 'regenerate token', None)
        # OK
        return (200, 'OK', json)
    else:
        return (422, 'JSON unreadable', None)


def is_valid_logout_request(request):
    "Is this a valid logout request?"
    if not is_json_readable(request):
        return (422, 'JSON unreadable', None)
    else:
        json = request.json
        if 'token' not in json:
            return (422, 'token not in JSON', None)
        if len(json['token']) != 100:
            return (422, 'token len invalid', None)
        if not db.token_present(json['token']):
            return (422, 'invalid token', None)
        # OK
        return (200, 'OK', json)


def is_valid_user_create_info(request):
    "Is this valid info to create a new user?"
    if not is_json_readable(request):
        return (422, 'JSON unreadable', None)
    else:
        json = request.json
        if not all((i in json)
                   for i in ['email', 'pwd', 'name',
                             'address', 'mobile']):
            return (422, 'keys missing in JSON', None)
        if db.user_present(json['email']):
            return (422, 'user already exists', None)
        # OK
        return (200, 'OK', json)

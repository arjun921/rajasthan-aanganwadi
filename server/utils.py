import os
from db import DB


db = DB()
upath = os.path.join(os.getcwd(), 'UPLOAD')
whitelist = 'abcdefghijklmnopqrstuvwxyz1234567890'


if not os.path.exists(upath):
    os.mkdir(upath)


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


def get_savepath(fname):
    "Return save path given a file name"
    global upath
    return os.path.join(upath, fname)


def clean_token(token):
    "Clean token to hold only alphanumeric"
    global whitelist
    token = ''.join(i for i in token if i in whitelist)
    return token


def del_uploaded(fname):
    "delete an uploaded file"
    os.remove(os.path.join(upath, fname))

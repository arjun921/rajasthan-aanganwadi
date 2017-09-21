import os
import bottle
import hashlib
import utils
__version__ = (0, 0, 2)


app = bottle.Bottle()
UPLOAD_DIR = 'uploads'  # NOTE: Needs to be replaced with amazon s3

# Generic functions #######################################


def httpraise(no, msg):
    """
    Helper function to easily set response status and return the needed
    message
    """
    bottle.response.status = no
    return msg


@bottle.route('/<:re:.*>', method='OPTIONS')
def enableCORSGenericRoute():
    "This allows for CORS usage"
    bottle.response.headers['Access-Control-Allow-Origin'] = '*'

# USER ROUTES #########################################


@app.post('/user/login')
def user_login():
    """
    /user/login

    Expects JSON
        {
            'email' : <email>,
            'pwd'   : <password hash>,
            'token' : <randomly generated token of 100 chars>
        }

    Returns OK in case of successful login
    """
    status, msg, json = utils.is_valid_login_request(bottle.request)
    if status == 200:
        utils.login_user(json)
    return httpraise(status, msg)


@app.post('/user/logout')
def user_logout():
    """
    /user/logout

    Expects JSON
        {
            'token' : <token which needs to be logged out>
        }
    Returns OK in case of successful login
    """
    status, msg, json = utils.is_valid_logout_request(bottle.request)
    if status == 200:
        utils.logout_user(json)
    return httpraise(status, msg)


@app.post('/user/create')
def user_create():
    """
    /user/create

    Expects JSON
        {
            'email'     : <identifier. Must be unique>
            'address'   : <address>
            'name'      : <name>
            'mobile'    : <mobile>
            'pwd'       : <password hash>
        }
    returns OK
    """
    status, msg, json = utils.is_valid_user_create_info(bottle.request)
    if status == 200:
        utils.create_user(json)
    return httpraise(status, msg)

# USER ROUTES #########################################


@app.post('/content/create')
def content_create():
    fl = bottle.request.files.get('file')
    hasher = hashlib.md5()
    buf = fl.file.read()
    hasher.update(buf)
    fname = hasher.hexdigest()
    filepath = os.path.join(UPLOAD_DIR, fname)
    if os.path.exists(filepath):
        return "File already exists."
    else:
        fl.file.seek(0)
        fl.save(filepath)
        return 'OK'


@app.post('/content/list')
def content_list():
    pass


@app.post('/content/<contentid>/access')
def content_access(contentid):
    pass


@app.post('/content/<contentid>/remove')
def content_remove(contentid):
    # ADMIN
    pass


@app.post('/content/<contentid>/activate')
def content_activate(contentid):
    # ADMIN
    pass


@app.post('/content/<contentid>/deactivate')
def content_deactivate(contentid):
    # ADMIN
    pass


if __name__ == '__main__':
    app.run(debug=True, port=8000, reloader=True)

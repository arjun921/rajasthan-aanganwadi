import bottle
import utils


app = bottle.Bottle()

# Generic functions #######################################


def httpraise(no, msg):
    'raise an http error in the respnose'
    bottle.response.status = no
    return msg


@bottle.route('/<:re:.*>', method='OPTIONS')
def enableCORSGenericRoute():
    bottle.response.headers['Access-Control-Allow-Origin'] = '*'

# Route functions #########################################


@app.post('/user/login')
def login():
    """
    Expects JSON
        {
            'email' : <username>,
            'pwd'   : <password hash>,
            'token' : <a 50 character randomly generated token>
        }
    Returns OK in case of successful login
    """
    status, msg, json = utils.is_valid_login_request(bottle.request)
    if status == 200:
        utils.login_user(json)
    return httpraise(status, msg)


@app.post('/user/logout')
def logout():
    """
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
def create_user():
    """
    Expects JSON
        {
            'name'      : <identifier>
            'address'   : <address>
            'name'      : <name>
            'mobile'    : <mobile>
            'email'     : <email>
        }
    returns OK
    """
    status, msg, json = utils.is_valid_user_info(bottle.request)
    if status == 200:
        utils.create_user(json)
    return httpraise(status, msg)

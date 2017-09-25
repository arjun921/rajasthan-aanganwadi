'''
This module defines the functions which handle the API endpoints

Function docstrings define the JSON schema that is acceptable
to the endpoint. The docstring is split into n parts by

----------

Namely 10 minus symbols

The first part defines the endpoint method and url separated by a single space,
the second defines the acceptable input JSON schema. Since this schema is used
in the code please do not make changes unless you know what you are doing.
'''
import bottle
import utils
from functools import wraps
from jsonschema import validate
__version__ = (0, 0, 3)


app = bottle.Bottle()
db = utils.db
UPLOAD_DIR = 'uploads'  # NOTE: Needs to be replaced with amazon s3

# Generic functions #######################################


def json_validate(function):
    """
    Perform JSON schema validation using the schema present in function's
    docstring.

    This makes sure that we only ingest that JSON which we expect to.
    """
    schema = function.__doc__.split('----------')[1].strip()
    # Eval poses no threat here since we are running on known string
    schema = eval(schema)

    @wraps(function)
    def newfunction(*args, **kwargs):
        if utils.is_json_readable(bottle.request):
            try:
                validate(bottle.request.json, schema)
            except:
                return httpraise(422, 'Ill formed JSON')
            else:
                return function(*args, **kwargs)
        else:
            return httpraise(422, 'JSON not readable')
    return newfunction


def endpoint(function):
    """
    Wraps a given function and turns it into a JSON endpoint
    commplete with JSON validation protection as per the
    provided functions's docstring.
    """
    method, uri = function.__doc__.split('----------')[0].strip().split(' ')
    fn = json_validate(function)
    if method.lower() == 'post':
        f = app.post(uri)(fn)
    elif method.lower() == 'get':
        f = app.post(uri)(fn)
    return f


def httpraise(no, msg):
    """
    Helper function to easily set response status and return the needed
    message on the outgoing response
    """
    bottle.response.status = no
    return msg


@app.route('/<:re:.*>', method=['OPTIONS'])
def enableCORSGenericRoute():
    "This allows for CORS usage"
    bottle.response.headers['Access-Control-Allow-Origin'] = '*'

# USER ROUTES #########################################


@endpoint
def user_login():
    """
    POST /user/login

    ----------
        {
            "type"      : "object",
            "properties":   {
                                "email" : { "type": "string",
                                            "format": "email"},
                                "pwd"   : { "type": "string" },
                                "token" : { "type": "string",
                                            "minLength": 100,
                                            "maxLength": 100
                                          },
                            },
            "required": ["pwd", "email", "token"]
        }

    ----------
    Returns OK in case of successful login
    """
    json = bottle.request.json
    pwd, token, email = json['pwd'], json['token'], json['email']
    if db.user_pwd_present(email, pwd):
        if not db.token_present(token):
            db.token_insert(token, email)
            status, msg = 200, 'OK'
        else:
            status, msg = 422, 'regenerate token'
    else:
        status, msg = 401, 'wrong credentials'
    return httpraise(status, msg)


@endpoint
def user_logout():
    """
    POST /user/logout

    ----------
        {
            "type"      : "object",
            "properties":{
                            "token" : { "type": "string",
                                        "minLength": 100,
                                        "maxLength": 100
                                      },
                        },
            "required"  : ["token"]
        }
    ----------

    Returns OK in case of successful login
    """
    if not db.token_present(bottle.request.json['token']):
        return (422, 'invalid token', None)
    db.token_remove(bottle.request.json['token'])
    return httpraise(200, 'OK')


@endpoint
def user_create():
    """
    POST /user/create
    ----------
        {
            "type"      :   "object",
            "properties":   {
                                "email"     :   {
                                                    "type": "string",
                                                    "format": "email"
                                                },
                                "address"   : {"type": "string"},
                                "name"      : {"type": "string"},
                                "mobile"    : {"type": "string"},
                                "pwd"       : {"type": "string"}
                            },
            "required"  : ["email", "address", "name", "mobile", "pwd"]
        }
    ----------

    returns OK
    """
    json = bottle.request.json
    if db.user_present(json['email']):
        return httpraise(422, 'user already exists')
    db.user_insert(json)
    return httpraise(200, 'OK')

# CONTENT ROUTES #########################################


# '/content/create'
# '/content/list'
# '/content/<contentid>/access'
# '/content/<contentid>/remove'
# '/content/<contentid>/activate'
# '/content/<contentid>/deactivate'

# FORM ROUTES #########################################

@endpoint
def form_list():
    """
    POST /form/list
    ----------
        {
            "type"          :   "object",
            "properties"    :   {
                                    "token" :   {"type" : "string",
                                                 "minLength": 100,
                                                 "maxLength": 100}
                                },
            "required"      : ["token"]
        }
    ----------
    Returns JSON
        {
            'forms': [list of forms ids]
        }
    """
    status, msg, json = utils.is_valid_form_list_request(bottle.request)
    if status == 200:
        if utils.token_is_listed_in_db(json['token']):
            user = utils.get_user_from_token(json['token'])
            if user is not None:
                forms = utils.get_user_forms(user)
                return {'forms': forms}
            else:
                return httpraise(404, 'no such user')
        else:
            return httpraise(403, 'login to access forms')
    else:
        return httpraise(status, msg)


@app.post('/form/<formid>')
def form_formid(formid):
    """
    /form/<formid>
    Expects JSON
        {
            'token': <logged in user token>,
        }

    Returns JSON
        {
            "formid"    : <formid>,
            "title"     : <title>,
            "fields"    :   [
                                {
                                    'label'     : <field label>,
                                    'kind'      : <kind of field>,
                                    'identifier': <identifier>
                                },
                                {
                                    'label'     : <field label>,
                                    'kind'      : <kind of field>,
                                    'identifier': <identifier>
                                }
                            ]
        }
    """
    if utils.is_logged_in_user(bottle.request):
        ok = utils.user_is_allowed_form_access(bottle.request.json['token'],
                                               formid)
        if ok:
            return utils.get_form(formid)
        else:
            return httpraise(403, 'Log in to access forms')
    else:
        return httpraise(403, 'Log in to access forms')


@app.post('/form/create')
def form_create():
    """
    /form/create

    Expects JSON
        {
            'token' : <token of form creator>,
            'form'  :   {
                            'formid': <formid>,
                            'title'     : <title>,
                            'fields'    :   [
                                                {
                                                    'label'     :<field label>,
                                                    'kind'      :<field kind>,
                                                    'identifier':<identifier>
                                                },
                                                {
                                                    'label'     :<field label>,
                                                    'kind'      :<field kind>,
                                                    'identifier':<identifier>
                                                }
                                            ],
                            'groups'    : [group1, group2, ...]
                        }

    Returns JSON
        {
            'status': <true/false >,
            'formid': <formid if created>
        }
    """
    if utils.is_logged_in_user(bottle.request, admin=True):
        ok, formid = utils.add_form_format(bottle.request.json)
        if ok:
            return {'status': True, 'formid': formid}
        else:
            return {'status': False, 'formid': None}
    else:
        return httpraise(403, 'admin access required')


def form_submit(formid):
    """
    POST /form/submit

    ----------
    {
    "type"      :   "object",
    "properties":   {
                    "token":   {
                                   "type"      :   "string",
                                   "minLength" :   100,
                                   "maxLength" :   100
                               },
                    "data" :   {
                               "type"  : "array",
                               "uniqueItems": true
                               "items" : {
                                           "type": "object",
                                           "properties":{
                                               "identifier":{"type": "string"},
                                               "value"     :{"type": "string"}
                                           },
                                           "required": ["identifier", "value"]
                                   }
                               }
                    }
    "required"  : ["token", "data"]
    }

    ----------
    Returns JSON
        {
            'status'    : true
        }
    """
    if utils.is_logged_in_user(bottle.request):
        ok = utils.user_is_allowed_form_access(bottle.request.json['token'],
                                               formid)
        if ok:
            status = utils.submit_form(formid, bottle.request.json['token'],
                                       bottle.request.json['data'])
            return {'status': status}
        else:
            return httpraise(403, 'Log in to access forms')
    else:
        return httpraise(403, 'login required')


@app.post('/form/<formid>/deactivate')
def form_deactivate(formid):
    """
    /form/<formid>/deactivate

    Expects JSON
        {
            "token" : <user token>,
        }

    Returns JSON
        {
            "status": true/false
        }
    """
    if utils.is_logged_in_user(bottle.request, admin=True):
        status = utils.deactivate_form(formid)
        return {'status': status}
    else:
        return httpraise(403, 'admin access required')


@app.post('/form/<formid>/activate')
def form_activate(formid):
    """
    /form/<formid>/activate

    Expects JSON
        {
            'token': <user token>
        }

    Returns JSON

        {
            'status': true/false
        }
    """
    if utils.is_logged_in_user(bottle.request, admin=True):
        status = utils.activate_form(formid)
        return {'status': status}
    else:
        return httpraise(403, 'admin access required')


if __name__ == '__main__':
    app.run(debug=True, port=8000, reloader=True)

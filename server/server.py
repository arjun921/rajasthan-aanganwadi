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
__version__ = (0, 0, 6)


app = bottle.Bottle()
db = utils.db
UPLOAD_DIR = 'uploads'  # NOTE: Needs to be replaced with amazon s3
whitelist = 'abcdefghijklmnopqrstuvwxyz1234567890'

# Generic functions #######################################


def admin_only(function):
    """
    Raise permission errors if logged in user is not Admin.
    Requires function to have been wrapped in login_required
    """
    @wraps(function)
    def fn(*a, **kw):
        json = bottle.request.json
        token = json['token']
        email = db.token_data(token)['email']
        if not db.is_admin(email):
            raise bottle.HTTPError(403, 'not admin')
        return function(*a, **kw)
    return fn


def login_required(function):
    """
    Detect a valid token in the json of the request.
    Requires function to be wrapped in json_validate
    """
    @wraps(function)
    def fn(*a, **kw):
        json = bottle.request.json
        if json is None or 'token' not in json:
            raise bottle.HTTPError(403, 'please login')
        token = ''.join(i for i in json['token']
                        if i in whitelist)
        if len(token) != 100:
            raise bottle.HTTPError(422, 'invalid token')
        if not db.token_present(token):
            raise bottle.HTTPError(422, 'invalid token')
        return function(*a, **kw)
    return fn


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
                raise bottle.HTTPError(422, 'JSON does not satisfy scheme')
            else:
                return function(*args, **kwargs)
        else:
            raise bottle.HTTPError(422, 'JSON not found')
    return newfunction


@app.route('/<:re:.*>', method=['OPTIONS'])
def enableCORSGenericRoute():
    "This allows for CORS usage"
    bottle.response.headers['Access-Control-Allow-Origin'] = '*'
    bottle.response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    string = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
    bottle.response.headers['Access-Control-Allow-Headers'] = string

# USER ROUTES #########################################


@app.post('/user/login')
@json_validate
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
            return 'OK'
        else:
            raise bottle.HTTPError(422, 'regenerate token')
    else:
        raise bottle.HTTPError(401, 'wrong credentials')


@app.post('/user/delete')
@json_validate
def user_delete():
    """
    POST /user/delete

    ----------
        {
            "type"      : "object",
            "properties":{
                            "token" : { "type": "string",
                                        "minLength": 100,
                                        "maxLength": 100
                                      },
                            "email" : {"type":"string",
                                       "format": "email"}
                        },
            "required"  : ["token", "email"]
        }
    ----------

    Returns OK in case of successful login
    """
    db.user_delete(bottle.request.json['email'])
    return 'OK'


@app.post('/user/logout')
@json_validate
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
        raise bottle.HTTPError(422, 'invalid token')
    db.token_remove(bottle.request.json['token'])
    return 'OK'


@app.post('/user/create')
@json_validate
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
        raise bottle.HTTPError(422, 'user exists')
    db.user_insert(json)
    return 'OK'

# CONTENT ROUTES #########################################


# '/content/create'
# '/content/list'
# '/content/<contentid>/access'
# '/content/<contentid>/remove'
# '/content/<contentid>/activate'
# '/content/<contentid>/deactivate'

# FORM ROUTES #########################################

@app.post('/form/list')
@json_validate
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
    return db.form_list()  # TODO: user authorize


@app.post('/form')
@json_validate
def form_formid():
    """
    POST /form
    ----------
        {
            "type"          :   "object",
            "properties"    :   {
                                    "token" :   {"type" : "string",
                                                 "minLength": 100,
                                                 "maxLength": 100},
                                    "formid":   {"type" : "string"}
                                },
            "required"      : ["token", "formid"]
        }

    ----------
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
    # TODO: user authorization
    formid = bottle.request.json['formid']
    if db.form_present(formid):
        return db.form_data(formid)
    else:
        raise bottle.HTTPError(404, 'form not found')


@app.post('/form/create')
@json_validate
def form_create():
    """
    POST /form/create

    ----------
    {
        "type"          :   "object",
        "properties"    :   {
                                "formid":   {"type" : "string"},
                                "title" :   {"type" : "string"},
                                "groups":   {"type": "array",
                                             "items": {"type": "string"}
                                            },
                                "fields":   {
                                             "type" : "array",
                                             "items": {
                                                "type": "object",
                                                "properties": {
                                                            "id":{"type":"string"},
                                                            "label":{"type":"string"},
                                                            "kind":{"type":"string"},
                                                            "misc":{
                                                                    "type":"array",
                                                                    "items":{
                                                                      "type":"string"},
                                                                    "uniqueItems":True}
                                                               },
                                                 },
                                             "uniqueItems": True
                                            },
                            },
        "required"      : ["title", "formid", "fields", "groups"]
    }
    ----------

        {
            'status': <true/false >,
            'formid': <formid if created>
        }
    """
    db.form_insert(bottle.request.json)


@app.post('/form/submit')
@json_validate
def form_submit():
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
                    "formid":  {
                                   "type"      :   "string"
                               },
                    "data" :   {
                               "type"  : "array",
                               "uniqueItems": True,
                               "items" : {
                                           "type": "object",
                                           "properties":{
                                               "id":{"type": "string"},
                                               "value"     :{"type": "string"}
                                           },
                                           "required": ["id", "value"]
                                   }
                               }
                    },
    "required"  : ["token", "data", "formid"]
    }

    ----------
    Returns JSON
        {
            'status'    : true
        }
    """
    pass


@app.post('/form/delete')
@json_validate
def form_delete():
    """
    POST /form
    ----------
        {
            "type"          :   "object",
            "properties"    :   {
                                    "token" :   {"type" : "string",
                                                 "minLength": 100,
                                                 "maxLength": 100},
                                    "formid":   {"type" : "string"}
                                },
            "required"      : ["token", "formid"]
        }

    ----------
    Returns OK
    """
    db.form_remove(bottle.request.json['formid'])


if __name__ == '__main__':
    app.run(debug=True, port=8000, reloader=True)

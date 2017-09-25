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
__version__ = (0, 0, 5)


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
                raise bottle.HTTPError(422, 'JSON does not satisfy scheme')
            else:
                return function(*args, **kwargs)
        else:
            raise bottle.HTTPError(422, 'JSON not found')
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


@app.route('/<:re:.*>', method=['OPTIONS'])
def enableCORSGenericRoute():
    "This allows for CORS usage"
    bottle.response.headers['Access-Control-Allow-Origin'] = '*'
    bottle.response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    string = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'
    bottle.response.headers['Access-Control-Allow-Headers'] = string

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
            return 'OK'
        else:
            raise bottle.HTTPError(422, 'regenerate token')
    else:
        raise bottle.HTTPError(401, 'wrong credentials')


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
        raise bottle.HTTPError(422, 'invalid token')
    db.token_remove(bottle.request.json['token'])
    return 'OK'


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
    return db.form_list()  # TODO: user authorize


@endpoint
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
    pass


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
    pass


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
    pass


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
    pass


if __name__ == '__main__':
    app.run(debug=True, port=8000, reloader=True)

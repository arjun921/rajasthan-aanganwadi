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
import os
import bottle
import utils
import hashlib
import pandas as pd
from functools import wraps
from datetime import datetime
from jsonschema import validate
__version__ = (0, 0, 19)


app = bottle.Bottle()
db = utils.db
string = 'Origin, Accept , Content-Type, X-Requested-With, X-CSRF-Token'
CORS_HEADERS = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': string
                }

# wrappers functions #######################################


def raisehttp(code, body):
    """
    Raise an HTTP error and add access control headers to it.
    This is necessary since hooks don't get called if an ERROR is raised.
    """
    raise bottle.HTTPError(code, body=body, headers=CORS_HEADERS)


def admin_only(function):
    """
    This is an endpoint wrapper.
    Raise permission errors if logged in user is not Admin.
    Requires function to have been wrapped in login_required
    """
    @wraps(function)
    def fn(*a, **kw):
        json = bottle.request.json
        token = json['token']
        email = db.token_data(token)['email']
        if not db.is_admin(email):
            raise raisehttp(403, body='not admin')
        return function(*a, **kw)
    return fn


def login_required(function):
    """
    This is an endpoint wrapper.
    Detect a valid token in the json of the request.
    Requires function to be wrapped in json_validate
    """
    @wraps(function)
    def fn(*a, **kw):
        json = bottle.request.json
        if 'token' not in json:
            raise raisehttp(403, body='please provide a token')
        token = utils.clean_token(json['token'])
        if len(token) != 100:
            raise raisehttp(422, body='invalid token')
        if not db.token_present(token):
            raise raisehttp(403, body='user not logged in')
        return function(*a, **kw)
    return fn


def json_validate(function):
    """
    This is an endpoint wrapper.
    Perform JSON schema validation using the schema present in function's
    docstring.

    This makes sure that we only ingest that JSON which we expect to.
    """
    schema = function.__doc__.split('----------')[1].strip()
    # Eval poses no threat here since we are running on known string
    schema = eval(schema)

    @wraps(function)
    def newfunction(*args, **kwargs):
        try:
            if bottle.request.json is None:
                raise Exception('NO JSON')
            validate(bottle.request.json, schema)
        except:
            raise raisehttp(422, body='JSON does not satisfy scheme')
        else:
            return function(*args, **kwargs)
    return newfunction


# ROUTES #########################################

@app.route('/<:re:.*>', method=['OPTIONS'])
def enableCORSGenericOptionsRoute():
    "This allows for CORS usage of the APIs"
    return 'OK'


@app.hook('after_request')
def add_cors_headers():
    "Add cors headers to all outgoing responses"
    for key, val in CORS_HEADERS.items():
        bottle.response.headers[key] = val


@app.get('/')
def admin_panel():
    """
    Admin panel html. This is the only admin interface.
    """
    with open('home.html', 'r') as fl:
        html = fl.read()
    return html


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

    Returns {"name": <string>} in case of successful login
    """
    json = bottle.request.json
    pwd, token, email = json['pwd'], json['token'], json['email']
    if db.user_pwd_present(email, pwd):
        if not db.token_present(token):
            db.record_login_activity(email, True)
            db.token_insert(token, email)
            return {'name': db.user_info(email)['name']}
        else:
            raise raisehttp(422, body='regenerate token')
    else:
        raise raisehttp(401, body='wrong credentials')


@app.post("/user")
@json_validate
@login_required
def user_details():
    """
    /user returns user details if you are admin or the user in question
    ----------

        {
            "type"      : "object",
            "properties":   {
                                "email" : {"type": "string",
                                            "format": "email"},
                                "token" : { "type": "string",
                                            "minLength": 100,
                                            "maxLength": 100
                                          }
                            },
            "required": ["token", "email"]
        }
    ----------
    return {"email": <>, "name": <>, "address": <>, "mobile": <>}
    """
    json = bottle.request.json
    token, req_email = json['token'], json['email']
    email = db.token_data(token)['email']
    data = db.user_info(req_email)
    data.pop('pwd')
    if db.is_admin(email) or req_email == email:
        return data
    else:
        raise raisehttp(403, body='Only Admin or self can access')


@app.post('/user/delete')
@json_validate
@login_required
@admin_only
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
@login_required
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
        raise raisehttp(422, body='invalid token')
    email = db.token_data(bottle.request.json['token'])['email']
    db.record_login_activity(email, False)
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
            "required"  : ["email", "address", "name",
                           "mobile", "pwd"]
        }

    ----------

    returns OK
    """
    json = bottle.request.json
    if db.user_present(json['email']):
        raise raisehttp(422, body='user exists')
    data = dict(json)
    db.user_insert(data)
    return 'OK'


@app.post('/content/create')
def content_create():
    """
    File upload to create content.

    Expects a normal html multipart form with
        token       : a string signifying user token
        upload      : the file being uploaded
        title       : Title of the content
        parent      : Which category contains this content?
        description : Description of the content

    Returns file name on successful creation
    """
    token = bottle.request.forms.get('token')
    if token is None:
        raise raisehttp(422, body='invalid token')
    token = utils.clean_token(token)
    if len(token) != 100:
        raise raisehttp(422, body='invalid token')
    if not db.token_present(token):
        raise raisehttp(403, body='user not logged in')
    email = db.token_data(token)['email']
    if not db.is_admin(email):
        raise raisehttp(403, body='not admin')
    # --------------alel ok
    files = bottle.request.files.getall('upload')
    for file in files:
        hasher = hashlib.md5()
        hasher.update(file.file.read())
        name = hasher.hexdigest()
        fname = name + '.' + file.filename.split('.')[-1]
        # add meta
        title = bottle.request.forms.get('title')
        title = title if title.strip() else file.filename
        desc = bottle.request.forms.get('description')
        # -----------update category to contain this content
        parent = bottle.request.forms.get('parent')
        if parent is not None:
            meta = {'title': title,
                    'desc': desc,
                    'parent': parent,
                    'original': file.filename}
            db.content_meta_create(fname, meta)
            data = db.category_data(parent)
            data['contains'].append(fname)
            db.category_delete(parent)
            db.category_insert(data)
        # save
        savepath = utils.get_savepath(fname)
        file.file.seek(0)
        file.save(savepath, overwrite=True)
    return fname


@app.post('/content/delete')
@json_validate
@login_required
@admin_only
def content_delete():
    """
    POST /content/delete

    ----------

    {
        "type"      :   "object",
        "properties":   {
                            "token" :   {"type": "string",
                                         "maxLength": 100,
                                         "minLength": 100},
                            "fname"   :   {"type": "string"}
                        },
        "required"  :   ["token", "fname"]

    }

    ----------

    Return OK
    """
    fname = bottle.request.json['fname']
    # TODO: should clean this path
    meta = db.content_meta_data(fname)
    utils.del_uploaded(fname)
    meta = db.content_meta_data(fname)
    if meta is not None and 'parent' in meta:
        parent = meta['parent']
        cat = db.category_data(parent)
        if cat is not None:
            cat['contains'] = [i for i in cat['contains'] if i != fname]
            db.category_delete(parent)
            db.category_insert(cat)
    return 'OK'


@app.post('/content/list')
@json_validate
@login_required
def list_content():
    """
    POST /content/list

    ----------

    {
        "type": "object",
        "properties":   {
                            "token" :   {"type": "string",
                                         "maxLength": 100,
                                         "minLength": 100}
                        },
        "required": ["token"]
    }

    ----------
    returns JSON

    { 'contents': []}
    """
    contents = []
    for i, fid in enumerate(os.listdir(utils.upath)):
        met = db.content_meta_data(fid)
        title = fid if (met is None or met['title'] is None) else met['title']
        contents.append({'fname': fid, 'title': title,
                         'meta': []})
    return {'contents': contents}


@app.post('/form/responses')
@json_validate
@login_required
@admin_only
def form_responses_as_csv():
    """
    POST /form/responses

    ----------

    {
        "type": "object",
        "properties":   {
                            "token" :   {"type": "string",
                                         "maxLength": 100,
                                         "minLength": 100},
                            "formid":   {"type": "string"}
                        },
        "required": ["token", "formid"]
    }

    ----------
    returns JSON

    { 'url': '/static/<fileid>.csv'}
    """
    formid = bottle.request.json['formid']
    responses = db.response_for_form(formid)
    df = pd.DataFrame(responses)
    fname = str(hash(str(df))).strip('-')+'.csv'
    path = utils.get_savepath(fname)
    df.to_csv(path, index=False)
    # now this works like normal content
    link = db.generate_content_url(fname, count=1)
    return {'url': '/static/'+link}


@app.post('/content')
@json_validate
@login_required
def content_retreive():
    """
    POST /content/

    ----------

    {
        "type": "object",
        "properties":   {
                            "token" :   {"type": "string",
                                         "maxLength": 100,
                                         "minLength": 100},
                            "fname" :   {"type": "string"}
                        },
        "required": ["token", "fname"]
    }

    ----------

    returns the relevant file if permissions allow
    """
    fname = bottle.request.json['fname']
    meta = db.content_meta_data(fname)
    if meta is None:
        raise raisehttp(404, 'Content not found')
    link = db.generate_content_url(fname)
    db.record_content_usage(fname)
    meta["creation_stamp"] = str(meta['creation_stamp'])
    return {'url': '/static/'+link,
            'meta': meta}


# FORM ROUTES #########################################


@app.post('/form/list')
@json_validate
@login_required
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
    email = db.token_data(bottle.request.json['token'])['email']
    if not db.is_admin(email):
        forms_done = [f['formid'] for f in db.response_user_list(email)]
    else:
        forms_done = []
    # NOTE: This filtering might be better performed in DB
    x = [i for i in db.form_list()
         if i['formid'] not in forms_done]
    return {'forms': x}


@app.post('/form')
@json_validate
@login_required
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
                                    'id'        : <identifier>
                                    'misc'      : ['item1', 'item2']
                                },
                            ]
        }
    """
    formid = bottle.request.json['formid']
    if db.form_present(formid):
        x = db.form_data(formid)
        return x
    else:
        raise raisehttp(404, 'form not found')


@app.post('/form/create')
@json_validate
@login_required
@admin_only
def form_create():
    """
    POST /form/create

    ----------

    {
        "type"          :   "object",
        "properties"    :   {
                                "token" :   {"type" : "string",
                                             "minLength": 100,
                                             "maxLength": 100},
                                "formid":   {"type" : "string"},
                                "title" :   {"type" : "string"},
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
                                                                      "type":"object"},
                                                                    "uniqueItems":True}
                                                               },
                                                 },
                                             "uniqueItems": True
                                            },
                            },
        "required"      : ["title", "formid", "fields","token"]
    }

    ----------

        {
            'status': <true/false >,
            'formid': <formid if created>
        }
    """
    frm = bottle.request.json
    frm['formid'] = utils.randstring(50)
    db.form_insert(bottle.request.json)
    return frm['formid']


@app.post('/form/submit')
@json_validate
@login_required
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
                                       "id"   : {"type": "string"},
                                       "value": {"type": "string"},
                                       "misc" : {
                                          "type"  : "array",
                                          "uniqueItems": True,
                                          "items" : {
                                            "type": "object",
                                            "properties":{
                                             "id":{"type": "string"},
                                             "value":{"type": "string"}
                                            },
                                            "required": ["id", "value"]
                                            }
                                      }
                                   },
                                   "required": ["id", "value"]
                                   }
                               }
                    },
    "required"  : ["token", "data", "formid"]
    }

    ----------

    returns OK
    """
    email = db.token_data(bottle.request.json['token'])['email']
    data = dict(bottle.request.json)
    data['email'] = email
    data['timestamp'] = str(datetime.now())
    db.response_submit(data)
    return 'OK'


@app.post('/form/delete')
@json_validate
@login_required
@admin_only
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


@app.get('/static/<link>')
def staticfiles(link):
    fname = db.content_get_fname_for_link(link)
    if fname is not None:
        response = bottle.static_file(fname, root=utils.upath)
        for k, v in CORS_HEADERS.items():
            response.set_header(k, v)
        return response
    else:
        return raisehttp(404, 'Perhaps this link has been used already')


@app.get('/adminstatic/<link>')
def adminstaticfiles(link):
    return bottle.static_file(link, root=utils.adminstatic)


@app.post('/category/delete')
@json_validate
@login_required
@admin_only
def category_delete():
    """
    POST /category/delete

    ----------
    {
        "type": "object",
        "properties": {
                        "token" :   {"type" : "string",
                                     "minLength": 100,
                                     "maxLength": 100},
                        "catid": {"type": "string"},
                      },
        "required": ["token", "catid"]
    }
    ----------

    Returns OK
    """
    catid = bottle.request.json['catid']
    if db.category_data(catid) is None:
        raisehttp(404, 'category not present')
    else:
        db.category_delete(catid)
        return 'OK'


@app.post('/category/create')
@json_validate
@login_required
@admin_only
def category_create():
    """
    POST /category/create

    ----------
    {
        "type"          : "object",
        "properties"    : {
                            "token" :   {"type" : "string",
                                         "minLength": 100,
                                         "maxLength": 100},
                            "title":   {"type" : "string"},
                            "id": {"type": "string"},
                            "contains": {"type": "array",
                                         "items": {
                                                    "type": "string",
                                                  },
                                         "uniqueItems": True
                                         },
                            "parent": {"type": "string"}
                          },
        "required"      : ["title", "contains", "id", "token"]
    }

    ----------

    Returns OK
    """
    cat = db.category_data(bottle.request.json['id'])
    if cat is not None:
        raisehttp(422, 'Category id exists')
    else:
        cat = bottle.request.json
        if 'parent' in cat:
            parent, cat = cat['parent'], dict(cat)
            cat.pop('parent')
            p = db.category_data(parent)
            if p is not None:
                p['contains'].append(cat['id'])
                # update
                db.category_delete(parent)
                db.category_insert(p)
        db.category_insert(cat)
        return 'OK'


@app.post("/report")
@json_validate
@login_required
@admin_only
def report_login():
    """
    POST /report
    ----------
     {
        "type"          : "object",
        "properties"    : {
                            "token" :   {"type" : "string",
                                         "minLength": 100,
                                         "maxLength": 100},
                            "end":      {"type": "number"},
                            "interval": {"type": "number"},
                            "kind": {"type": "string"}
                          },
        "required"      : ["token", "kind"]
    }
    ----------

    Returns JSON
    {
        "report": [
                    <item tuple>,
                    <item tuple>,
                    <item tuple>,
                    ]
    }
    """
    end = bottle.request.json.get("end", datetime.utcnow().timestamp())
    end = datetime.fromtimestamp(end)
    interval = bottle.request.json.get("interval", 5)
    kind = bottle.request.json.get("kind", "useractivity")
    if kind == 'useractivity':
        data = {"report": db.get_login_report(end, interval),
                "columns": ["User", "Activity", "TimeStamp"]}
    elif kind == 'contentusage':
        data = {"report": db.get_content_report(end, interval),
                "columns": ["FileName", "File Kind", "Title",
                            "Parent Category Id",
                            "Parent Category Title", "Timestamp"]}
    elif kind == 'contentstatus':
        data = {"report": db.get_content_status_report(),
                "columns": ["File Id", "Title", "Description",
                            "Parent Category Id", "Creation Timestamp"]}
    else:
        return raisehttp(404, "Report Kind not found")
    return data


@app.post('/category')
@json_validate
def category_list():
    """
    POST /category

    ----------

        {
            "type"          : "object",
            "properties"    : {
                                    "catid":   {"type" : "string"}
                              },
            "required"      : ["catid"]
        }

    ----------

    Returns category item.

    Category IDs are system generated and are always
    prefixed with an `_`.
    If a catid does not have an `_` it is an actual content file
    """
    cat = db.category_data(bottle.request.json['catid'])
    if cat is not None:
        # add titles to contains
        contains = []
        for i in cat['contains']:
            if i[0] == '_':
                title = db.category_data(i)
                if title is None:
                    continue
                else:
                    title = title['title']
            else:
                meta = db.content_meta_data(i)
                if meta is not None and meta['title'] is not None:
                    title = meta['title']
                else:
                    title = i
            contains.append({'title': title,
                             'id': i})
        cat['contains'] = contains
        return cat
    else:
        raisehttp(404, 'Category not found')


@app.post('/category/reorganize')
def category_reorganize():
    """
    Reorganize the category tree using the excel
    file uploaded.
    """
    token = bottle.request.forms.get('token')
    if token is None:
        raise raisehttp(422, body='invalid token')
    token = utils.clean_token(token)
    if len(token) != 100:
        raise raisehttp(422, body='invalid token')
    if not db.token_present(token):
        raise raisehttp(403, body='user not logged in')
    email = db.token_data(token)['email']
    if not db.is_admin(email):
        raise raisehttp(403, body='not admin')
    # TODO: Select DoIT&C format via query option
    # --------------alel ok
    file = bottle.request.files.get('upload')
    ext = file.filename.split('.')[-1]
    savepath = utils.get_savepath('FileTree.'+ext)
    file.save(savepath, overwrite=True)
    utils.doitc_file_to_generalized_format(savepath)
    utils.generate_tree_from_excel_file(savepath)
    return 'ok'


if __name__ == '__main__':
    port = os.environ.get("PORT")
    port = port if port else 8000
    app.run(debug=True, port=port, host='0.0.0.0')

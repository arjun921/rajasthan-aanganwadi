import os
import bottle
import hashlib
import utils
__version__ = (0, 0, 2)


app = bottle.Bottle()
db = utils.db
UPLOAD_DIR = 'uploads'  # NOTE: Needs to be replaced with amazon s3

# Generic functions #######################################


def httpraise(no, msg):
    """
    Helper function to easily set response status and return the needed
    message on the outgoing response
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
        pwd, token, email = json['pwd'], json['token'], json['email']
        if db.user_pwd_present(email, pwd):
            db.token_insert(token, email)
        else:
            status, msg = 401, 'wrong credentials'
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
        db.token_remove(json['token'])
    return httpraise(status, msg)


@app.post('/user/create')
def user_create():
    """
    /user/create

    Expects JSON
        {
            'email'     : <identifier. Must be unique>,
            'address'   : <address>,
            'name'      : <name>,
            'mobile'    : <mobile>,
            'pwd'       : <password hash>
        }
    returns OK
    """
    status, msg, json = utils.is_valid_user_create_info(bottle.request)
    if status == 200:
        db.user_insert(json)
    return httpraise(status, msg)

# CONTENT ROUTES #########################################


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


# CONTENT ROUTES #########################################

@app.post('/form/list')
def form_list():
    """
    /form/list
    Expects JSON
        {
            'token' : <logged in user token>
        }

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


@app.post('/form/<formid>/submit')
def form_submit(formid):
    """
    /form/<formid>/submit

    Expects JSON
        {
            'token' : <user token>,
            'data'  :   [
                            {
                                'identifier'    :<identifier>,
                                'value'         :<value>
                            },
                            {
                                'identifier'    :<identifier>,
                                'value'         :<value>
                            }
                        ]
        }

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

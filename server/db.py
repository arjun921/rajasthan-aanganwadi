import os
import random
from pymongo import MongoClient


def randstring(n):
    """
    Random string of length n
    """
    alpha = 'abcdefghijklmnopqrstuvwxyz1234567890'
    return ''.join(random.choice(alpha) for _ in range(n))


class DB:
    """
    The database class to quietly abstract away all differences
    between using mongo and a RAM db
    """
    def __init__(self):
        # NOTE: Production will be using Mongo so no need for this
        data = dict(email='arjoonn.94@gmail.com',
                    pwd='2328904461',
                    name='arjoonn',
                    address='india',
                    mobile='123')
        if os.environ.get('USE_MONGO'):
            MONGO_URL = os.environ.get('MONGODB_URI')
            print('Using MONGO URL', MONGO_URL)
            self.dbname = MONGO_URL.split('/')[-1]
            self.client = MongoClient(MONGO_URL)
            self.database = self.client[self.dbname]
            self.dev = False
            print('Using mongo')
            if self.database.admins.find().count() == 0:
                self.user_insert(data)
                self.add_admin(data['email'])
            for k in ['tokens', 'users', 'forms', 'responses',
                      'admins', 'content_links', 'categories']:
                d = {'column': 'initiator'}
                self.database[k].insert_one(d)
                self.database[k].find_one_and_delete(d)

        else:
            print('Using RAM db')
            self.dev = True
            self.tokens = {}
            self.users = []
            self.forms = []
            self.responses = []
            self.admins = []
            self.content_links = []
            self.content_meta = []
            self.categories = []

            # add initial admin
            if len(self.admins) == 0:
                self.user_insert(data)
                self.add_admin(data['email'])
            # categories

    def response_submit(self, data):
        "submit a form response"
        if not self.dev:  # TODO: remove this
            self.database.responses.insert_one(data)
        else:
            self.responses.append(data)

    def response_user_list(self, email):
        "responses submitted by a user"
        if not self.dev:  # TODO: remove this
            return list(self.database.responses.find({'email': email}))
        else:
            return [i for i in self.responses
                    if i['email'] == email]

    def response_for_form(self, formid):
        "Responses for a given formid"
        if not self.dev:  # TODO: remove this
            resp = list(self.database.responses.find({'formid': formid}))
        else:
            resp = [i for i in self.responses if i['formid'] == formid]
        # process
        submitted = []
        for r in resp:
            sub = {}
            for part in r['data']:
                sub[part['id']+'_value'] = part['value']
                if 'misc' in part:
                    sub[part['id']+'_misc'] = part['misc']
            r.pop('data')
            sub.update(r)
            submitted.append(sub)
        return submitted

    def is_admin(self, uemail):
        "Is this member present in the admin list"
        if self.user_present(uemail):
            if not self.dev:
                c = self.database.admins.find({'email': uemail}).count()
                return c > 0
            else:
                return uemail in self.admins

    def add_admin(self, uemail):
        "Add an admin"
        if self.user_present(uemail) and not self.is_admin(uemail):
            if not self.dev:
                self.database.admins.insert_one({'email': uemail})
            else:
                self.admins.append(uemail)

    def delete_admin(self, uemail):
        "Remove an admin"
        if self.is_admin(uemail):
            if not self.dev:
                self.database.admins.find_one_and_delete({'email': uemail})
            else:
                self.admins.remove(uemail)

    def form_data(self, formid):
        "Return form for this formid"
        if self.form_present(formid):
            if not self.dev:
                f = self.database.forms.find_one({'formid': formid})
                F = {k: v for k, v in f.items() if k[0] != '_'}
                return F
            else:
                return [f for f in self.forms
                        if f['formid'] == formid][0]

    def form_list(self, email=None):
        "List forms available for this user"
        if not self.dev:
            frms = self.database.forms.find()
            return [{'formid': f['formid'],
                     'title': f['title']} for f in frms]
        else:
            return [{'formid': f['formid'],
                     'title': f['title']} for f in self.forms]

    def form_present(self, formid):
        "Is this form present?"
        if not self.dev:  # NOTE: remove this
            count = self.database.forms.find({'formid': formid}).count()
            return count == 1
        else:
            count = [f for f in self.forms
                     if f['formid'] == formid]
            return len(count) == 1

    def form_insert(self, form):
        "Insert a form into the database"
        if not self.form_present(form['formid']):
            if not self.dev:  # NOTE: remove this
                self.database.forms.insert_one(form)
            else:
                self.forms.append(form)

    def form_remove(self, formid):
        "Remove form from database"
        if self.form_present(formid):
            if not self.dev:  # NOTE: remove this
                self.database.forms.find_one_and_delete({'formid': formid})
            else:
                self.forms = [i for i in self.forms
                              if i['formid'] != formid]

    def token_present(self, token):
        "Is the token available in the database?"
        if not self.dev:  # NOTE: remove this
            count = self.database.tokens.find({'token': token}).count()
            return count != 0
        else:
            token = self.tokens.get(token)
            return token is not None

    def token_insert(self, token, user_email):
        "Insert user into logged in token base"
        if not self.dev:  # NOTE: remove this
            self.database.tokens.insert_one({'token': token,
                                                'email': user_email})
        else:
            self.tokens[token] = user_email

    def token_remove(self, token):
        "Remove a token"
        if self.token_present(token):
            if not self.dev:  # NOTE: remove this
                self.database.tokens.find_one_and_delete({"token": token})
            else:
                self.tokens.pop(token)

    def token_data(self, token):
        "Return email of person to whom token belongs"
        if self.token_present(token):
            if not self.dev:
                em = self.database.tokens.find_one({'token': token})
                return em
            else:
                return {'token': token, 'email': self.tokens[token]}

    def user_delete(self, email):
        "Remove a user"
        if self.user_present(email):
            if not self.dev:
                self.database.users.find_one_and_delete({'email': email})
            else:
                self.users = [i for i in self.users
                              if i['email'] != email]

    def user_insert(self, user):
        "Insert a user into the database"
        data = dict(email=user['email'],
                    pwd=user['pwd'],
                    name=user['name'],
                    aadhaar=user['address'],
                    mobile=user['mobile'])
        if not self.user_present(data['email']):
            if not self.dev:  # NOTE: remove this
                self.database.users.insert_one(data)
            else:
                self.users.append(data)

    def user_present(self, user_email):
        "Is user already existing?"
        data = dict(email=user_email)
        if not self.dev:  # NOTE: remove this
            count = self.database.users.find(data).count()
            return count > 0
        else:
            return len(list(1 for i in self.users
                       if i['email'] == user_email)) > 0

    def user_info(self, user_email):
        "Returns all info about the user"
        if not self.dev:  # NOTE: remove this
            u = self.database.users.find({"email": user_email})
        else:
            u = [u for u in self.users if u['email'] == user_email]
        u = list(u)
        if u:
            return u[0]

    def content_meta_create(self, fname, title, desc, parent):
        "Add meta about the content"
        data = {'fname': fname,
                'title': title,
                'desc': desc,
                'parent': parent}
        if not self.dev:  # NOTE: remove this
            self.database['content_meta'].insert_one(data)
        else:
            self.content_meta.append(data)

    def content_meta_data(self, fname):
        "Returns meta about a file"
        if not self.dev:  # NOTE: remove this
            f = list(self.database['content_meta'].find({'fname': fname},
                                                           projection={"_id": False}))
        else:
            f = [i for i in self.content_meta if i['fname'] == fname]
        if len(f) > 0:
            return f[0]

    def generate_content_url(self, fname, count=100):
        "Generate a one time download link for the file"
        newlink = randstring(50) + '.' + fname.split('.')[-1]
        data = {'fname': fname, 'newlink': newlink, 'count': count}
        if not self.dev:  # NOTE: remove this
            self.database['content_links'].insert_one(data)
        else:
            self.content_links.append(data)
        return data['newlink']

    def content_get_fname_for_link(self, link):
        "Get the filename for this link and remove it from database"
        fname = None
        if not self.dev:  # NOTE: remove this
            q = {'newlink': link}
            fnames = list(self.database.content_links.find(q))
            if len(fnames) >= 1:
                data = self.database.content_links.find_one_and_delete(q)
                if data['count'] >= 1:  # put it back if not yet done
                    data['count'] -= 1
                    self.database.content_links.insert_one(data)
                fname = data['fname']
        else:
            fnames = [i for i in self.content_links if i['newlink'] == link]
            if len(fnames) == 1:
                self.content_links = [i for i in self.content_links
                                      if i['newlink'] != link]
                data = fnames[0]
                if data['count'] >= 1:  # put it back if not yet done
                    data['count'] -= 1
                    self.content_links.append(data)
                fname = data['fname']
        return fname

    def user_pwd_present(self, email, pwd):
        "Is this user pwd combo present?"
        data = dict(email=email, pwd=pwd)
        if not self.dev:  # NOTE: remove this
            count = self.database.users.find(data).count()
            return count > 0
        else:
            return len(list(1 for i in self.users
                       if i['email'] == email and i['pwd'] == pwd)) > 0

    def category_insert(self, category):
        "Insert a new category"
        if not self.dev:  # NOTE: remove this
            self.database.categories.insert_one(category)
        else:
            self.categories.append(category)

    def category_delete(self, catid):
        "Deletes this category and it's subtree"
        if not self.dev:  # NOTE: remove this
            self.database.categories.find_one_and_delete({'id': catid})
        else:
            cat = [i for i in self.categories
                   if i['id'] != catid]
            self.categories = cat

    def category_data(self, catid):
        "Returns details about the category"
        d = None
        if not self.dev:  # NOTE: remove this
            x = list(self.database.categories.find({'id': catid}))
            if len(x) > 0:
                d = x[0]
                d.pop('_id')
        else:
            x = [i for i in self.categories if i['id'] == catid]
            if len(x) > 0:
                d = dict(x[0])
        return d

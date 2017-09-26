import os
from pymongo import MongoClient


class DB:
    """
    The database class to quietly abstract away all differences
    between using mongo and a RAM db
    """
    def __init__(self):
        if os.environ.get('USE_MONGO'):
            MONGO_URL = os.environ.get('MONGO_URL')
            self.client = MongoClient(MONGO_URL)
            self.dev = False
            print('Using mongo')
        else:
            print('Using RAM db')
            self.dev = True
            self.tokens = {}
            self.users = []
            self.forms = []
            self.responses = []
            self.admins = []

    def is_admin(self, uemail):
        "Is this member present in the admin list"
        if self.user_present(uemail):
            if not self.dev:
                c = self.client.aang.admins.find({'email': uemail}).count()
                return c > 0
            else:
                return uemail in self.admins

    def add_admin(self, uemail):
        "Add an admin"
        if self.user_present(uemail) and not self.is_admin(uemail):
            if not self.dev:
                self.client.aang.admins.insert_one({'email': uemail})
            else:
                self.admins.append(uemail)

    def delete_admin(self, uemail):
        "Remove an admin"
        if self.is_admin(uemail):
            if not self.dev:
                self.client.aang.admins.find_one_and_delete({'email': uemail})
            else:
                self.admins.remove(uemail)

    def form_data(self, formid):
        "Return form for this formid"
        if self.form_present(formid):
            if not self.dev:
                return self.client.aang.forms.find_one({'formid': formid})
            else:
                return [f for f in self.forms
                        if f['formid'] == formid][0]

    def form_list(self, email=None):
        "List forms available for this user"
        if not self.dev:
            frms = self.client.aang.forms.find()
            return [f['formid'] for f in frms]
        else:
            return [f['formid'] for f in self.forms]

    def form_present(self, formid):
        "Is this form present?"
        if not self.dev:  # NOTE: remove this
            count = self.client.aang.forms.find({'formid': formid}).count()
            return count == 1
        else:
            count = [f for f in self.forms
                     if f['formid'] == formid]
            return len(count) == 1

    def form_insert(self, form):
        "Insert a form into the database"
        if not self.form_present(form['formid']):
            if not self.dev:  # NOTE: remove this
                self.client.aang.forms.insert_one(form)
            else:
                self.forms.append(form)

    def form_remove(self, formid):
        "Remove form from database"
        if self.form_present(formid):
            if not self.dev:  # NOTE: remove this
                self.client.aang.forms.find_one_and_delete({'formid': formid})
            else:
                self.forms = [i for i in self.forms
                              if i['formid'] != formid]

    def token_present(self, token):
        "Is the token available in the database?"
        if not self.dev:  # NOTE: remove this
            count = self.client.aang.tokens.find({'token': token}).count()
            return count == 0
        else:
            token = self.tokens.get(token)
            return token is not None

    def token_insert(self, token, user_email):
        "Insert user into logged in token base"
        if not self.dev:  # NOTE: remove this
            self.client.aang.tokens.insert_one({'token': token,
                                                'email': user_email})
        else:
            self.tokens[token] = user_email

    def token_remove(self, token):
        "Remove a token"
        if self.token_present(token):
            if not self.dev:  # NOTE: remove this
                self.client.aang.tokens.find_one_and_delete({"token": token})
            else:
                self.tokens.pop(token)

    def token_data(self, token):
        if self.token_present(token):
            if not self.dev:
                em = self.client.aang.tokens.find_one({'token': token})
                return em
            else:
                return {'token': token, 'email': self.tokens[token]}

    def user_insert(self, user):
        "Insert a user into the database"
        data = dict(email=user['email'],
                    pwd=user['pwd'],
                    name=user['name'],
                    aadhaar=user['address'],
                    mobile=user['mobile'],
                    groups=[])
        if not self.user_present(data['email']):
            if not self.dev:  # NOTE: remove this
                self.client.aang.users.insert_one(data)
            else:
                self.users.append(data)

    def user_present(self, user_email):
        "Is user already existing?"
        data = dict(email=user_email)
        if not self.dev:  # NOTE: remove this
            count = self.client.aang.users.find(data).count()
            return count > 0
        else:
            return len(list(1 for i in self.users
                       if i['email'] == user_email)) > 0

    def user_pwd_present(self, email, pwd):
        "Is this user pwd combo present?"
        data = dict(email=email, pwd=pwd)
        if not self.dev:  # NOTE: remove this
            count = self.client.aang.users.find(data).count()
            return count > 0
        else:
            return len(list(1 for i in self.users
                       if i['email'] == email and i['pwd'] == pwd)) > 0

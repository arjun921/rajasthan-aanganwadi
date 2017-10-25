import os
import random
from pymongo import MongoClient


class DB:
    """
    The database class to quietly abstract away all differences
    between using mongo and a RAM db
    """
    def __init__(self):
        data = dict(email='arjoonn.94@gmail.com',
                    pwd='hash',
                    name='arjoonn',
                    address='india',
                    mobile='123')
        if os.environ.get('USE_MONGO'):
            MONGO_URL = os.environ.get('MONGO_URL')
            self.client = MongoClient(MONGO_URL)
            self.dev = False
            print('Using mongo')
            if self.client.aang.admins.find().count() == 0:
                self.user_insert(data)
                self.add_admin(data['email'])
            for k in ['tokens', 'users', 'forms', 'responses',
                      'admins', 'content_links']:
                d = {'column': 'initiator'}
                self.client.aang[k].insert_one(d)
                self.client.aang[k].find_one_and_delete(d)

        else:
            print('Using RAM db')
            self.dev = True
            self.tokens = {}
            self.users = []
            self.forms = []
            self.responses = []
            self.admins = []
            self.content_links = []

            # add initial admin
            if len(self.admins) == 0:
                self.user_insert(data)
                self.add_admin(data['email'])
        if len(self.form_list()) == 0:
            data = {'formid': 'CandyForm',
                    'title': 'CandyForm',
                    'fields': [
                                {'id': '1',
                                 'label': 'name',
                                 'kind': 'text'},
                                {'id': '2',
                                 'label': 'email',
                                 'kind': 'text'},
                                {'id': '3',
                                 'label': 'what candies do you want?',
                                 'kind': 'checkbox',
                                 'misc': [{'subLabel': 'candy1',
                                           'subID': 'candy1'},
                                          {'subLabel': 'candy2',
                                           'subID': 'candy2'}]},
                                {'id': '4',
                                 'label': 'how do you want to pay?',
                                 'kind': 'radio',
                                 'misc': [{'subLabel': 'cash',
                                           'subID': '4_candy1'},
                                          {'subLabel': 'dishes',
                                           'subID': '4_candy2'},
                                          {'subLabel': 'card',
                                           'subID': '4_candy3'}]},
                                ],
                    }
            self.form_insert(data)

    def response_submit(self, data):
        "submit a form response"
        if not self.dev:
            self.client.aang.responses.insert_one(data)
        else:
            self.responses.append(data)

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
                f = self.client.aang.forms.find_one({'formid': formid})
                F = {k: v for k, v in f.items() if k[0] != '_'}
                return F
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
            return count != 0
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
        "Return email of person to whom token belongs"
        if self.token_present(token):
            if not self.dev:
                em = self.client.aang.tokens.find_one({'token': token})
                return em
            else:
                return {'token': token, 'email': self.tokens[token]}

    def user_delete(self, email):
        "Remove a user"
        if self.user_present(email):
            if not self.dev:
                self.client.aang.users.find_one_and_delete({'email': email})
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

    def generate_content_url(self, fname):
        "Generate a one time download link for the file"
        newlink = ''.join(random.choice('abcdefghijklmnopqrstuvwxyz')
                          for _ in range(50)) +'.'+ fname.split('.')[-1]
        data = {'fname': fname, 'newlink': newlink}
        if not self.dev:  # NOTE: remove this
            self.client.aang['content_links'].insert_one(data)
        else:
            self.content_links.append(data)
        return data['newlink']

    def content_get_fname_for_link(self, link):
        "Get the filename for this link and remove it from database"
        fname = None
        if not self.dev:  # NOTE: remove this
            q = {'newlink': link}
            fnames = list(self.client.aang.content_links.find(q))
            if len(fnames) >= 1:
                self.client.aang.content_links.find_one_and_delete(q)
                fname = fnames[0]['fname']
        else:
            fnames = [i for i in self.content_links if i['newlink'] == link]
            if len(fnames) == 1:
                self.content_links = [i for i in self.content_links
                                      if i['newlink'] != link]
                fname = fnames[0]['fname']
        return fname

    def user_pwd_present(self, email, pwd):
        "Is this user pwd combo present?"
        data = dict(email=email, pwd=pwd)
        if not self.dev:  # NOTE: remove this
            count = self.client.aang.users.find(data).count()
            return count > 0
        else:
            return len(list(1 for i in self.users
                       if i['email'] == email and i['pwd'] == pwd)) > 0

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
            self.client.aang.tokens.insert_one(user_email)
        else:
            self.tokens[token] = user_email

    def token_remove(self, token):
        "Remove a token"
        if self.token_present(token):
            if not self.dev:  # NOTE: remove this
                self.client.aang.tokens.find_one_and_delete({"token": token})
            else:
                self.tokens.pop(token)

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

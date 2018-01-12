import requests
from tqdm import tqdm


root = 'http://localhost:8000'


def hit(api, json):
    url = root + '/' + api.lstrip('/')
    resp = requests.post(url, json=json)
    return resp


print('Logging in admin')
admin = {'email': 'arjoonn.94@gmail.com',
         'pwd': '2328904461', 'token': '1'*100}
assert hit('/user/login', json=admin).status_code == 200
print('Done')


# ###############################FORMS #######################

data = {'formid': 'Dummy Form',
        'title': 'Dummy Form 1',
        'fields': [
                    {'id': '1',
                     'label': 'name',
                     'kind': 'text'},
                    {'id': '2',
                     'label': 'email',
                     'kind': 'text'},
                    {'id': '3',
                     'label': 'What do you need at school?',
                     'kind': 'checkbox',
                     'misc': [{'subLabel': 'more books',
                               'subID': 'books'},
                              {'subLabel': 'access to internet',
                               'subID': 'internet'}]},
                    {'id': '4',
                     'label': 'is aanganwadi regular?',
                     'kind': 'radio',
                     'misc': [{'subLabel': 'yes',
                               'subID': 'yes'},
                              {'subLabel': 'no',
                               'subID': 'no'},
                              ]},
                    {'id': '5',
                     'label': 'Pick a Date',
                     'kind': 'datepicker'},
                    {'id': '6',
                     'label': 'Pick a Time',
                     'kind': 'timepicker'},
                    {'id': '7',
                     'label': 'Select something',
                     'kind': 'select',
                     'misc': [{'subVal': 'something1',
                               'subLabel': 'something1'},
                              {'subVal': 'something2',
                               'subLabel': 'something2'}
                              ]},
                    {'id': '8',
                     'label': 'Pick a number between 1 and 10',
                     'kind': 'range',
                     'misc': [{'min': 1,
                              'max': 10}]},
                    ],
        }
print('Creating dummy form')
data['token'] = admin['token']
r = hit('/form/create', data)
assert r.status_code == 200
print('Done')
# ###############################CATEGORIES #######################

first_level = ['Supplementary Nutrition', 'Early Childhood Education',
               'Health Check Up']
second_level = ['Activities', 'Text']
content = ['laadki.mp3', 'Proposal.pdf', 'rajasthan.mp4']


def makecat(id, title, contains):
    d = {"id": id, "title": title, "contains": contains,
         "token": admin['token']}
    r = hit("/category/create", d)
    assert r.status_code == 200, r.text


root_contains = []
for i, one in enumerate(tqdm(first_level)):
    f_contains = []
    for j, two in enumerate(tqdm(second_level)):
        id = '_' + str(i) + '_' + str(j)
        makecat(id, two, [])
        if j == 0:
            fname = content[i]
            files = {'upload': open('UPLOAD/'+fname, 'rb')}
            values = {'token': admin['token'],
                      "title": 'Sample '+fname,
                      "desc": "Sample file for demo" + fname,
                      "parent": id}
            r = requests.post(root + '/content/create',
                              files=files,
                              data=values)
            assert r.status_code == 200
        f_contains.append(id)
    id = '_' + str(i)
    makecat(id, one, f_contains)
    root_contains.append(id)

print('Logging out')
makecat("_ROOT_", "Home", root_contains)
assert hit('/user/logout', json=admin).status_code == 200
print('Done')

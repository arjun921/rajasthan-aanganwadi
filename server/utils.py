import os
import pandas as pd
from db import DB, randstring


db = DB()
upath = os.path.join(os.getcwd(), 'UPLOAD')
adminstatic = os.path.join(os.getcwd(), 'ADMINSTATIC')
whitelist = 'abcdefghijklmnopqrstuvwxyz1234567890'


if not os.path.exists(upath):
    os.mkdir(upath)


def doitc_file_to_generalized_format(path):
    """
    Turn a DoIT&C formatted excel file to a generalized
    excel format for content tree organization
    """
    df = pd.read_excel(path)
    df['TreeColumnsMarker'] = None
    df['filehash'] = None
    df.columns = [i.strip() for i in df.columns]

    d1 = df[['filehash', 'Filename',
             # Meta data
             'Medium', 'Content Title', 'VideoGroup Name',
             'VideoSubTopic Title', 'VideoGroupOrder', 'Position',
             # tree path marker
             'TreeColumnsMarker',
             # tree path
             'Tab', 'Category', 'Type', 'Subtype']].copy()
    d1['Language'] = 'English'
    d1 = d1[['filehash', 'Filename',
             # Meta data
             'Medium', 'Content Title', 'VideoGroup Name',
             'VideoSubTopic Title', 'VideoGroupOrder', 'Position',
             # tree path marker
             'TreeColumnsMarker',
             # tree path
             'Language', 'Tab', 'Category', 'Type', 'Subtype']]
    d2 = df[['filehash', 'Filename',
             # Meta data
             'Medium',
             'Content Title (Hindi)', 'VideoGroup Name (Hindi)',
             'VideoSubTopic (Hindi)', 'VideoGroupOrder', 'Position',
             # tree path marker
             'TreeColumnsMarker',
             # tree path
             'Tab (Hindi)', 'Category (Hindi)',
             'Type (Hindi)', 'Subtype (Hindi)',
             ]].copy()
    d2['Language'] = 'हिंदी '
    d2 = d2[['filehash', 'Filename',
             # Meta data
             'Medium',
             'Content Title (Hindi)', 'VideoGroup Name (Hindi)',
             'VideoSubTopic (Hindi)', 'VideoGroupOrder', 'Position',
             # tree path marker
             'TreeColumnsMarker',
             # tree path
             'Language', 'Tab (Hindi)', 'Category (Hindi)',
             'Type (Hindi)', 'Subtype (Hindi)',
             ]]
    c2 = [i.replace('(Hindi)', '').strip() for i in d2.columns]
    d2.columns = c2
    df = pd.concat([d1, d2])
    df = df[['filehash', 'Filename',
             # Meta data
             'Medium', 'Content Title', 'VideoGroup Name',
             'VideoSubTopic Title', 'VideoGroupOrder', 'Position',
             # tree path marker
             'TreeColumnsMarker',
             # tree path
             'Language', 'Tab', 'Category', 'Type', 'Subtype']]
    df.to_excel(path, index=False)


def is_json_readable(request):
    "Is the json readable in this request?"
    try:
        json = request.json
        if json is None:
            raise Exception('Json unreadable')
    except:
        return False
    else:
        return True


def get_savepath(fname):
    "Return save path given a file name"
    global upath
    return os.path.join(upath, fname)


def clean_token(token):
    "Clean token to hold only alphanumeric"
    global whitelist
    token = ''.join(i for i in token if i in whitelist)
    return token


def del_uploaded(fname):
    "delete an uploaded file"
    path = os.path.join(upath, fname)
    if os.path.exists(path):
        os.remove(path)


if __name__ == '__main__':
    doitc_file_to_generalized_format('b.xlsx')

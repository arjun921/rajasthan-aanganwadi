import os
import math
import pandas as pd
from db import DB, randstring


db = DB()
upath = os.path.join(os.getcwd(), 'UPLOAD')
adminstatic = os.path.join(os.getcwd(), 'ADMINSTATIC')
whitelist = 'abcdefghijklmnopqrstuvwxyz1234567890'


if not os.path.exists(upath):
    os.mkdir(upath)


class ContentNotAvailable(Exception):
    pass


def make_sure_root_is_there():
    """
    This function create the ROOT caregory if it does not Exist
    """
    if db.category_data("_ROOT_") is None:
        db.category_insert({"id": "_ROOT_",
                            "title": "⌂",
                            "contains": []})


def solidify_path(row, path_columns):
    """
    If the path does not exist, create it to the end.
    """
    make_sure_root_is_there()
    id_path = ['_ROOT_']
    for col in path_columns:
        if not isinstance(row[col], str):
            break
        current_id = id_path[-1]
        cat = db.category_data(current_id)
        contains = [db.category_data(c) for c in cat['contains']]
        contains = [i for i in contains if i is not None]
        if row[col] in [i['title'] for i in contains]:
            ident = [i['id'] for i in contains if i['title'] == row[col]][0]
            id_path.append(ident)
        else:
            new_cat = {"title": row[col],
                       "id": "_"+randstring(50),
                       "contains": []}
            db.category_insert(new_cat)
            p = db.category_data(current_id)
            if p is not None:
                p['contains'].append(new_cat['id'])
                # update
                db.category_delete(current_id)
                db.category_insert(p)
            id_path.append(new_cat['id'])
    return id_path


def set_attrs(row, cols, meta):
    """
    Set attributes for this meta
    """
    new_meta = dict(meta)
    for col in cols:
        if col == 'fname':
            continue
        v = row[col]
        v = None if isinstance(v, float) and math.isnan(v) else v
        new_meta[col] = v
    fname = meta['fname']
    db.content_meta_delete(fname)
    db.content_meta_create(fname, new_meta)
    return new_meta


def generate_tree_from_excel_file(path):
    """
    Reset the current tree and generate it from the provided
    excel file path
    """
    df = pd.read_excel(path)
    confirm_all_content_is_uploaded(df)
    tree_start = list(df.columns).index('TreeColumnsMarker') + 1
    path_columns = list(df.columns)[tree_start:]
    attr_columns = list(df.columns)[2: tree_start-1]
    for _, row in df.iterrows():
        if not math.isnan(row['filehash']):
            meta = db.content_meta_data(row['filehash'])
        elif row['Filename'].strip() != '':
            meta = db.content_meta_data(row['Filename'],
                                        use_original=True)
        # Set attributes
        meta = set_attrs(row, attr_columns, meta)
        # Content has been identified.
        solid_path = solidify_path(row, path_columns)
        parent = solid_path[-1]
        meta['parent'] = parent
        db.content_meta_delete(meta['fname'])
        db.content_meta_create(meta['fname'], meta)
        data = db.category_data(parent)
        data['contains'].append(meta['fname'])
        db.category_delete(parent)
        db.category_insert(data)


def confirm_all_content_is_uploaded(df):
    "Given a dataframe, confirm all content is uploaded and exists"
    for _, row in df.iterrows():
        if not math.isnan(row['filehash']):
            if db.content_meta_data(row['filehash']) is None:
                raise ContentNotAvailable(row['filehash'])
        elif row['Filename'].strip() != '':
            if db.content_meta_data(row['Filename'],
                                    use_original=True) is None:
                raise ContentNotAvailable(row['Filename'])
        else:
            raise ContentNotAvailable("Both filehash and filename are empty")


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
    d1['title'] = d1['Content Title']
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
    d2['title'] = d2['Content Title (Hindi)']
    c2 = [i.replace('(Hindi)', '').strip() for i in d2.columns]
    d2.columns = c2
    df = pd.concat([d1, d2])
    df = df[['filehash', 'Filename', 'title',
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
    doitc_file_to_generalized_format('tree.xlsx')
    generate_tree_from_excel_file("tree.xlsx")

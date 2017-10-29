import json

CAT = []


def self.category_insert(x):
    CAT.append(x)


root_contains = []
categories = ['Supplementary Nutrition',
              'Early Childhood Education',
              'Growth Monitoring', 'Healthcare',
              'Nutrition Education', 'Health Check Up']
subcategories = ['Syllabus', 'Curriculum',
                 'Activity Bank', 'Activity Books',
                 'Child assessment card', 'ECE Certificate',
                 'Time table']
activities = ['Physical Development', 'CognitiveDevelopment',
              'LinguisticDevelopment',
              'Social Emotional Development',
              'Creative Development']

for catid, category in enumerate(categories):
    catid = '_' + str(catid)
    root_contains.append(catid)
    category = {'id': catid, 'title': category}
    category_contains = []
    for subcatid, sc in enumerate(subcategories):
        subcatid = catid + '_' + str(subcatid)
        category_contains.append(subcatid)
        subcat_contains = []
        for actid, act in enumerate(activities):
            actid = subcatid + '_' + str(actid)
            subcat_contains.append(actid)
            activity = {'id': actid, 'title': act,
                        'contains': ['laadki.mp3',
                                     'Proposal.pdf',
                                     'rajasthan.mp4']}
            self.category_insert(activity)
        sc = {'id': subcatid, 'title': sc, 'contains': subcat_contains}
        self.category_insert(sc)
    category['contains'] = category_contains
    self.category_insert(category)
root = {'title': 'ROOT',
        'id': '_ROOT_',
        'contains': root_contains}
self.category_insert(root)

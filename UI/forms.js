create = {
  'formid': 'f1',
  'title': 'Form 1',
  'fields': [{
      'id': '1',
      'label': 'Text Input',
      'kind': 'text',
      'misc': []
    },
    {
      'id': '2',
      'label': 'Radio Question',
      'kind': 'radio',
      'misc': [{
        'subLabel':'Red',
        'subID':'red'
      },
      {
        'subLabel':'Green',
        'subID':'green'
      }
    ]
    },
    {
      'id': '3',
      'label': 'name',
      'kind': 'checkbox',
      'misc': [{
        'subLabel':'Red',
        'subID':'red'
      },
      {
        'subLabel':'Green',
        'subID':'green'
      }]
    },
    {
      'id': '4',
      'label': 'name',
      'kind': 'dropdown',
      'misc': [{
        'subLabel':'Red',
        'subID':'red'
      },
      {
        'subLabel':'Green',
        'subID':'green'
      }]
    },
    {
      'id': '5',
      'label': 'name',
      'kind': 'range',
      'misc': [{
        'min':'0',
        'max':'100'
      }]
    },
    {
      'id': '6',
      'label': 'name',
      'kind': 'datepicker',
      'misc': []
    },
    {
      'id': '7',
      'label': 'name',
      'kind': 'timepicker',
      'misc': []
    }
  ],
  "token": Cookies.get('currenttoken')
};


text
checkbox
radio
range
dropdown
datepicker
timepicker

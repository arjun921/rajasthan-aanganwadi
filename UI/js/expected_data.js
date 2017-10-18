//<------ Remove in production BEGIN
var s = "f1";

create = {
  'formid': 'f1',
  'title': 'Form 1',
  'fields': [{
      'id': '1',
      'label': 'Text Input',
      'kind': 'text',
      'misc': [{
        'spec': 'text'
      }]
    },
    {
      'id': '2',
      'label': 'Password Input',
      'kind': 'text',
      'misc': [{
        'spec': 'password'
      }]
    },
    {
      'id': '3',
      'label': 'Radio Question',
      'kind': 'radio',
      'misc': [{
          'subLabel': 'Red',
          'subID': 'red'
        },
        {
          'subLabel': 'Green',
          'subID': 'green'
        }
      ]
    },
    {
      'id': '4',
      'label': 'Checkbox Question',
      'kind': 'checkbox',
      'misc': [{
          'subLabel': 'Red',
          'subID': 'red1'
        },
        {
          'subLabel': 'Green',
          'subID': 'green1'
        }
      ]
    },
    {
      'id': '5',
      'label': 'Question for Select/Dropwdown',
      'kind': 'select',
      'misc': [{
          'subLabel': 'Select 1',
          'subVal': '1'
        },
        {
          'subLabel': 'Green',
          'subVal': 'green'
        }
      ]
    },
    {
      'id': '6',
      'label': 'Question for Range',
      'kind': 'range',
      'misc': [{
        'min': '0',
        'max': '100'
      }]
    },
    {
      'id': '7',
      'label': 'Question for Datepicker',
      'kind': 'datepicker',
      'misc': []
    },
    {
      'id': '8',
      'label': 'Q for time picker',
      'kind': 'timepicker',
      'misc': []
    }
  ],
  "token": Cookies.get('currenttoken')
};

forma = {
    "forms": [
        "CandyForm",
        "f1"
    ]
}
formslist = {
  'forms': [{
      'formid': 'Form 1'
    },
    {
      'formid': 'Google'
    },
    {
      'formid': 'Facebook'
    }
  ]
}
//Remove in production ---------------------->

//
// [.]text
// [.]radio
// [.]checkbox
// [.]select
// []range
// []datepicker
// []timepicker

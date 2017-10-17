//<------ Remove in production BEGIN
var s = "f1";

create = {
  'formid': 'f1',
  'title': 'Form 1',
  'fields': [
    {
      'id': '1',
      'label': 'Text Input',
      'kind': 'text',
      'misc': [{'spec':'text'}]
    },
    {
      'id': '2',
      'label': 'Password Input',
      'kind': 'text',
      'misc': [{'spec':'password'}]
    },
    {
      'id': '2',
      'label': 'Radio Question',
      'kind': 'radio',
      'misc': [{
          'subLabel': 'Red',
          'subID': 'red'
        },
        {
          'subLabel': 'Green',
          'subID': 'green'
        }]
    }
    ,
    {
      'id': '3',
      'label': 'Checkbox Question',
      'kind': 'checkbox',
      'misc': [{
          'subLabel': 'Red',
          'subID': 'red'
        },
        {
          'subLabel': 'Green',
          'subID': 'green'
        }
      ]
    }
    ,{
      'id': '4',
      'label': 'name',
      'kind': 'dropdown',
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
      'id': '5',
      'label': 'name',
      'kind': 'range',
      'misc': []
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

formslist = {
  'forms': [{
      'href': '',
      'formid': 'Form 1'
    },
    {
      'href': 'http://google.com',
      'formid': 'Google'
    },
    {
      'href': 'http://facebook.com',
      'formid': 'Facebook'
    }
  ]
}
//Remove in production ---------------------->

//
// [.]text
// []radio
// []checkbox
// []range
// []dropdown
// []datepicker
// []timepicker

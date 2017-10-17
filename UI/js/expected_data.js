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
          'subID': 'red1'
        },
        {
          'subLabel': 'Green',
          'subID': 'green1'
        }
      ]
    }
    ,{
      'id': '4',
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
      'id': '5',
      'label': 'Question for Range',
      'kind': 'range',
      'misc': [{'min':'0',
      'max':'100'}]
    },
    {
      'id': '6',
      'label': 'Question for Datepicker',
      'kind': 'datepicker',
      'misc': []
    },
    {
      'id': '7',
      'label': 'Q for time picker',
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
// [.]radio
// [.]checkbox
// [.]select
// []range
// []datepicker
// []timepicker

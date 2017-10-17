Rajasthan
=========

App and server code for Aanganwadi.

Expected Json for creating forms:

```json
{
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
        }
      ]
    },
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
    },
    {
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
      'misc': [{
        'min': '0',
        'max': '100'
      }]
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
}
```

Object being sent for `form/submit`

`Token cut short to accomodate`

```javascript
sentDataJson = {
  "token": "alyosn4w4apq683i221kd9iargxah",
  "formid": "f1",
  "data": [{"id": "1","value": "asasdaasda"},
  {"id": "2","value": "123123123123asdas"},
  {"id": "3","value": "red"},
  {"id": "4","value": "","misc": [{"id": "red1","value": true}, {"id": "green1","value": false}]},
  {"id": "5","value": "green"}, 
  {"id": "6","value": "15"}, 
  {"id": "7","value": "17 October, 2017"}, 
  {"id": "8","value": "03:20"}]
}
```


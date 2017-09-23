Rajasthan
=========


App and server code for Aanganwadi.


Working API
----------

- `/user/login`
- `/user/logout`
- `/user/create`



TESTS
-----

To test heroku environment.

```bash
cd server && python server.py
export TEST_HEROKU='true' && pytest test_.py
```

To test the local app `pytest test_.py`


DOCS
----

Run `cd server/docs && make html` to build the documentation. It is then available in `server/docs/_build/html/index.html`


NOTES
-----

- To avoid `https strip` attacks, all endpoints never send sensitive data to the client.
- The server must be set up with `https`

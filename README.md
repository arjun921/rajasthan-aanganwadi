Rajasthan
=========

Component   |   Coverage
------------|-------------
Server      |[![pipeline status](https://gitlab.com/theSage21/rajasthan/badges/master/pipeline.svg)](https://gitlab.com/theSage21/rajasthan/commits/master)


App and server code for Aanganwadi. Relevand documents like sprint reports can be found on [Google Drive](https://drive.google.com/drive/folders/0B9peBTEXP4UdSWRmR0tKb01zaGM?usp=sharing)


Working API
----------

- `/user/login`
- `/user/logout`
- `/user/create`
- `/user/delete`
- `/form`
- `/form/list`
- `/form/create`
- `/form/delete`
- `/form/submit`
- `/content/create`
- `/content/delete`
- `/content/list`
- `/content`




TESTS
-----

To test heroku environment. We have to export the variable otherwise pytest does not pick it up.

```bash
cd server && python server.py
export TEST_HEROKU='true' && pytest tests
```

To test the local app `pytest tests`

To make the server use Mongo as a server instead of the in-ram database invoke the `server.py` file with proper environment variables set.

```bash
cd server && USE_MONGO=1 MONGODB_URI=mongodb://127.0.0.1:27017/aang python server.py
```

DOCS
----

Run `cd server/docs && make html` to build the documentation. It is then available in `server/docs/_build/html/index.html`


NOTES
-----

- To avoid `https strip` attacks, all endpoints never send sensitive data to the client.
- The server must be set up with `https`

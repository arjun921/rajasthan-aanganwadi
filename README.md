Rajasthan
=========

Component   |   Coverage
------------|-------------
Server      |[![pipeline status](https://gitlab.com/theSage21/rajasthan/badges/master/pipeline.svg)](https://gitlab.com/theSage21/rajasthan/commits/master)


App and server code for Aanganwadi. Relevant documents like sprint reports can be found on [Google Drive](https://drive.google.com/drive/folders/0B9peBTEXP4UdSWRmR0tKb01zaGM?usp=sharing). Ask for access if you do not have it.


Working API
----------

- `/user`
- `/user/login`
- `/user/logout`
- `/user/create`
- `/user/delete`
- `/form`
- `/form/list`
- `/form/create`
- `/form/delete`
- `/form/submit`
- `/form/responses`
- `/content`
- `/content/list`
- `/content/create`
- `/content/delete`
- `/category`
- `/category/create`
- `/category/delete`
- `/category/reorganize`
- `/report`



Endpoint Tests
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

Documentation about API
----

Run `cd server/docs && make html` to build the documentation. It is then available in `server/docs/_build/html/index.html`


Initial content setup
--------

Default demo entries need to be inserted with `python dummy_setup.py`.

The data provided by DoIT&C can be uploaded by using the scripts present at [this gist](https://gist.github.com/theSage21/5c73da683be8751e19e8558c75c64638). Please not that the script does not upload MP4 and PNG. Those have to be manually uploaded in their respective categories.

Content Reordering
---------------

Already uploaded content can be reorganized by uploading an excel file via ADMIN in the format similar to [given requirements file](server/tree.xlsx).

NOTES
-----

- To avoid `https strip` attacks, all endpoints never send sensitive data to the client.
- The server must be set up with `https`
- The server's Admin page contains a brief tutorial of how to use the Admin page.
- Admin setup requires inputs once. After that it works without prompt. On not receiving such input it prceeds with the defaults.

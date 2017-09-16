Rajasthan
=========


App and server code for Aanganwadi.


API
---

- `/user/login`
    - This needs JSON in POST with 'uname', 'pwd', 'token' keys necessary.
    - token must be 100 chars in length, composed of alphabets(upper and/or lower) and numbers only.
    - successful login is indicated by 200 status code
- `/user/logout`
    - This needs JSON in POST with 'token' keys.
    - token must be 100 chars in length, composed of alphabets(upper and/or lower) and numbers only.
    - successful logout is indicated by 200 status code



NOTES
-----

- To avoid `https strip` attacks, all endpoints never send sensitive data to the client.
- The server must be set up with `https`

sandcastle
==========

Tidepool's server for tracking provenance of all "uploads."

## Install

    "url": "git://github.com/tidepool-org/sandcastle.git"
    npm install git://github.com/tidepool-org/sandcastle.git
    # or
    git clone git://github.com/tidepool-org/sandcastle.git

## Run
```bash
+ cat .example_env
PORT=9999
BASE=./out/
++ cat .example_env
+ env PORT=9999 BASE=./out/ node server.js
main
installing routes
Registering server wide listeners /home/bewest/src/tidepool/sandcastle/node_modules/restify-git-json/lib/handlers/users/defaultUser.js
REGISTERING /home/bewest/src/tidepool/sandcastle/node_modules/restify-git-json/lib/handlers/users/defaultUser.js
listening on restify http://0.0.0.0:9999
```


### Environment variables

See `env.js` for all environment variable handling.

* **PORT** - required
* **BASE** - where to host "bare" git repos.

#### SSL

Set these environment variables.
* **SERVER_KEY**
* **SERVER_CERTIFICATE**


## Usage

#### Installed routes
```bash
+ json
+ curl -ivs localhost:9999/help/
* About to connect() to localhost port 9999 (#0)
*   Trying 127.0.0.1... connected
> GET /help/ HTTP/1.1
> User-Agent: curl/7.22.0 (x86_64-pc-linux-gnu) libcurl/7.22.0 OpenSSL/1.0.1 zlib/1.2.3.4 libidn/1.23 librtmp/2.3
> Host: localhost:9999
> Accept: */*
> 
< HTTP/1.1 200 OK
< Connection: close
< Content-Type: application/json
< Content-Length: 1229
< Date: Sat, 18 Jan 2014 03:03:01 GMT
< 
{ [data not shown]
* Closing connection #0
```
```javascript
[
  {
    "path": "/status",
    "version": "0.0.3",
    "middleware": 0,
    "method": "GET"
  },
  {
    "path": "/repos/:owner/:repo",
    "version": "0.0.3",
    "middleware": 4,
    "method": "GET"
  },
  {
    "path": "/repos/:owner/",
    "version": "0.0.3",
    "middleware": 3,
    "method": "GET"
  },
  {
    "path": "/repo/test",
    "version": "0.0.3",
    "middleware": 2,
    "method": "POST"
  },
  {
    "path": "/repos/:owner/:repo/upload",
    "version": "0.0.3",
    "middleware": 5,
    "method": "POST"
  },
  {
    "path": "/repos/:owner/:repo/git/refs",
    "version": "0.0.3",
    "middleware": 4,
    "method": "GET"
  },
  {
    "path": "/repos/:owner/:repo/git/refs/(.*)",
    "version": "0.0.3",
    "middleware": 4,
    "method": "GET"
  },
  {
    "path": "/repos/:owner/:repo/git/commits/:sha",
    "version": "0.0.3",
    "middleware": 4,
    "method": "GET"
  },
  {
    "path": "/repos/:owner/:repo/git/trees/:sha",
    "version": "0.0.3",
    "middleware": 4,
    "method": "GET"
  },
  {
    "path": "/repos/:owner/:repo/git/blobs/:sha",
    "version": "0.0.3",
    "middleware": 4,
    "method": "GET"
  },
  {
    "path": "/repos/:owner/:repo/raw/(.*)",
    "version": "0.0.3",
    "middleware": 4,
    "method": "GET"
  },
  {
    "path": "/help/",
    "version": "0.0.3",
    "middleware": 1,
    "method": "GET"
  },
  {
    "path": "/users/:user",
    "version": "0.0.3",
    "middleware": 7,
    "method": "GET"
  },
  {
    "path": "/users/:user/create",
    "version": "0.0.3",
    "middleware": 5,
    "method": "GET"
  },
  {
    "path": "/users/:user/create",
    "version": "0.0.3",
    "middleware": 5,
    "method": "POST"
  }
]
```

#### Create user
The system needs to tell sandcastle when to create new users.  This only needs
to be done once per user.

You can preview what will happen when you do:
```bash

+ curl -ivs localhost:9999/users/bewest
+ json
* About to connect() to localhost port 9999 (#0)
*   Trying 127.0.0.1... connected
> GET /users/bewest HTTP/1.1
> User-Agent: curl/7.22.0 (x86_64-pc-linux-gnu) libcurl/7.22.0 OpenSSL/1.0.1 zlib/1.2.3.4 libidn/1.23 librtmp/2.3
> Host: localhost:9999
> Accept: */*
> 
< HTTP/1.1 404 Not Found
< Connection: close
< Content-Type: application/json
< Content-Length: 207
< Date: Sat, 18 Jan 2014 03:05:38 GMT
< 
{ [data not shown]
* Closing connection #0
```
```javascript
{
  "msg": "no such user",
  "user": {
    "err": "does not exist",
    "profile": {
      "name": "bewest"
    },
    "description": "Hello world!",
    "url": "http://localhost:9999/users/bewest",
    "create": "http://localhost:9999/users/bewest/create"
  }
}
```

```bash
+ curl -ivs 'http://localhost:9999/users/bewest/create?name=bewest&email=bewest@tidepool.io'
+ json
* About to connect() to localhost port 9999 (#0)
*   Trying 127.0.0.1... connected
> GET /users/bewest/create?name=bewest&email=bewest@tidepool.io HTTP/1.1
> User-Agent: curl/7.22.0 (x86_64-pc-linux-gnu) libcurl/7.22.0 OpenSSL/1.0.1 zlib/1.2.3.4 libidn/1.23 librtmp/2.3
> Host: localhost:9999
> Accept: */*
> 
< HTTP/1.1 200 OK
< Connection: close
< Content-Type: application/json
< Content-Length: 64
< Date: Sat, 18 Jan 2014 03:08:12 GMT
< 
{ [data not shown]
* Closing connection #0
```

```javascript
{
  "name": "bewest",
  "handle": "bewest",
  "email": "bewest@tidepool.io"
}
```

Now POST


```bash
+ curl -ivs -XPOST 'http://localhost:9999/users/bewest/create?name=bewest&email=bewest@tidepool.io'
+ json
* About to connect() to localhost port 9999 (#0)
*   Trying 127.0.0.1... connected
> POST /users/bewest/create?name=bewest&email=bewest@tidepool.io HTTP/1.1
> User-Agent: curl/7.22.0 (x86_64-pc-linux-gnu) libcurl/7.22.0 OpenSSL/1.0.1 zlib/1.2.3.4 libidn/1.23 librtmp/2.3
> Host: localhost:9999
> Accept: */*
> 
< HTTP/1.1 201 Created
< Connection: close
< Content-Type: application/json
< Content-Length: 449
< Date: Sat, 18 Jan 2014 03:08:59 GMT
< 
{ [data not shown]
* Closing connection #0
```
```javascript
{
  "name": "bewest",
  "handle": "bewest",
  "email": "bewest@tidepool.io",
  "url": "http://localhost:9999/users/bewest",
  "updated": {
    "ref": "upload/incoming/2014-01-18-68939963/04edf6",
    "sha": "04edf68d14030f4effef2028856d6c203a4995cb",
    "head": {
      "commit": "04edf68d14030f4effef2028856d6c203a4995cb",
      "tree": {
        "tree": "443c47041f6e89d38044172a6482bc751abb28ee",
        "author": {
          "name": "bewest",
          "email": "bewest@tidepool.io"
        },
        "committer": null,
        "message": "initial profile creation"
      }
    }
  }
}
```

##### Track an upload
Once a user is created you can upload stuff.
```bash
+ curl -ivs -F web=@/home/bewest/src/diabetes//trailing-500.txt -F two=@env.js 'localhost:9999/repos/bewest/uploads/upload?author=Ben+West&message=upload+sugars'
+ json
* About to connect() to localhost port 9999 (#0)
*   Trying 127.0.0.1... connected
> POST /repos/bewest/uploads/upload?author=Ben+West&message=upload+sugars HTTP/1.1
> User-Agent: curl/7.22.0 (x86_64-pc-linux-gnu) libcurl/7.22.0 OpenSSL/1.0.1 zlib/1.2.3.4 libidn/1.23 librtmp/2.3
> Host: localhost:9999
> Accept: */*
> Content-Length: 24493
> Expect: 100-continue
> Content-Type: multipart/form-data; boundary=----------------------------cc2180df5dcb
> 
< HTTP/1.1 100 Continue
} [data not shown]
< HTTP/1.1 201 Created
< Connection: close
< Content-Type: application/json
< Content-Length: 869
< Date: Sat, 18 Jan 2014 03:13:36 GMT
< 
{ [data not shown]
* Closing connection #0
```

```javascript
{
  "err": null,
  "body": [
    {
      "ref": "upload/incoming/2014-01-18-69216887/cfe18c",
      "sha": "cfe18cacfffdae9fbeeba040bd5221752644cd9f",
      "head": {
        "commit": "cfe18cacfffdae9fbeeba040bd5221752644cd9f",
        "tree": {
          "tree": "eff7475c4f5e65bca3ec34617e067a7a1d251e5b",
          "author": {
            "name": "bewest",
            "email": "@localhost"
          },
          "committer": null,
          "message": "upload sugars",
          "url": "http://localhost:9999/repos/bewest/uploads/git/trees/eff7475c4f5e65bca3ec34617e067a7a1d251e5b"
        },
        "url": "http://localhost:9999/repos/bewest/uploads/git/commits/cfe18cacfffdae9fbeeba040bd5221752644cd9f"
      },
      "content": [
        "http://localhost:9999/repos/bewest/uploads/raw/upload/incoming/2014-01-18-69216887/cfe18c/trailing-500.txt",
        "http://localhost:9999/repos/bewest/uploads/raw/upload/incoming/2014-01-18-69216887/cfe18c/env.js"
      ],
      "url": "http://localhost:9999/repos/bewest/uploads/git/refs/heads/upload/incoming/2014-01-18-69216887/cfe18c"
    }
  ]
}
```

##### Fetch content
```bash
+ curl -ivs http://localhost:9999/repos/bewest/uploads/raw/upload/incoming/2014-01-18-69216887/cfe18c/trailing-500.txt http://localhost:9999/repos/bewest/uploads/raw/upload/incoming/2014-01-18-69216887/cfe18c/env.js
* About to connect() to localhost port 9999 (#0)
*   Trying 127.0.0.1... connected
> GET /repos/bewest/uploads/raw/upload/incoming/2014-01-18-69216887/cfe18c/trailing-500.txt HTTP/1.1
> User-Agent: curl/7.22.0 (x86_64-pc-linux-gnu) libcurl/7.22.0 OpenSSL/1.0.1 zlib/1.2.3.4 libidn/1.23 librtmp/2.3
> Host: localhost:9999
> Accept: */*
> 
< HTTP/1.1 200 OK
< Connection: close
< Content-Type: text/plain
< Content-Length: 23584
< Date: Sat, 18 Jan 2014 03:16:48 GMT
< 
{ [data not shown]
HTTP/1.1 200 OK
Connection: close
Content-Type: text/plain
Content-Length: 23584
Date: Sat, 18 Jan 2014 03:16:48 GMT

2011-03-09T08:38:01	242
2011-03-08T21:34:27	126
2011-03-08T19:30:37	94
2011-03-08T18:29:12	91
[ EDITED ]
2011-01-26T16:17:33	184
2011-01-26T15:46:49	156
2011-01-26T14:52:11	161
2011-01-26T13:42:33	78
2011-01-26T13:22:50	66
2011-01-* Closing connection #0
* About to connect() to localhost port 9999 (#0)
*   Trying 127.0.0.1... connected
> GET /repos/bewest/uploads/raw/upload/incoming/2014-01-18-69216887/cfe18c/env.js HTTP/1.1
> User-Agent: curl/7.22.0 (x86_64-pc-linux-gnu) libcurl/7.22.0 OpenSSL/1.0.1 zlib/1.2.3.4 libidn/1.23 librtmp/2.3
> Host: localhost:9999
> Accept: */*
> 
< HTTP/1.1 200 OK
< Connection: close
< Content-Type: text/plain
< Content-Length: 565
< Date: Sat, 18 Jan 2014 03:16:48 GMT
< 
{ [data not shown]
* Closing connection #0
26T13:15:35	55
2011-01-26T13:11:21	50
2011-01-26T13:06:37	53
2011-01-26T12:55:50	65
2011-01-26T12:47:59	80
2011-01-26T10:06:44	156
2011-01-26T09:21:37	152
2011-01-26T08:32:52	154
[ EDITED ]
2011-01-13T20:19:17	92
2011-01-13T18:29:58	85
2011-01-13T16:32:17	68
2011-01-13T15:42:08	108
2011-01-13T14:30:45	139
HTTP/1.1 200 OK
Connection: close
Content-Type: text/plain
Content-Length: 565
Date: Sat, 18 Jan 2014 03:16:48 GMT

module.exports = (function ( ) {
  var config = {
      // port for http server to bind to
      // port 6776 if undefined
      port: (process.env.PORT || 6776)
      // type of git backend to use
    , type: 'fs-db'
      // base directory to host bare repos in
    , base: (process.env.BASE || './out')
  };
  if (process.env.SERVER_KEY && process.env.SERVER_CERTIFICATE) {
    config.key = process.env.SERVER_KEY;
    config.certificate = process.env.SERVER_CERTIFICATE;
    var ssl = require('./lib/ssl');
    config = ssl(config);
  }
  return config;
})( );
```


#### Get list of uploads
```bash
+ json
+ curl -ivs http://localhost:9999/repos/bewest/uploads/git/refs
* About to connect() to localhost port 9999 (#0)
*   Trying 127.0.0.1... connected
> GET /repos/bewest/uploads/git/refs HTTP/1.1
> User-Agent: curl/7.22.0 (x86_64-pc-linux-gnu) libcurl/7.22.0 OpenSSL/1.0.1 zlib/1.2.3.4 libidn/1.23 librtmp/2.3
> Host: localhost:9999
> Accept: */*
> 
< HTTP/1.1 200 OK
< Connection: close
< Content-Type: application/json
< Content-Length: 970
< Date: Sat, 18 Jan 2014 03:20:10 GMT
< 
{ [data not shown]
* Closing connection #0
```
```javascript
{
  "err": null,
  "body": [
    {
      "ref": "refs/heads/upload/incoming/2014-01-18-69216887/cfe18c",
      "sha": "cfe18cacfffdae9fbeeba040bd5221752644cd9f",
      "url": "http://localhost:9999/repos/bewest/uploads/git/refs/heads/upload/incoming/2014-01-18-69216887/cfe18c"
    },
    {
      "ref": "refs/heads/upload/incoming/2014-01-18-69606959/2ed98f",
      "sha": "2ed98ff877a56067d41c230dfa64b9a9b197ac51",
      "url": "http://localhost:9999/repos/bewest/uploads/git/refs/heads/upload/incoming/2014-01-18-69606959/2ed98f"
    },
    {
      "ref": "refs/heads/upload/incoming/2014-01-18-69608074/17af5c",
      "sha": "17af5c8b06dadf5bb04e80330f21a91eca163e74",
      "url": "http://localhost:9999/repos/bewest/uploads/git/refs/heads/upload/incoming/2014-01-18-69608074/17af5c"
    },
    {
      "ref": "refs/heads/upload/incoming/2014-01-18-69608735/17af5c",
      "sha": "17af5c8b06dadf5bb04e80330f21a91eca163e74",
      "url": "http://localhost:9999/repos/bewest/uploads/git/refs/heads/upload/incoming/2014-01-18-69608735/17af5c"
    }
  ],
  "url": "http://localhost:9999/repos/bewest/uploads/git/refs/"
}
```

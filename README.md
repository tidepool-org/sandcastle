sandcastle
==========

Tidepool's server for tracking provenance of all "uploads."

## Install

    "url": "git://github.com/tidepool-org/sandcastle.git"
    npm install git://github.com/tidepool-org/sandcastle.git
    # or
    git clone git://github.com/tidepool-org/sandcastle.git

[![Build Status](https://travis-ci.org/tidepool-org/sandcastle.png?branch=master)](https://travis-ci.org/tidepool-org/sandcastle)
[![Code Climate](https://codeclimate.com/github/tidepool-org/sandcastle.png)](https://codeclimate.com/github/tidepool-org/sandcastle)

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

#### optional
* **COORDINATOR** - hakken coordinator to use - default is `localhost`
* **HAKKEN_PUBLISH** - hakken service name to publish, default is
  `sandbox`
* **SANDBOX_HOSTNAME** - default hostname to use (`localhost`)
* **SANDBOX_SCHEME** - default scheme to use (whatever the server is
  using otherwise)

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


##### Fetch content
Performing an upload with valid mime types.
You can specify author.name, author.email, committer.name, and
committer.email, as well as the `message`.
The json response will include urls in the `content` which can be used
to `GET` the content.

Use the content links to fetch content.
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

##### Download `content` links

```bash
+ curl -ivs http://localhost:9999/repos/bewest/uploads/raw/upload/incoming/2014-01-18-73432385/1769bd/server.js
* About to connect() to localhost port 9999 (#0)
*   Trying 127.0.0.1... connected
> GET /repos/bewest/uploads/raw/upload/incoming/2014-01-18-73432385/1769bd/server.js HTTP/1.1
> User-Agent: curl/7.22.0 (x86_64-pc-linux-gnu) libcurl/7.22.0 OpenSSL/1.0.1 zlib/1.2.3.4 libidn/1.23 librtmp/2.3
> Host: localhost:9999
> Accept: */*
> 
< HTTP/1.1 200 OK
< Connection: close
< Content-Type: text/plain
< Content-Length: 838
< Date: Sat, 18 Jan 2014 04:28:45 GMT
< 
{ [data not shown]
* Closing connection #0
HTTP/1.1 200 OK
Connection: close
Content-Type: text/plain
Content-Length: 838
Date: Sat, 18 Jan 2014 04:28:45 GMT

```

```javascript

var gitServer = require('restify-git-json/server');

function customUser (profile, next) {
  // customize description
  // actually you can replace the entire thing, supports async fetching.
  profile.description = "Hello world!";
  // what ever is passed to next will be the result of server.fetchUser(name, cb)
  next(null, profile);
}

function configure (hook, next) {
  hook.map(customUser);
  next( );
}

function createServer( ) {
  var env = require('./env');
  var server = gitServer(env);

  server.events.on('profile', configure);
  return server;
}

module.exports = createServer;

if (!module.parent) {
  console.log('main');
  var server = createServer( );

  var env = require('./env');
  var port = env.port || 6886;
  server.listen(port, function( ) {
    console.log('listening on', server.name, server.url);
  });

}

```

```bash
+ curl -ivs http://localhost:9999/repos/bewest/uploads/raw/upload/incoming/2014-01-18-73432385/1769bd/env.js
* About to connect() to localhost port 9999 (#0)
*   Trying 127.0.0.1... connected
> GET /repos/bewest/uploads/raw/upload/incoming/2014-01-18-73432385/1769bd/env.js HTTP/1.1
> User-Agent: curl/7.22.0 (x86_64-pc-linux-gnu) libcurl/7.22.0 OpenSSL/1.0.1 zlib/1.2.3.4 libidn/1.23 librtmp/2.3
> Host: localhost:9999
> Accept: */*
> 
< HTTP/1.1 200 OK
< Connection: close
< Content-Type: text/plain
< Content-Length: 565
< Date: Sat, 18 Jan 2014 04:28:54 GMT
< 
{ [data not shown]
* Closing connection #0
HTTP/1.1 200 OK
Connection: close
Content-Type: text/plain
Content-Length: 565
Date: Sat, 18 Jan 2014 04:28:54 GMT

```
```javascript
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

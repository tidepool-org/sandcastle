var fs = require('fs');
var es = require('event-stream');
var request = require('request');

function defaultContent ( ) {
  var fileOne = es.readArray(["dummy content hello world text"]);
  var fileTwo = fs.createReadStream('./Makefile');
  var content = {fileOne: fileOne, fileTwo: fileTwo};
  return content;
}
function testContent (T) {
  var content = defaultContent( );
  var pre = "====";
  var boundary =  pre + pre + pre + "TIDEPOOL" + "TESTBOUNDARY" + "EOF";
  var stream = mimeStream({boundary: boundary, type: 'form-data'});
  function make (name, part) {
    var o = {
      disposition: 'form-data; name="' + name + '"; filename="'+ name + '"'
    , type: 'text/plain; charset=UTF-8'
    , transferEncoding: 'quoted-printable'
    , body: part
    };
    return o;
  }
  stream.add(make('testfileOne', content.fileOne));
  stream.add(make('testfileTwo', content.fileTwo));
  function message(m) {
    var o = {
      disposition: 'form-data; name="message";'
    , type: 'x-www-form-urlencoded'
    , transferEncoding: 'quoted-printable'
    , body: es.readArray([m])
    };
    stream.add(o);
  }
  stream.message = message;
  return stream;
}

describe("restify-git-json server", function ( ) {
  var Server = require('../server');
  var server, client;
  var opts = {
    base: './out'
  , socketPath: '/tmp/test-sandcastle-git-json.sock'
  , log_level: 'debug'
  , log_stream: 'rotating-file'
  , log_path: './logs/test.log'
  };
  this.profile = { };
  after(function (done) {
    server.close( );
    done( );
  });
  it('should initialize ok', function (done) {
    server = Server(opts);
    server.listen(opts.socketPath, function ( ) {
      // client = createClient(opts);
      /*
      // client.status(function (err, req, res, body) {
        // console.log("STATUS", body);
        body.should.startWith("OK");
      */
        done( );
      });
  });
  // });
function uploadContent (name, content, fn) {
    var url = '/uploads/' + name + '/upload';
    var mimes = defaultContent(content);
    var ropts = {
        method: 'POST'
      , uri: 'http://localhost/' + url
      //, uri: url
      , path: url
      // , socketPath: opts.socketPath
      // , host: 'localhost'
      // , port: 6776
      , socketPath: opts.socketPath
      // , headers: { //'content-type': 'multipart/form-data' }

    };
    var req = request.post(ropts, start);
    var form = req.form( );
    form.append("message", "this is my commit message");
    form.append('fileOne', mimes.fileOne, {filename: 'fileOne', knownLength: 30, contentType: 'text/plain'});
    form.append('fileTwo', mimes.fileTwo);
    function start (err, res, body) {
      // console.log("UPLOADED BODY", err, body);
      fn(err, JSON.parse(body));
    }
    return;
    function done (err, result) {
      fn(err, JSON.parse(result[0]));
      
    }

  }
  it('should upload stuff', function (done) {
    
    uploadContent('fooTestUser', null, function (err, result) {
      result.body.should.be.ok;
      result.body.ref.should.be.ok;
      result.body.sha.should.be.ok;
      result.body.head.should.be.ok;
      result.body.url.should.be.ok;
      result.body.content.should.be.ok;
      result.body.content.length.should.equal(2);
      done( );
    });
  });
});

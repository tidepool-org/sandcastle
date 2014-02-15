
var gitServer = require('restify-git-json/server');

function customUser (profile, next) {
  // customize description
  // actually you can replace the entire thing, supports async fetching.
  profile.description = "Hello world!";
  // what ever is passed to next will be the result of server.fetchUser(name, cb)
  next(null, profile);
}

function customProfile (hook, next) {
  hook.map(customUser);
  next( );
}

function createServer(opts) {
  opts.name = opts.name || 'jellyfish';
  var server = gitServer(opts);
  var Hakken = require('./lib/hakken');
  var Uploads = require('./lib/uploads');
  var uploads = Uploads(opts, server);
  var hakken = Hakken(opts, server);

  server.events.on('profile', customProfile);
  server.on('listening', function config ( ) {
    hakken(opts, server);
    uploads.mount(server, opts);

  });
  return server;
}

module.exports = createServer;

if (!module.parent) {

  var env = require('./env');
  var server = createServer(env);
  var port = env.port || 6886;
  server.listen(port, function( ) {
    console.log(server.name, 'listening on', server.url);
    server.log.info(server.name, 'listening on', server.urlize( ).toString( ));
  });

}



var gitServer = require('restify-git-json/server');
var Hakken = require('./lib/hakken');

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
  var env = require('./env');
  var server = gitServer(opts);

  var hakken = Hakken(env, server);
  server.events.on('profile', customProfile);
  server.on('listening', function config ( ) {
    console.log('config more');
    hakken(opts, server);

  });
  return server;
}

module.exports = createServer;

if (!module.parent) {
  console.log('main');

  var env = require('./env');
  var server = createServer(env);
  var port = env.port || 6886;
  server.listen(port, function( ) {
    console.log('listening on', server.name, server.url);
  });

}


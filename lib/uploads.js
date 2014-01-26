
var middleware = require('restify-git-json/lib/middleware')
  // , es = require('event-stream')
     , path = require('path')
  // , gitStream = require('restify-git-json/lib/stream-git')
  // , uploads = require('restify-git-json/lib/middleware/uploads')
  , uploadEndpoint = require('restify-git-json/lib/handlers/upload/branch')
  ;

var handler = uploadEndpoint.endpoint.handler;

var endpoint = {
    path: '/uploads/:owner/upload'
  , method: 'post'
  , handler: handler
};
module.exports = function configure (opts, server) {
  function ownerProfile (req, res, next) {
    server.log.info("UPLOAD", req.params.owner);
    server.fetchUser(req.params.owner, done);
    function done (profile) {
      profile.handle = req.params.owner;
      req.profile = profile;
      server.log.info("FORCING PROFILE CREATION FOR", profile);
      if (profile.err) {
        var body = {
            name: profile.profile.name
          , handle: profile.handle
          , email: 'blip+robot' + profile.handle + '@tidepool.io'
          , user: profile.handle
          , author: {
            name: profile.profile.name
          , email: 'blip+user' + profile.handle + '@tidepool.io'
          }
        };
        var c = { save: true, create: true
                , repo_path: path.join(opts.base, profile.handle)
                , message: "created profile"};
        server.updateUser(profile.handle, body, c, function created (profile) {
          server.log.info("CREATED NEW PROFILE", profile);
          req.profile = profile;
          next( );
        });
        return;
      }
      next( );
    }
  }
  function setRepo (req, res, next) {
    req.params.repo = 'sandbox-uploads';
    req.params.user = req.params.owner;
    req.repo_name = 'uploads.git';
    // req.params.repo_path = 'xxx/yyy';
    next( );
  }
  var defaultUploader = uploadEndpoint(opts, server);

  function mount (server) {
    server.post(endpoint.path, setRepo, endpoint.middleware, ownerProfile, endpoint.handler);
  }
  endpoint.middleware = defaultUploader.middleware;
  endpoint.mount = mount;

  return endpoint;
};
module.exports.endpoint = endpoint;


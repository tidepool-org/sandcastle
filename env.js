module.exports = (function ( ) {
  var config = {
      // port for http server to bind to
      // port 6776 if undefined
      port: (process.env.PORT || 6776)
      // type of git backend to use
    , type: 'fs-db'
    , coordinator: (process.env.COORDINATOR || null)
    , service: (process.env.HAKKEN_PUBLISH || null)
    , host: (process.env.SANDBOX_HOSTNAME || null)
    , scheme: (process.env.SANDBOX_SCHEME || null)
      // base directory to host bare repos in
    , base: (process.env.BASE || './out')
    , log_level: (process.env.LOG_LEVEL || 'info')
    , log_stream: (process.env.LOG_STREAM || process.stdout)
  };
  if (process.env.SERVER_KEY && process.env.SERVER_CERTIFICATE) {
    config.key = process.env.SERVER_KEY;
    config.certificate = process.env.SERVER_CERTIFICATE;
  }
  return config;
})( );

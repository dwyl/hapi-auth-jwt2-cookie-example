var Hapi        = require('hapi');     // https://github.com/nelsonic/learn-hapi
var hapiAuthJWT = require('hapi-auth-jwt2'); // http://git.io/vT5dZ
var JWT         = require('jsonwebtoken');   // used to sign our content
var port        = process.env.PORT || 8000;  // allow port to be set
var aguid       = require('aguid')  // https://github.com/ideaq/aguid
var redis       = require('redis'); // https://github.com/docdis/learn-redis
var url         = require('url');   // node core!
var assert      = require('assert');

var cookie_options = {
  ttl: 365 * 24 * 60 * 60 * 1000, // expires a year from today
  encoding: 'none',    // we already used JWT to encode
  isSecure: true,      // warm & fuzzy feelings
  isHttpOnly: true,    // prevent client alteration
  clearInvalid: false, // remove invalid cookies
  strictHeader: true   // don't allow violations of RFC 6265
}


// bring your own validation function
var validate = function (decoded, request, callback) {
  console.log(" - - - - - - - DECODED token:");
  console.log(decoded);
  // do your checks to see if the session is valid
  request.redis.get(decoded.id, function (rediserror, reply) {

    console.log(' - - - - - - - REDIS reply - - - - - - - ', reply);
    var session;
    if(reply) {
      session = JSON.parse(reply);
    }
    else { // unable to find session in redis ... reply is null
      return callback(rediserror, false);
    }

    if (session.valid === true) {
      return callback(rediserror, true);
    }
    else {
      return callback(rediserror, false);
    }
  });
};

var server = new Hapi.Server();
server.connection({ port: port });

server.register([
  hapiAuthJWT, 
  { register: require('hapi-redis-connection')} // no options required
  ], function (err) {
  assert(!err); // halt if error
  // see: http://hapijs.com/api#serverauthschemename-scheme
  server.auth.strategy('jwt', 'jwt', true,
  { key: process.env.JWT_SECRET,
    validateFunc: validate,
    verifyOptions: { ignoreExpiration: true, algorithms: [ 'HS256' ] }
  });

  server.route([
    {
      method: "GET", path: "/", config: { auth: false },
      handler: function(request, reply) {
        reply({text: 'Token not required'});
      }
    },
    {
      method: ['GET','POST'], path: '/restricted', config: { auth: 'jwt' },
      handler: function(request, reply) {
        reply({text: 'You used a Token!'})
        .header("Authorization", request.headers.authorization)
        .state("token", request.headers.authorization, {ttl: 365 * 30 * 7 * 24 * 60 * 60 * 1000})
        // .set(token)
      }
    },
    { // implement your own login/auth function here
      method: ['GET','POST'], path: "/auth", config: { auth: false },
      handler: function(request, reply) {
        var session = {
          valid: true, // this will be set to false when the person logs out
          id: aguid(), // a random session id
          exp: new Date().getTime() + 30 * 60 * 1000 // expires in 30 minutes time
        }
        // create the session in Redis
        request.redis.set(session.id, JSON.stringify(session));
        // sign the session as a JWT
        var token = JWT.sign(session, process.env.JWT_SECRET); // synchronous
        console.log(token);
        reply({text: 'Check Auth Header for your Token'})
        .header("Authorization", token)
        .state("token", token, cookie_options)
      }
    },
    {
      method: ['GET','POST'], path: "/logout", config: { auth: 'jwt' },
      handler: function(request, reply) {
        // implement your own login/auth function here
        var decoded = JWT.decode(request.headers.authorization,
          process.env.JWT_SECRET);
        var session;
        request.redis.get(decoded.id, function(rediserror, redisreply) {

          session = JSON.parse(redisreply)
          console.log(' - - - - - - SESSION - - - - - - - -')
          console.log(session);
          // update the session to no longer valid:
          session.valid = false;
          session.ended = new Date().getTime();
          // create the session in Redis
          request.redis.set(session.id, JSON.stringify(session));

          reply({text: 'Check Auth Header for your Token'})
        })
      }
    }
  ]);
  server.start(() => console.log('Now Visit: http://127.0.0.1:'+port) );

});

module.exports = server;

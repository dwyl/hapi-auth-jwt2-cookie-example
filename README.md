# hapi-auth-jwt2 *example*

A ***functional example*** Hapi.js app demonstrating
[***hapi-auth-jwt2***](https://github.com/dwyl/hapi-auth-jwt2) authentication
using cookies for client-side session storage and **Redis** (hosted on Heroku) for session validation with ***tests***!

[![Build Status](https://travis-ci.org/dwyl/hapi-auth-jwt2-cookie-example.svg)](https://travis-ci.org/dwyl/hapi-auth-jwt2-cookie-example)
[![Test Coverage](https://codeclimate.com/github/dwyl/hapi-auth-jwt2-cookie-example/badges/coverage.svg)](https://codeclimate.com/github/dwyl/hapi-auth-jwt2-cookie-example/coverage)
[![Code Climate](https://codeclimate.com/github/dwyl/hapi-auth-jwt2-cookie-example/badges/gpa.svg)](https://codeclimate.com/github/dwyl/hapi-auth-jwt2-cookie-example)
[![Dependency Status](https://david-dm.org/dwyl/hapi-auth-jwt2-cookie-example.svg)](https://david-dm.org/dwyl/hapi-auth-jwt2-cookie-example)

[![bitHound Score](https://www.bithound.io/github/dwyl/hapi-auth-jwt2-cookie-example/badges/score.svg)](https://www.bithound.io/github/dwyl/hapi-auth-jwt2-cookie-example)
[![Node.js Version](https://img.shields.io/node/v/hapi-auth-jwt2.svg?style=flat "Node.js 10 & 12 and io.js latest both supported")](http://nodejs.org/download/)
[![NPM Version](https://badge.fury.io/js/hapi-auth-jwt2.svg?style=flat)](https://npmjs.org/package/hapi-auth-jwt2)
[![HAPI 15.0.3](http://img.shields.io/badge/hapi-15.0.3-brightgreen.svg "Latest Hapi.js")](http://hapijs.com)
[![devDependency Status](https://david-dm.org/dwyl/hapi-auth-jwt2-cookie-example/dev-status.svg)](https://david-dm.org/dwyl/hapi-auth-jwt2-cookie-example#info=devDependencies)

## Environment Variables

To run this you will need to add an environment variable for your **JWT_SECRET** and **REDISCLOUD_URL**:
```
export JWT_SECRET=ItsNoSecretBecauseYouToldEverybody
export REDISCLOUD_URL=redis://rediscloud:OhEJvSgna@pub-redis-10689.eu-west-1-2.1.ec2.garantidata.com:10689
```

> If you are new to using environment variables
please see: https://github.com/dwyl/learn-environment-variables

**Note**: you will need to set up your own Redis to use the code in this example in your project. if you're new to Redis check out our quick start guide: https://github.com/dwyl/learn-redis


If you have ***any questions***, please ask! [![Join the chat at https://gitter.im/dwyl/chat](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dwyl/chat/?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  we are here to help!

<br />

## Need Help? Got Questions?

> If you have questions or need _any_ help please post an issue: https://github.com/dwyl/hapi-auth-jwt2-cookie-example/issues

<hr />

@MassimoCappellano posted the following question: [issues#2](https://github.com/dwyl/hapi-auth-jwt2-cookie-example/issues/2)

Running the example on my computer, from Chrome doing two GET requests (login and restricted resource):

FIRST:

http://localhost:8000/auth

in the server response, in the header set cookie: token=...................................... as expected

THEN:

http://localhost:8000/restricted

{"statusCode":401,"error":"Unauthorized","message":"Missing authentication"}

I expected that the cookie would be set by the auth request (1) so it should be authenticated. Using chrome console seems that the cookie of the first response
is not used in the second request.
It's correct?

Can someone explain if I miss something?

> ***Answer***: you aren't missing anything,
the demo server needed to be updated for latest Hapi,
please re-try in browser, open Dev Tools
then view the "Application" tab and expand the cookies section:

when we view the `/auth` route in Google Chrome it sets the cookie for the domain:
![hapi-auth-jwt2-showing-auth-route](https://cloud.githubusercontent.com/assets/194400/20802422/e8468b8a-b7e3-11e6-9f6a-05989d128131.png)

And when we visit `/restricted` which _requires_ as JWT we see:
![hapi-auth-jwt2-showing-restricted-route](https://cloud.githubusercontent.com/assets/194400/20802426/eb46635a-b7e3-11e6-9cf9-ff4d09454a87.png)

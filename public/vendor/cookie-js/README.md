# cookie-js [![Build Status](https://secure.travis-ci.org/cadecairos/cookie-js.png?branch=master)](http://travis-ci.org/cadecairos/cookie-js) #

cookie-js is a basic cookie parser and serializer for web browsers. It was forked from https://github.com/defunctzombie/node-cookie. It doesn't make assumptions about how you are going to deal with your cookies. It basically just provides a way to read and write the HTTP cookie headers.

See [RFC6265](http://tools.ietf.org/html/rfc6265) for details about the http header for cookies.

## how?

```
bower install cookie-js
```

```javascript

var hdr = cookiejs.serialize('foo', 'bar');
// hdr = 'foo=bar';

var cookies = cookiejs.parse('foo=bar; cat=meow; dog=ruff');
// cookies = { foo: 'bar', cat: 'meow', dog: 'ruff' };
```

## more

The serialize function takes a third parameter, an object, to set cookie options. See the RFC for valid values.

### path
> cookie path

### expires
> absolute expiration date for the cookie (Date object)

### maxAge
> relative max age of the cookie from when the client receives it (seconds)

### domain
> domain for the cookie

### secure
> true or false

### httpOnly
> true or false


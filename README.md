# debugger-256 [![Build Status](https://secure.travis-ci.org/njhoffman/debugger-256.png)](http://travis-ci.org/njhoffman/debugger-256) [![NPM version](https://badge.fury.io/js/debugger-256.png)](http://badge.fury.io/js/debugger-256)

A debugging tool and wrapper for prettyjson-256 that decorates logging output to the console.
Reads settings from a user-defined configuration file to control verbosity of different modules or 'subsystems'.

!(https://raw.github.com/njhoffman/debugger-256/master/docs/debug1.jpg)

## Installation

```bash
$ npm install --save-dev debugger-256
```

## Usage

This module returns a function that is passed an optional subsystem name similar to the debug module.
It returns 6 logging functions of different levels:

  fatal
  error
  warn
  log
  info
  debug
  trace

Each will output as different color, and optionally be filtered by a configuration file.

```javascript
var createDebug = require('debugger-256')('app');
createDebug.log("hello world");

// or
var createDebug = require('debugger-256');
createDebug('app:subsystem1').log('hello world');
createDebug('app:subsystem2').error('this is an error');
```
ES6 usage

```javascript
const { error, warn, log, trace } = require('debugger-256')('app:subsystem1');
info('destructing assignmnet is cool');
warn('all of these should appear under subsystem1');

```

## Configuration file

The options that can be passed as customOptions labeled above are as follows (including their defaults):

## Examples

## Running Tests

To run the test suite first invoke the following command within the repo,
installing the development dependencies:

```bash
$ npm install
```

then run the tests:

```bash
$ npm test
```


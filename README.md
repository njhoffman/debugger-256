# debugger-256 [![Build Status](https://secure.travis-ci.org/njhoffman/debugger-256.png)](http://travis-ci.org/njhoffman/debugger-256) [![NPM version](https://badge.fury.io/js/debugger-256.png)](http://badge.fury.io/js/debugger-256)

A debugging tool and wrapper for prettyjson-256 that decorates logging output to the console.
Reads settings from a user-defined configuration file to control verbosity of different modules or 'subsystems'.

![Example Output](https://raw.github.com/njhoffman/debugger-256/master/docs/debug1.jpg)

## Installation

```bash
$ npm install --save-dev debugger-256
```

## Usage

This module returns a function that is passed an optional subsystem name similar to the debug module.
It returns 6 logging functions of different levels:


  Name | Level
  --- | ---
  fatal | 0
  error | 1
  warn | 2
  log | 3
  info | 4
  debug | 5
  trace | 6

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

A configuration file named '.debugger-256' can be put in the root directory of the project to provide global options and filtering.  This file is watched and changes will take effect without requiring a restart of the process.  The file should be JSON format:

*.debugger-256*
```json
 {
   "app" : {
     "*" : 2,
     "response" : 6,
     "request" : 6
   }
 }
```
This specifies that messages from 'app:response' and 'app:request' level 6 and lower (all messages) wouldbe output, the '\*':3 specifies that app subsystems that aren't specified should only ouput messages from level and lower (only fatal, error, and warn).  

For example:
![Example Output]((https://raw.github.com/njhoffman/debugger-256/master/docs/debug2.jpg)

The dark blue lines are from 'log' calls (level 3), the light blue lines with header information are from trace calls (level 6). If we just wanted to show the log lines, change the numbers of the relevant subsystems to the maximum level you want to show (in this case log or level 3).

```json
 {
   "app" : {
     "*" : 2,
     "response" : 3,
     "request" : 3
   }
 }
```

Save the file and the filtering will be applied automatically without a server restart.

![Example Output]((https://raw.github.com/njhoffman/debugger-256/master/docs/debug3.jpg)

## Other Examples

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


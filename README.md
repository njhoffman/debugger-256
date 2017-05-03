# debugger-256 [![Build Status](https://secure.travis-ci.org/njhoffman/debugger-256.png)](http://travis-ci.org/njhoffman/debugger-256) [![NPM version](https://badge.fury.io/js/debugger-256.png)](http://badge.fury.io/js/debugger-256)[![Coverage Status](https://coveralls.io/repos/github/njhoffman/debugger-256/badge.svg?branch=master)](https://coveralls.io/github/njhoffman/debugger-256?branch=master)

A debugging tool and wrapper for [prettyjson-256](https://github.com/njhoffman/prettyjson-256) that decorates logging output to the console.
Reads settings from a user-defined configuration file to control verbosity of different modules (called subsystems).
This configuration file is watched for changes so the server does not have to be reloaded for filtering and formatting settings to be applied.

<img src="/debugger-256/docs/debugger-256.gif?raw=true" />

## Installation

```bash
$ npm install --save debugger-256
```

## Usage

This module returns a function that is passed an optional subsystem name similar to the [debug](https://github.com/visionmedia/debug) module.
It returns 7 logging functions of different levels:

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
The basic idea is to differentiate your logging messages into these different levels, which when combined with filtering allows one to quickly see very detailed output for some subystems without being cluttered by messages from other subsystems.

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
const { info, warn } = require('debugger-256')('app:subsystem1');
info('destructing assignmnet is cool');
warn('all of these should appear under subsystem1');

```
### Inline string coloring
THe customColors property can be assigned tags with colors during initialization to colorize parts of single line strings.

```javascript
var createDebug = require('debugger-256')('app');
createDebug.init({
  customColors: {
    resCode: { fg: [3,3,1] },
    resTime: { fg: [1,2,3] }
   }
});
// wrap each string section to be colorized in parenthesis,
// followed by a list of the customColor tags assigned to the key 'color'
createDebug.log("The response code returned was %200 - Received% in %50ms%",
  { color: 'resCode' }, { color: 'resTime' });
```
![Example Output 64](https://raw.github.com/njhoffman/debugger-256/master/docs/debug6.jpg)


## Conventions

Based on the [debug](https://github.com/visionmedia/debug) package modular approach, debugger-256 expects to be initialized with the name of the module or 'subsystem'.  Subsystems should be nested with colons, i.e. 'api:db:user' would indicate the current 'user' module is part of a parent 'db' module which is part of the root subsystem 'api'.  This allows for easy filtering and formatting through the options.

## Options

All options of [prettyjson-256](https://github.com/njhoffman/prettyjson-256) can be passed to the 'init' function, or they can be added to the configuration file described in the next section.

```javascript
var createDebug = require('debugger-256')('app');
var initOptions = {
  depth: 3,
  alphabetizeKeys: true,
  colors: {
    keys: { fg: [0,3,2] },
    boolTrue: { bg: [0,2,0] }
  }
};
createDebug.init(initOptions);
createDebug.log(initOptions);
```

![Example Output 4](https://raw.github.com/njhoffman/debugger-256/master/docs/debug4.jpg)

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

You can also specify debugger-256 custom options (same as you would pass as an argument) by adding them to key '_debugger-256':

*.debugger-256*
```json
 {
   "app" : {
     "*" : 2
   },
   "_debugger-256" : {
      "depth" : 3,
      "customColors" : {
        "responseGet": { "fg": [1, 4, 3] },
        "requestGet": { "fg": [1, 4, 3] },
      }
   }
 }
```

For example:
![Example Output 2](https://raw.github.com/njhoffman/debugger-256/master/docs/debug2.jpg)

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

![Example Output 3](https://raw.github.com/njhoffman/debugger-256/master/docs/debug3.jpg)

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


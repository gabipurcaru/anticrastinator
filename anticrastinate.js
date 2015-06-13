#!/usr/bin/env node

var forever = require('forever');
var _ = require('lodash');

var FILE = __dirname + '/updater.js';

var command = process.argv[2];
if(['start', 'stop', 'status'].indexOf(command) === -1) {
  command = 'status';
}

// if is not root, show an error and exit
if(['start', 'stop'].indexOf(command) !== -1 && process.getuid() !== 0) {
  console.error("You need to run this command with sudo.");
  process.exit(-1);
}

if(command == 'start') {
  forever.startDaemon(FILE, { killSignal: 'SIGINT' });
} else if(command == 'status') {
  forever.list(null, function(err, list) {
    var isRunning = (_.filter(list, function(item) {
      return item.file == FILE;
    }).length > 0);

    if(isRunning) {
      console.log("Running");
    } else {
      console.log("Stopped");
    }
  });
} else if(command == 'stop') {
  forever.list(null, function(err, list) {
    var isRunning = _.map(_.filter(list, function(item) {
      return item.file == FILE;
    }), function(item) {
      forever.stop(item.pid);
    });
  });
}

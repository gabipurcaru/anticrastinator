var fs = require('fs');
var moment = require('moment');
var _ = require('lodash');

var HOSTS_FILE = '/etc/hosts';
var REPLACING_IP = '127.0.0.1';
var TIME_FORMAT = 'HH:mm';
var LOG_FILE = '/var/log/anticrastinator';

var logFile = fs.openSync(LOG_FILE, 'a');

var log = _.curry(function(level, message) {
  message = "[" + moment().format('YYYY-MM-DD HH:mm') +  "] [" + level + "] " + message;
  fs.write(logFile, message + "\n");
});

log.info = log('INFO');
log.error = log('ERROR');

log('howdy');

var parseWhen = function(when) {
  // weekdays
  var applicable = true;
  var weekdays = when.indexOf('weekdays') !== -1;
  when = when.replace(/weekdays/g, '').trim();

  if(weekdays && moment().isoWeekday() >= 6) {
    applicable = false;
  }

  // weekends
  var weekends = when.indexOf('weekends') !== -1;
  when = when.replace(/weekends/g, '').trim();

  if(weekends && moment().isoWeekday() < 6) {
    applicable = false;
  }

  // time
  var interval = when.split('-');
  var beginning = moment(interval[0], TIME_FORMAT);
  var end = moment(interval[1], TIME_FORMAT);
  var now = moment();

  applicable = applicable && now.isBetween(beginning, end);
  return [beginning, end, applicable];
};

var minTime = function(times, defaultTime) {
  var min = defaultTime;
  _.each(times, function(time) {
    if(time.isBefore(min)) {
      min = time;
    }
  });

  return min;
};

var parseHostsFile = function(data) {
  // ignore :anticrastinate: lines
  data = data.replace(/^.*:anticrastinate.*\n/mg, '');

  // parse the rules
  var times = [];
  var output = data.replace(/^# anticrastinate:(.*)$/mg, function(str, match) {
    var split = match.split('--');
    var when = split[0].trim();
    var what = split[1].trim();

    var parsed = parseWhen(when);
    var beginning = parsed[0];
    var end = parsed[1];
    var applicable = parsed[2];

    times.push(beginning);
    times.push(end);

    if(!applicable) {
      return str;
    }

    what = _.flatten(_.map(what.split(/\s/), function(site) {
      return [site, 'www.' + site];
    })).join(" ");

    return str + '\n' + REPLACING_IP + '\t' + what + ' # :anticrastinate:';
  });

  return [times, output];
};

var processHostsFile = function() {
  fs.readFile('/etc/hosts', { encoding: 'utf8' }, function(err, data) {
    var parsedData = parseHostsFile(data);
    var times = parsedData[0];
    var output = parsedData[1];

    times = _.filter(times, function(time) { return moment().isBefore(time); });
    var nextTime = minTime(times, moment().add(1, 'minute'));

    fs.writeFile(HOSTS_FILE, output, function(err) {
      if(err) {
        log.error("Unable to write to file: " + err);
      } else {
        log.info("Updated file; will check again at: " + nextTime.toString());
        // schedule a re-check after a set time
        var timeout = setTimeout(function() {
          fs.unwatchFile(HOSTS_FILE);
          processHostsFile();
        }, nextTime.diff(moment()));

        // if the file is changed in any way before that, trigger a change
        fs.watchFile(HOSTS_FILE, function() {
          fs.unwatchFile(HOSTS_FILE);
          clearTimeout(timeout);
          processHostsFile();
        });
      }
    });
  });
};

log.info("started");
processHostsFile();

process.on('SIGINT', function() {
  log.info("Closing the updater, removing rules.");
  var data = fs.readFileSync(HOSTS_FILE, { encoding: 'utf8' });
  data = data.replace(/^.*:anticrastinate.*\n/mg, '');
  fs.writeFileSync(HOSTS_FILE, data);
  process.exit();
});

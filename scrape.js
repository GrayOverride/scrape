
/**
 * Module dependencies.
 */
process.stdin.resume();
process.stdin.setEncoding('utf8');
var validator = require('validator');
var util = require('util');
var colors = require('colors');
var fs = require('fs');
var wscraper = require('wscraper');
var script = fs.readFileSync('scripts/TargetDesignator.js');

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var scrape = express();

// all environments
scrape.set('port', process.env.PORT || 3000);
scrape.set('views', path.join(__dirname, 'views'));
scrape.set('view engine', 'ejs');
scrape.use(express.favicon());
scrape.use(express.logger('dev'));
scrape.use(express.bodyParser());
scrape.use(express.methodOverride());
scrape.use(express.cookieParser('your secret here'));
scrape.use(express.session());
scrape.use(scrape.router);
scrape.use(require('stylus').middleware(path.join(__dirname, 'public')));
scrape.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == scrape.get('env')) {
  scrape.use(express.errorHandler());
}

scrape.get('/', routes.index);
scrape.get('/users', user.list);

http.createServer(scrape).listen(scrape.get('port'), function(){
  console.log('Express server listening on port '.green + scrape.get('port'));
});

	process.stdin.on('data', function (text) {
      console.log('received data:', util.inspect(text));
      if (text === 'quit\n') {
        done();
      }
        else if (text === 'mem\n') {
        memcheck();
      }
      else if (text === 'ss\n'){
        console.log('scraping once')
        singleS();
      }
      else if (text === 'us\n'){
        console.log('this will scrape the target until you abort it, are you sure?'.green);
        // if (text === 'y\n'){
        //   unlimitedS();
        // }
        unlimitedS();
      }
      else if (text === 'help\n'){
        console.log('commands:\n\nss: start the scape and run it once\nus: run the scrape until you terminate it(use with care)\nmem: check alocated system resourses\nquit: terminate the process')
      }
      else if (text === 'stop\n'){
        stop();
      }

    });

    function memcheck() {
      var mem = util.inspect(process.memoryUsage());
      var hmem = process.memoryUsage();
      console.log('currently using:'.green +"\nRss:".underline.green + hmem.rss/1000000 +"Mb\nHeapTotal:".underline.green+ hmem.heapTotal/1000000 +"Mb\nHeapUsed:".underline.green+ hmem.heapUsed/1000000 +"Mb".underline.green );
      
    }
    function singleS(){
      console.log("starting single scrape sir".green);
      scrapeStart();
    }
      function unlimitedS(){
      console.log("starting unlimited scrape sir".green);
      setInterval(function(){scrapeStart()},10000);
      
    }

    function stop()
    {
    clearInterval(scrape());
    }

    function done() {
      console.log('Killing the process');
      process.exit();
    }
  function scrapeStart(){
  var suburl = ['/v/'];

  // create a web scraper agent instance
  var agent = wscraper.createAgent();

  agent.on('start', function (n) {
      util.log('Agent has started; ' + n + ' path(s) to visit');
  });

  agent.on('done', function (url, target) {
      util.log('data from ' + url);
      // display the results 
      //util.log('Data: ' + JSON.stringify(target)); 
      fs.writeFile("targetOutput", JSON.stringify(target), function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The data was saved!".green);
      }
  });  

      // next item to process if any
      agent.next();        
  });

  agent.on('stop', function (n) {
      util.log('Agent has ended; ' + n + ' path(s) remained to visit');
  });

  agent.on('abort', function (e) {
      util.log('getting a FATAL ERROR [' + e + ']');
      util.log('agent has aborted');
      process.exit();
  });

  // run the web scraper agent
  agent.start('boards.4chan.org', suburl, script);
  }


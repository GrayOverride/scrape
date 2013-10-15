
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  var util = require('util');
  var    wscraper = require('wscraper');
  var    fs = require('fs');
  var script = fs.readFileSync('scripts/TargetDesignator.js');


  
  process.stdin.on('data', function (text) {
    console.log('received data:', util.inspect(text));
    if (text === 'quit\n') {
      done();
    }
      else if (text === 'mem\n') {
      memcheck();
    }
    else if (text === 'scrape\n'){
      newurl();
    }
    else if (text === 'help\n'){
      console.log('commands:\n\nscrape: start the scape\nmem: check alocated system resourses\nquit: terminate the process')
    }

  });

  function memcheck() {
    var mem = util.inspect(process.memoryUsage());
    var hmem = process.memoryUsage();
    console.log('currently using:' +"\nRss: "+ hmem.rss/1000000 +"Mb\nHeapTotal: "+ hmem.heapTotal/1000000 +"Mb\nHeapUsed: "+ hmem.heapUsed/1000000 +"Mb" );
    
  }
  function newurl(){
    console.log("starting scrape sir");
    scrape();
  }

  function done() {
    console.log('Killing the process');
    process.exit();
  }
function scrape(){
var suburl = ['/v/', '/a/'];

// create a web scraper agent instance
var agent = wscraper.createAgent();

agent.on('start', function (n) {
    util.log('[wscraper.js] agent has started; ' + n + ' path(s) to visit');
});

agent.on('done', function (url, target) {
    util.log('[wscraper.js] data from ' + url);
    // display the results    
    util.log('[wscraper.js] Data: ' + target);
    // next item to process if any
    agent.next();        
});

agent.on('stop', function (n) {
    util.log('[wscraper.js] agent has ended; ' + n + ' path(s) remained to visit');
});

agent.on('abort', function (e) {
    util.log('[wscraper.js] getting a FATAL ERROR [' + e + ']');
    util.log('[wscraper.js] agent has aborted');
    process.exit();
});

// run the web scraper agent
agent.start('boards.4chan.org', suburl, script);
}


    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    var validator = require('validator');
    var util = require('util');
    var colors = require('colors');
    var fs = require('fs');
    var wscraper = require('wscraper');
    var script = fs.readFileSync('scripts/TargetDesignator.js');


    
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
      scrape();
    }
      function unlimitedS(){
      console.log("starting unlimited scrape sir".green);
      setInterval(function(){scrape()},10000);
      
    }

    function stop()
    {
    clearInterval(scrape());
    }

    function done() {
      console.log('Killing the process');
      process.exit();
    }
  function scrape(){
  var suburl = ['/r/aww'];

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
      util.log('getting a FATAL ERROR [' + e + ']'.red);
      util.log('agent has aborted');
      process.exit();
  });

  // run the web scraper agent
  agent.start('www.imgur.com', suburl, script);
  }


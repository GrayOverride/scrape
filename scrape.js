var nodeio = require('node.io');
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  var util = require('util');

  process.stdin.on('data', function (text) {
    console.log('received data:', util.inspect(text));
    if (text === 'quit\n') {
      done();
    }
      else if (text === 'mem\n') {
      memcheck();
    }

  });
  function memcheck() {
    var mem = util.inspect(process.memoryUsage());
    var hmem = process.memoryUsage();
    console.log('currently using:' +"\nRss: "+ hmem.rss/1000000 +"Mb\nHeapTotallol: "+ hmem.heapTotal/1000000 +"Mb\nHeapUsed: "+ hmem.heapUsed/1000000 +"Mb" );
    
  }

  function done() {
    console.log('Killing the process');
    process.exit();
  }

var methods = {
    input: true,
    timeout: 1000,



    run: function() {
        this.getHtml('http://boards.4chan.org/v/', function(err, $) {

            //Handle any request / parsing errors
            if (err) this.exit(err);

            var data = [], output = [];

            //Select all data on the page
            $('div.board div.thread div.postContainer div.post .postMessage').each(function(a) {
                data.push(a.text); 
            });



            for (var i = 0, len = data.length; i < len; i++) {
               

                //Output = [score] title
                output.push(data[i]);
            }

            this.emit(output);
        });
    }
}
exports.job = new nodeio.Job({timeout:10}, methods);

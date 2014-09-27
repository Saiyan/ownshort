var forever = require('forever-monitor');
var server_command = process.argv[2];

var child = new (forever.Monitor)('./lib/ownshort.js', {
    max: 1,
    silent: true,
    options: []
  });
  
child.on('e', function () {
    console.log('your-filename.js has exited after 3 restarts');
});

switch(server_command){
    case "start":
        console.log("starting");
        child.start();
        break;
    case "stop":
        console.log("stopping");
        child.stop();
        break;
}

// child process which will be executing scripts
const exec = require('child_process').exec;

const execProcess = function(command, cb) {
  const child = exec(command, function(err, stdout, stderr) {
    if (err) {
      return cb(err, null);
    } else if (typeof(stderr) != "string") {
      return cb(new Error(stderr, null));
    } else {
      return cb(null, stdout);
    }
  });
}



// git clone from origin to actual branch

// yarn command which builds project
// deletion of duplicated types
// prisma deploy


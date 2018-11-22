// child process which will be executing scripts
const exec = require('child_process').exec;

// frontend dir
const frontendDir = './../foxer360/frontend/'

// Commands executor
const execCommand = function(command, cb) {
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

execCommand(`git --git-dir=${frontendDir}.git pull origin sandbox`, function(err, response) {
  if (!err) {
    console.log(response);
    execCommand(`yarn --cwd=${frontendDir} updateDeps`, function(err, res) {
      console.log(err, res);
    })
  } else {
    console.log(err);
  }
});

// yarn command which builds project
// deletion of duplicated types
// prisma deploy


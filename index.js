// child process which will be executing scripts
const exec = require('child_process').exec;

// frontend dir
const frontendDir = './../foxer360/frontend/'

// Commands executor
const execCommand = function(command) {
  return new Promise(function(resolve, reject) {
    exec(
      command,
      {
        cwd: frontendDir,
        stdio:[0,1,2]
      },
      function(err, stdout, stderr) {
        if (err) {
          console.log(err);
          return reject(err);
        } else if (typeof(stderr) != "string") {
          console.log(stderr);
          return reject(stderr);
        } else {
          console.log(stdout);
          return resolve(stdout);
        }
      });
  });
};





(async function() {
  try {
    // git clone from origin to actual branch
    await execCommand(`git pull origin sandbox`);
    // yarn command which builds project
    await execCommand(`yarn updateDeps`);
  } catch(e) {
    console.error(e);
  }
})()




// deletion of duplicated types
// prisma deploy


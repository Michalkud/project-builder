// child process which will be executing scripts
const exec = require('child_process').exec;

// frontend dir
const frontendDir = './../foxer360/frontend/';
const serverDir = './../foxer360/server/';

// Commands executor
const execCommand = function(command, cwd) {
  return new Promise(function(resolve, reject) {
    exec(
      command,
      {
        cwd,
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
    // git pull from origin to sandbox branch
    await execCommand(`git pull origin sandbox`, frontendDir);
    // yarn command which builds project
    await execCommand(`yarn updateDeps`, frontendDir);
    // Deletion of duplicated types
    await execCommand(`rm -r components/kohinoor/node_modules/@types/`, frontendDir);

    // git pull from origin to sandbox branch
    await execCommand(`git pull origin sandbox`, serverDir);
    // Prisma deploy
    await execCommand(`prisma deploy`, serverDir);
  } catch(e) {
    console.error(e);
  }
})()




// deletion of duplicated types
// prisma deploy


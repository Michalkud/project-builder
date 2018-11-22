const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

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

const buildProject = async function() {
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
};

const httpServer = http.createServer(async function(req, res) {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url,true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the HTTP Method
  const method = req.method.toLowerCase();

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', async function() {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not exist go to not found handler
    const choosenHandler = 
      typeof(router[trimmedPath]) !== undefined ?
      router[trimmedPath] :
      router.notFond

    // Construct the data object to send to the handler
    const data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : JSON.parse(buffer)
    };

    const result = await choosenHandler(data);
    console.log(result);
    // Use the status code called back by the handler, or default to 200
    const statusCode = typeof result.statusCode === 'number' ? result.statusCode : 200;
    // Use the payload called back by the handler, or default to an empty object
    const payload = typeof result.payload === 'object' ? result.payload : {};
    // Convert the payload to a string
    const payloadString = JSON.stringify(payload);
    
    res.setHeader('Content-Type', 'application/json');

    // Return the response
    res.writeHead(statusCode);

    // Log the request path
    console.log('Return this response:', statusCode, payloadString);
    res.end(payloadString);
  })  

});

// Instantiate the HTTP server
httpServer.listen(3003, function() {
  console.log(`The http server is listening on port 3003`);
});

// Handler

const buildHookHandler = async function(data) {
  try {
    const result = await buildProject();
    return { 
      statusCode: 200, 
      payload: {
        message: `Project succesfully builded`
      } 
    }
  } catch (e) {
    return { 
      statusCode: 400,
      payload: {
        message: `Error occured: ${e}`
      }
    };
  }
}


// Define a request router
const router = {
  'build-hook' : buildHookHandler
}



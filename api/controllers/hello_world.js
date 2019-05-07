'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
const https = require('https');

global.sunRise = "";
global.sunSet = "";

'use strict';

// en0 192.168.1.101
// eth0 10.0.0.101
/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  save: save
};


function save(req, res) {
  // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
 
 
  /* Get IP of the caller */
  var ip = req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }
 
  /* Grab all values to insert */
  var mac = req.query.mac;
  const now = moment(new Date()); 
  
  var sensorValues = '' ;
  if (req.query.sensor1id !== undefined && req.query.sensor1value !== undefined) {
    sensorValues += `(${now.unix()}, '${ip}', '${mac}', '${req.query.sensor1id}', '${req.query.sensor1value}')`;
  }
  if (req.query.sensor2id !== undefined && req.query.sensor2value !== undefined) {
    sensorValues += `, (${now.unix()}, '${ip}', '${mac}', '${req.query.sensor2id}', '${req.query.sensor2value}')`;
  }
  if (req.query.sensor3id !== undefined && req.query.sensor3value !== undefined) {
    sensorValues += `, (${now.unix()}, '${ip}', '${mac}', '${req.query.sensor3id}', '${req.query.sensor3value}')`;
  }
  if (req.query.sensor4id !== undefined && req.query.sensor4value !== undefined) {
    sensorValues += `, (${now.unix()}, '${ip}', '${mac}', '${req.query.sensor4id}', '${req.query.sensor4value}')`;
  }
  if (req.query.sensor5id !== undefined && req.query.sensor5value !== undefined) {
    sensorValues += `, (${now.unix()}, '${ip}', '${mac}', '${req.query.sensor5id}', '${req.query.sensor5value}')`;
  }
 
  const parameters = `[API] call with ip:${ip}, mac:${mac}, sensor:${sensorValues}`;
  console.log(parameters);
 
 /* INSERT values */
  if (mac !== undefined && ip !== undefined && sensorValues.length > 0) {
    
    // INSERT
    DBConnect.UPDATE(`INSERT INTO COLLECT (EPOCH, IPID, MACID, SENSORID, VALUE) VALUES ${sensorValues}`, (error, result) => {
    
      if (error) {
        returnCode = 400;
        errorMessages.push(`[DB ERROR] Cannot save data in database ${error}`);
      } else {
        returnCode = 200;
      }

    }) ;
  } else {
    returnCode = 400;
    errorMessages.push(`[API ERROR] Cannot process the request with parameters sent: ${parameters}`);
  }

  // TODO1: use a put in order to insert n values

  // TODO2: reconnect to database if not connected
  
  // TODO3: sunrise/sunset function of ip calling or put data - synchrone 
 
  /* Get sunrise/sunset time for next response */
  https.get('https://api.sunrise-sunset.org/json?lat=48.8614397&lng=2.2792582&formatted=0', (resp) => {
    let data = '';
  
    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
    data += chunk;
    });
  
    // The whole response has been received. Print out the result.
    resp.on('end', () => {
    console.log('UPDATE ' + data);
    const parsedData = JSON.parse(data)
    sunRise = moment(parsedData.results.sunrise).format('YYYY-MM-DD HH:mm:ss') ;
    sunSet = moment(parsedData.results.sunset).format('YYYY-MM-DD HH:mm:ss') ;

    });
  
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
 

  let response = {};
  if (errorMessages.length > 0 ) {
    response.error = errorMessages; 
  }

  response.message = returnCode.toString();
  response.time = moment().format('YYYY-MM-DD HH:mm:ss');
  response.sunRise = sunRise;
  response.sunSet = sunSet;

  res.json(response);
 
}

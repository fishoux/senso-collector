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
  // Get IP of the caller
  var ip = req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }

  var mac = req.swagger.params.sensorid.value;
  var sensorId = req.swagger.params.sensorid.value;
  
  var sensorValue = req.swagger.params.sensorvalue.value;
  var tabToInsert = [ req.connection.remoteAddress, req.swagger.params.mac.value, 
         req.swagger.params.sensorid.value, req.swagger.params.sensorvalue.value];
  
  // INSERT
  DBConnect.UPDATE(`INSERT INTO COLLECT (IPID, MACID, SENSORID, VAUE) VALUES ('${ip}', '${req.swagger.params.sensorid.value}', '${req.swagger.params.sensorid.value}', '${req.swagger.params.sensorvalue.value}')`, (error, result) => {
    if (error) {
      console.error('DB ERROR',error);
    } else {
      res.json(200);
    }
  }) ;

 /* for (var property1 in req.swagger.params) {
    
    txt += ` | ${property1}: ${req.swagger.params[property1].value}`;
    if ( property1 != 'mac' ) {
      tabToInsert.push( [req.connection.remoteAddress, req.swagger.params.mac.value, property1, req.swagger.params[property1].value] );
    }

  }*/

/*
  // Parse all values entered
  var mac = req.swagger.params.mac.value ;
  var txt = `Device # ${mac}:`;
  
  var temp = req.swagger.params.temp.value;
  if (temp != undefined) txt += `
     temp: ${temp}`;
  */
  // TODO1: Save data in database
    // Mac of the device
    // Datetime
    // Sensor data  {TEMPERATURE, HYGROMETRY, UVA, UVB, ATMOSPHERE, RAIN, SOIL, }
    // If an unknown data is sent save the data under OTHER

  // TODO2: reconnect to database if not connected
  
  // TODO3: Handle date time function of IP timezone
  /* http://ip-api.com/json/208.80.152.201

    var moment = require('moment-timezone');
    moment().tz(result.timezone).format();
    
    ...

  */

  
  /*console.log(`IP: ${req.connection.remoteAddress}`);
 
  var os = require('os');
  var ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        console.log(ifname + ':' + alias, iface.address);
      } else {
        // this interface has only one ipv4 adress
        console.log(ifname, iface.address);
        
      }

      ++alias;
    });
  });
  */

  //var hello = util.format(txt);
  // this sends back a JSON response which is a single string
  

}

class db_connect  {

  constructor() {
    console.log(`DB first connection`);
    this.FindConnection((error,callback) => {

      if (error){ console.error(`DB ERROR no database connexion found`); }
      else {
        console.log(`DB connected via ${host}`);
      }
    }); // FindConnection

  }

  query( sql, args ) {

    let con = mysql.createConnection( config );

    return new Promise( ( resolve, reject ) => {
      con.query( sql, args, ( err, rows ) => {
        if ( err )
          return reject( err );
        resolve( rows );
      } );
    } );
  }

  SELECT(sqlQuery, callback) {

    if ( sqlQuery != undefined  ){
      if ( typeof sqlQuery === 'string' ){

        var mysql = require('mysql');

        var con = mysql.createConnection({
          host: config.dbHost,
          user: config.dbUser,
          password: config.dbPassword,
          database: config.dbDatabase,
          pool: {requestTimeout: 60000}
        });

        con.connect(function(err) {

          if (err) {
            console.error(`     ERROR SQL during connection to [${host}]: [${err}]`);
            //callback(err,null);
            callback(err, null);
          } else {
            con.query(sqlQuery, function (err, result, fields) {

              if (err) {
                console.error(`     ERROR SQL during SELECT execution [${sqlQuery}]. Error details : [${err}]`);
                con.end();
                callback(err, null);
              } else {
                console.log(`     OK SQL [${result.length}] results returned with [${sqlQuery}]  `);
                con.end();
                callback(null, result);
              }

            });
          }

        });

      }
      else {
        console.error(`    ERROR on SELECT function with wrong type(s) into INSERT: sqlQuery=[${sqlQuery}], values=[${values}]`,null);
        callback('wrong type of input(s)', null);
        //return {error:'wrong type of input(s)', result:null};
      }
    }
    else {
      console.error(`     ERROR on SELECT function with undefined input(s): sqlQuery=[${sqlQuery}], values=[${values}]`,null);
      callback('undefined input(s)', null);
      //return {error:'undefined input(s)', result:null};
    }

  }

  UPDATE(sqlQuery, callback) {
   
    if ( sqlQuery != undefined  ){
      if ( typeof sqlQuery === 'string' ){

        var mysql = require('mysql');

        var con = mysql.createConnection({
          host: config.dbHost,
          user: config.dbUser,
          password: config.dbPassword,
          database: config.dbDatabase,
          pool: {requestTimeout: 60000}
        });

        con.connect(function(err) {

          if (err) {

           console.error(`     ERROR SQL during connection to [${host}]: [${err}]`);
            callback(err, null);

          } else {

            con.query(sqlQuery, function (err, result) {

              if (err) {
                console.error(`     ERROR SQL during UPDATE execution [${sqlQuery}]. Error details : [${err}]`);
                con.end();
                callback(err, null);
              } else {
                console.log(`     OK SQL [${result.affectedRows}] record(s) updated with [${sqlQuery}]  `);
                con.end();
                callback(null, result);
              }

            });
          }

        });

      }
      else {
        console.error(`    ERROR on UPDATE function with wrong type(s) into INSERT: sqlQuery=[${sqlQuery}], values=[${values}]`,null);
        callback('wrong type of input(s)', null);
        //return {error:'wrong type of input(s)', result:null};
      }
    }
    else {
      console.error(`     ERROR on UPDATE function with undefined input(s): sqlQuery=[${sqlQuery}], values=[${values}]`,null);
      callback('undefined input(s)', null);
      //return {error:'undefined input(s)', result:null};
    }

  }

  INSERT(sqlQuery, values, callback)  {

    if ( sqlQuery != undefined && sqlQuery != undefined ){
      if ( typeof sqlQuery === 'string' && typeof values === 'object' ){

        var mysql = require('mysql');

        var con = mysql.createConnection({
          host: config.dbHost,
          user: config.dbUser,
          password: config.dbPassword,
          database: config.dbDatabase,
          pool: {requestTimeout: 60000}
        });

        con.connect(function(err) {
          if (err) {

            console.error(`     ERROR SQL during connection to [${host}]: [${err}]`);
            
            callback(err, null);
          } else {
            con.query(sqlQuery, [values], function (err, result, fields) {
              if (err) {

                console.error(`     ERROR SQL during INSERT execution [${sqlQuery} ${values}]. Error details : [${err}]`);
                con.end();
                callback(err, null);

              } else {

                console.log(`     OK SQL [${result.affectedRows}] line(s) inserted with [${sqlQuery}]  `);
                con.end();
                callback(null, result);

              }
            });
          }
        });

      }
      else {
        console.error(`    ERROR on INSERT function with wrong type(s) into INSERT: sqlQuery=[${sqlQuery}], values=[${values}]`,null);
        callback('wrong type of input(s)', null);
        //return {error:'wrong type of input(s)', result:null};
      }
    }
    else {
     console.error(`     ERROR on INSERT function with undefined input(s): sqlQuery=[${sqlQuery}], values=[${values}]`,null);
      callback('undefined input(s)', null);
      //return {error:'undefined input(s)', result:null};
    }

  }

  ConnectPool() {

    this.pool  = mysql.createPool({
      host:config.dbHostlocal,
      user:config.dbUser,
      password: config.dbPassword,
      database: config.dbDatabase
    });

  }


  FindConnection(callback) {
    var mysql = require('mysql');

    console.log('First database connexion ...');
    //Try to connect via LAN

    var con = mysql.createConnection({
      host: config.dbHostlocal,
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbDatabase
    });

    con.connect(function(err) {

      if (err) { // Connection failed, internet
        console.log(`   PARAM Databased connexion failed via LAN -> try with internet [${err}] with host:${config.dbHost},user:${config.dbUser},`);

        var newcon = mysql.createConnection({
          host: config.dbHostweb,
          user: config.dbUser,
          password: config.dbPassword,
          database: config.dbDatabase
        });

        newcon.connect(function(err) {
            if (err) { // Connection failed, internet
              console.error(`PARAM Databased failed via internet [${err}]`);
              //callback(new Error('Cannot connect to DB via VLAN or Internet'), null);
            }
            else {
              console.log(`     DB connection DONE with host:${config.dbHostweb},user:${config.dbUser},`);
              config.dbHost = config.dbHostweb;
              newcon.end();
              //callback(null, newcon);
            }
        });

      }
      else {
        con.end();
        log.info(`     DB connection DONE with host:${config.dbHostlocal},user:${config.dbUser},`);
        host = hostlocal;
        //callback(null, newcon);
      }
    });



  }

}

module.exports = db_connect;

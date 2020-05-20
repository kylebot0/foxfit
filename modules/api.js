const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

async function apiData (){
    const con = mysql.createConnection({
        host: process.env.HOSTNAME,
        user: process.env.DBUSERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: process.env.HOSTPORT
    })
      
      con.connect((err) => {
        if(err){
          console.log('Error connecting to Db');
          return;
        }
        console.log('Connection established');
      });
      
      let promise = await new Promise((resolve, reject) => {
          con.query('SELECT * FROM pam_data', function (error, results, fields) {
            if (error) throw error;
                resolve(results)
            });})
      return await promise

      
    //   con.end((err) => {});
    //   let dbResult = await promise
    //   console.log(dbResult)
    //   return dbResult
}

module.exports = apiData

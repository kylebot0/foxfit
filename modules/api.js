const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()

const con = mysql.createConnection({
    host: process.env.HOSTNAME,
    user: process.env.DBUSERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.HOSTPORT
})

async function apiData (query){  
    con.connect((err) => {
        if(err){
            console.log('Error connecting to Db')
            return
        }
        console.log('Connection established')
    })
      
    let promise = await new Promise((resolve, reject) => {
        con.query(query, function (error, results, fields) {
            if (error) throw error
            console.log('result:', results)
            resolve(results)
        })})
    return await promise
}

module.exports = apiData

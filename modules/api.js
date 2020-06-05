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
            console.log('Error connecting to Db or a handshake is already enqued')
            return
        }
        console.log('Connection established')
    })
    
    let promise = await new Promise((resolve) => {
        con.query(query, function (error, results) {
            if (error) throw error
            
            resolve(results)
        })})
    return await promise
}

module.exports = apiData

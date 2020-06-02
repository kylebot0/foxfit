var express = require('express')
var router = express.Router()
const Api = require('../modules/api')
const Utilities = require('../modules/Utilities')


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' })
})

router.get('/data', function(req, res, next) {
    Api('SELECT * FROM pam_data')
        .then(function(result) {res.json({data: result})})
})

router.get('/user/:id', function(req, res, next) {
    const userid = req.params.id
    Api(`SELECT * FROM simbapam.pa_users WHERE username = "${userid}";`)
        .then(function(result) {res.json({data: result})})
})

router.get('/pamdata/:id', async function(req, res) {
    // obtain userdata
    const userid = req.params.id
    const userQuery = `SELECT * FROM simbapam.pa_users WHERE username = "${userid}";`
    const userData = await  Api(userQuery)
    
    // then obtain pamdata
    const pamId = userData[0].pamid
    const obtainedDate = new Date(userData[0].startdate)
    const dateDomain = Utilities.getDateDomain(obtainedDate)
    const pamDataQuery = `SELECT * FROM simbapam.pam_data WHERE pam_id = "${pamId}" AND date BETWEEN '${dateDomain[0]}' AND '${dateDomain[1]}';`
    const pamData = await Api(pamDataQuery)
    
    // then obtain goal data (we might not need this)
    // const goalDataQuery = `SELECT * FROM simbapam.doelen WHERE username = "${userid}";`
    // const goalData = await Api(goalDataQuery)
    
    // then obtain trophy data
    const trophyDataQuery = `SELECT * FROM simbapam.trofee WHERE username = "${userid}";`
    const trophyData = await Api(trophyDataQuery)

    // then obtain day entries
    const dailyDataQuery = `SELECT * FROM simbapam.userdagentries WHERE username = "${userid}";`
    const dailyData = await Api(dailyDataQuery)

    const combinedData = {
        pamData: pamData,
        trophyData: trophyData[0],
        dailyData: dailyData
    }
    // return pamdata
    res.json({data: combinedData})  
})

module.exports = router

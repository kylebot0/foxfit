var express = require('express')
var router = express.Router()

const Data = require('../modules/data')

/* GET home page. */
router.get('/', async function(req, res) {
    const allData = await Data.getAll()
    res.json({data: allData})
})

router.get('/user/:userid', async function(req, res) {
    const userData = await Data.getUserData(req.params.userid)
    res.json({data: userData})
})

router.get('/daily/:userid', async function(req, res) {
    const dailyDataForUser = await Data.getDailyDataForUser(req.params.userid)
    res.json({data: dailyDataForUser})
})

router.get('/trophy/:userid', async function(req, res) {
    const trophyDataForUser = await Data.getTrophyDataForUser(req.params.userid)
    res.json({data: trophyDataForUser})
})

router.get('/pam/:userid', async function(req, res) {
    const pamDataForUser = await Data.getPamDataForUser(req.params.userid)
    res.json({data: pamDataForUser})  
})

router.get('/all/:userid', async function(req, res) {
    const allDataForUser = await Data.getAllDataForUser(req.params.userid)
    res.json({data: allDataForUser})  
})

// route for data for movement graph
router.get('/movement/:userid', async function(req, res) {
    const userData = await Data.getUserData(req.params.userid)
    const dailyDataForUser = await Data.getDailyDataForUser(req.params.userid)
    const pamDataForUser = await Data.getPamDataForUser(req.params.userid)

    const transformedData = {
        user: userData,
        daily: dailyDataForUser,
        pamData: pamDataForUser
    }
    res.json({data: transformedData})  
})



module.exports = router

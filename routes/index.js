var express = require('express')
var router = express.Router()

const Data = require('../modules/data')

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' })
})

router.get('/data', async function(req, res) {
    const allData = await Data.getAll()
    res.json({data: allData})
})

router.get('/user/:id', function(req, res) {
    const userData = Data.getUserData(req.params.id)
    res.json({data: userData})
})

router.get('/pamdata/:id', async function(req, res) {
    const allDataForUser = await Data.getAllDataForUser(req.params.id)
    res.json({data: allDataForUser})  
})

module.exports = router

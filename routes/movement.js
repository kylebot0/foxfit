var express = require('express')
var router = express.Router()
const Data = require('../modules/data')

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('beweging', { title: 'Beweging per week' })
})

router.get('/data/:id', async (req, res) => {    
    const data = await Data.getAllDataForUser(req.params.id)
    res.json({data: data})  
})


module.exports = router
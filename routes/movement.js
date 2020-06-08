var express = require('express')
var router = express.Router()
const Data = require('../modules/data')

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('beweging', { title: 'Beweging per week' })
})

module.exports = router
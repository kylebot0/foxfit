var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('feeling', { title: 'Gevoel en beweging' })
})

module.exports = router
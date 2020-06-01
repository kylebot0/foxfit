var express = require('express')
var router = express.Router()

/* GET users listing. */
router.get('/dagdoel', function(req, res, next) {
    res.render('dagdoelen', { title: 'Dagdoelen' })
})

module.exports = router
var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
    res.render('movement', { title: 'Beweging' })
})

module.exports = router

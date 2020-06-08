var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('planets', { title: 'Planeten voor kids' })
  });

module.exports = router;

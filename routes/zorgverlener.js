var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('zorgverlener', { title: 'Zorgverlener' });
  });

module.exports = router;

var express = require('express');
var router = express.Router();
const api = require('../modules/api');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/data', function(req, res, next) {
  api().then(function(result) {res.json({data: result})})
})

module.exports = router;

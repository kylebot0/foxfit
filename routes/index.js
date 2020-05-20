var express = require('express');
var router = express.Router();
const api = require('../modules/api');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' })
})

router.get('/data', function(req, res, next) {
  api('SELECT * FROM pam_data')
  .then(function(result) {res.json({data: result})})
})

router.get('/user/:id', function(req, res, next) {
  const userid = req.params.id
  api(`SELECT * FROM simbapam.pa_users WHERE username = "${userid}";`)
  .then(function(result) {res.json({data: result})})
})

router.get('/pamdata/:id', function(req, res, next) {
  const userid = req.params.id
  api(`SELECT * FROM simbapam.pa_users WHERE username = "${userid}";`)
  .then(function(result) {res.json({data: result})})
})

module.exports = router;

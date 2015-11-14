var router = require('express').Router();

router.get('/', function(req, res, next) {
  res.render('welcome.html');
})

module.exports = router;

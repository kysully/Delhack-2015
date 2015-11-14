var router = require('express').Router();

router.get('/', function(req, res, next) {
  res.json({"message": "welcome"});
})

module.exports = router;

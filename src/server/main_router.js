var router = require('express').Router();

// STATUS: Un-implemented
router.get('/', function(req, res, next) {
  res.render('home.html');
})

// STATUS: Un-implemented
router.get('/live', function(req, res, next) {
  res.render('live');
});

// STATUS: Un-implemented
router.get('/historic', function(req, res, next) {
  res.render('historic.html');
});

// STATUS: Un-implemented
router.get('/res', function(req, res, next) {
  res.render('res_list.html');
});

// STATUS: Un-implemented
router.get('/res/:rid', function(req, res, next) {
  res.render('res', {});
});

// STATUS: Un-implemented
router.get('/res/:rid/admin', function(req, res, next) {
  res.render('res_admin', {});
});

// STATUS: Un-implemented
router.get('/flashdeals', function(req, res, next) {
  res.render('flashdeals.html');
});

// STATUS: Un-implemented
router.get('/flashdeals/:fid', function(req, res, next) {
  res.render('flashdeal.html');
});

module.exports = router;

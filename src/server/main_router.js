var router = require('express').Router();

// STATUS: Partially implemented, being implemented by Natalie Lane
router.get('/', function(req, res, next) {
  res.render('home.html');
})

// STATUS: FINISHED
router.get('/live', function(req, res, next) {
  res.render('live');
});

// STATUS: Un-implemented
router.get('/historic', function(req, res, next) {
  res.render('historic.html');
});

// STATUS: FINISHED
router.get('/res', function(req, res, next) {
  res.render('res_list');
});

// STATUS: Mostly implemented, only D3 graphs are left
router.get('/res/:rid', function(req, res, next) {
  res.render('res');
});

// STATUS: Un-implemented
router.get('/res/:rid/admin', function(req, res, next) {
  res.render('res_admin', {});
});

// STATUS: FINISHED
router.get('/flashdeals', function(req, res, next) {
  res.render('flashdeals');
});

// STATUS: FINISHED
router.get('/flashdeals/:fid', function(req, res, next) {
  res.render('flashdeal');
});

// STATUS: FINISHED
router.get('/button', function(req, res, next) {
  res.render('button');
});

router.get('/input_deal', function(req, res, next) {
  res.render('deal_input');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;

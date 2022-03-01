const router = require('express').Router()

router.get('/login', (_, res) => {
    res.render('auth/login');
  });

router.get('/signup', (_, res) => {
    res.render('auth/signup')
})
  
module.exports = router;
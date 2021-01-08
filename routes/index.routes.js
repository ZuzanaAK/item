const express = require('express');
const Item = require('../models/Item.model');
const router = express.Router();

/* GET home page */
router.get('/', (req, res) => {
  
  let userInSession = false

  if (req.session.passport) {
    userInSession = true;
  }

  Item.find()
  .then( itemsFromDB => {
    res.render('index', {userInSession, itemsFromDB});
  })
  .catch(err => {
    console.log(err);
  })
  
});

module.exports = router;
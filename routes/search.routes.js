const express = require('express');
const Item = require('../models/Item.model');
const router = express.Router();

router.get('/categories/:category', (req, res, next) => {
  
  let inputCategory = req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1)

  Item.find({category: inputCategory})
  .then(itemsInCategory => {
    res.render('searches/searchCategory', {itemsInCategory});
  })
  .catch(err => {
    console.log(err)
  });

})

router.get('/search', (req, res, next) => {
  const inputLocation = req.query.location.toLowerCase()
  const inputItem = req.query.item.toLowerCase()
  const inputOperation = req.query.operation

  Item.find({operation: inputOperation})
  .then(itemsFromDB => {
    let itemsToRetrieve = [];
    itemsFromDB.forEach(item => {
      console.log(item);
      if(item.location.toLowerCase().includes(inputLocation) && item.item.toLowerCase().includes(inputItem)) {
        itemsToRetrieve.push(item);
      }
    })
   
    res.render('searches/search', {itemsToRetrieve});

  })
  .catch(err => {
    console.log(err);
  });
    
})

module.exports = router;
const express = require('express');
const Item = require('../models/Item.model');
const router = express.Router();

//const axios = require('axios');

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
    // const google_key = process.env.GOOGLE_MAPS_API_KEY
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${google_key}`
    //   axios.get(url)
    //   .then( response => {
    //     const coordinates = response.data.results[0].geometry.location;
    //     console.log(coordinates);
    //   res.render('searches/search', {query, google_key, coordinates});
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    // } );

  //res.send({location, item, operation});
})
//res.render('searches/search', {query, });

//Search for a specific category

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

module.exports = router;
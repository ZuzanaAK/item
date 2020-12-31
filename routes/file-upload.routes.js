const express = require('express');
const router  = express.Router();
const Item = require('../models/Item.model');
const mongoose = require('mongoose');
const axios = require('axios');


//Mongoose set up
mongoose.set('useFindAndModify', false);

// include CLOUDINARY:
const uploader = require('../config/cloudinary.config.js');

router.post('/item-new', uploader.single("image"), (req, res, next) => {
  //console.log('file is: ', req.file)
 if (!req.file) {
   next(new Error('No file uploaded!'));
   return;
 }
 //You will get the image url in 'req.file.path'
 //store that in the DB 
  //console.log("body is: ", req.body)
  const address = req.body.location;
  console.log("the address is:", address)
  const google_key = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${google_key}`
  axios.get(url)
  .then(response => {
    //console.log(response.data.results.formatted_address)
    const formattedAddress = response.data.results[0].formatted_address;
    const coordinates = response.data.results[0].geometry.location;
    console.log(response.data.results);

    Item.create({ item: req.body.item, 
      category: req.body.category, 
      image: req.file.path, 
      description: req.body.description, 
      user: req.session.passport.user, 
      operation: req.body.operation, 
      location: formattedAddress })
        .then(() => {
          res.redirect('/myItems')
        })
        .catch(error => console.log(`Error while creating a new item: ${error}`));
  })
  .catch(err => {
    console.log(err);
  });

  

  // Item.create({ item: req.body.item, 
  //   category: req.body.category, 
  //   image: req.file.path, 
  //   description: req.body.description, 
  //   user: req.session.passport.user, 
  //   operation: req.body.operation, 
  //   location: formattedAddress })
  //     .then(() => {
  //       res.redirect('/myItems')
  //     })
  //     .catch(error => console.log(`Error while creating a new item: ${error}`));
});
 

router.post('/:itemId/item-edit', uploader.single("image"), (req, res, next) => {

  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  const address = req.body.location;
  console.log("the address is:", address)
  const google_key = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${google_key}`
  axios.get(url)
  .then(response => {
    //console.log(response.data.results.formatted_address)
    const formattedAddress = response.data.results[0].formatted_address;
    const coordinates = response.data.results[0].geometry.location;
    console.log(response.data.results);

  let newDoc = { 
    item: req.body.item, 
    category: req.body.category, 
    image: req.file.path, 
    description: req.body.description, 
    user: req.session.passport.user, 
    operation: req.body.operation,
    location: formattedAddress}

  console.log(newDoc);


  Item.findOneAndUpdate(
    {_id: req.params.itemId},
    newDoc,
    { new: true })
  .then(updatedDocument => {
    console.log(updatedDocument);
    res.redirect('/myItems')
  })
  .catch(error => console.log(`Error while creating a new item: ${error}`));

})
  .catch(error => console.log(`Error while creating a new item: ${error}`))
});


module.exports = router;
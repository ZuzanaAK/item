const express = require('express');
const router  = express.Router();
const Item = require('../models/Item.model');
const User = require('../models/User.model');
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
  const google_key = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${google_key}`
  axios.get(url)
  .then(response => {
    const formattedAddress = response.data.results[0].formatted_address;
    const coordinates = response.data.results[0].geometry.location;

    Item.create({ item: req.body.item, 
      category: req.body.category, 
      image: req.file.path, 
      description: req.body.description, 
      user: req.session.passport.user, 
      operation: req.body.operation, 
      location: formattedAddress,
      lat: coordinates.lat,
      lng: coordinates.lng })
        .then((newItem) => {
          res.redirect('/dashboard')
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

  //console.log("test")

 

  const address = req.body.location;
  const google_key = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${google_key}`
  axios.get(url)
  .then(response => {
    //console.log(response.data.results.formatted_address)
    const formattedAddress = response.data.results[0].formatted_address;
    const coordinates = response.data.results[0].geometry.location;

    console.log(coordinates);

    let imageToUpload = (req.file && req.file.path) ? req.file.path : req.body.existingImage;

  let newDoc = { 
    item: req.body.item, 
    category: req.body.category, 
    image: imageToUpload, 
    description: req.body.description, 
    user: req.session.passport.user, 
    operation: req.body.operation,
    location: formattedAddress,
    lat: coordinates.lat,
    lng: coordinates.lng
}

  console.log("XXX: ", req.params.itemId);

  Item.findOneAndUpdate(
    {_id: req.params.itemId},
    newDoc,
    { new: true })
  .then(updatedDocument => {
    let item = updatedDocument._id;
    res.redirect(`/${item}`);
  })
  .catch(error => console.log(`Error while editing the item: ${error}`));
})
  .catch(error => console.log(`Error while getting the data: ${error}`))
});


router.post('/:userId/profile-edit', uploader.single("profileImage"), (req, res, next) => {

  //console.log("test")

  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  let newDoc = { 
    profileImage: req.file.path, 
    name: req.body.name, 
}

console.log(newDoc);

  User.findOneAndUpdate(
    {_id: req.params.userId},
    newDoc,
    {new: true}
    )
    .then((updatedDocument) => {
      console.log(updatedDocument);
    res.redirect("/profile");
     })
  .catch(error => console.log(`Error while editing the user: ${error}`));
})


module.exports = router;
const express = require('express');
const router  = express.Router();
const Item = require('../models/Item.model');
const mongoose = require('mongoose');


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
  Item.create({ item: req.body.item, category: req.body.category, image: req.file.path, description: req.body.description, user: req.session.passport.user, operation: req.body.operation })

      .then(() => {
        res.redirect('/myItems')
      })
      
      .catch(error => console.log(`Error while creating a new item: ${error}`));
});
 

router.post('/:itemId/item-edit', uploader.single("image"), (req, res, next) => {

  console.log('file is: ', req.file)

  let newDoc = { item: req.body.item, category: req.body.category, image: req.file.path, description: req.body.description, user: req.session.passport.user, operation: req.body.operation }

  console.log(newDoc);

  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }

  Item.findOneAndUpdate(
    {_id: req.params.itemId},
    newDoc,
    { new: true })
  .then(updatedDocument => {
    console.log(updatedDocument);
    res.redirect('/myItems')
  })
  .catch(error => console.log(`Error while creating a new item: ${error}`));

  console.log("body is: ", req.body)

});


module.exports = router;
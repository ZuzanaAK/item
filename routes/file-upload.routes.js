const express = require('express');
const router  = express.Router();
const Item = require('../models/Item.model');

// include CLOUDINARY:
const uploader = require('../config/cloudinary.config.js');

router.post('/item-new', uploader.single("image"), (req, res, next) => {
  console.log('file is: ', req.file)
 if (!req.file) {
   next(new Error('No file uploaded!'));
   return;
 }
 //You will get the image url in 'req.file.path'
 //store that in the DB 
  console.log(req.body)
  Item.create({ item: req.body.item, category: req.body.category, image: req.file.path, description: req.body.description, user: req.session.passport.user })

      .then(() => {
        res.redirect('/dashboard')
      })
      
      .catch(error => console.log(`Error while creating a new item: ${error}`));
});
 

module.exports = router;
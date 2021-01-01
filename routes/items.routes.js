const express = require('express');
const Item = require('../models/Item.model');
const User = require('../models/User.model');
const router = express.Router();


//....................to add a new item.....................

router.get("/item-new", (req, res, next) => {

  let userInSession = false

  if (req.session.passport) {
    userInSession = true;
  }

  res.render("items/item-new", {userInSession});
});


//....................to show item.....................

router.get("/:itemId", (req, res, next) => {

  let profileOwner = false;

    Item.findById(req.params.itemId)
      .then((itemDB) => {
        console.log(itemDB);
        if (req.session.passport) {
          if (req.session.passport.user == itemDB.user) {
            profileOwner = true;
          }
        }

        User.findById(itemDB.user)
          .then(userFromDB => {
            res.render("items/item-show", {profileOwner, itemDB, userFromDB})
          })
          .catch(err => {
            console.log(err)
          })
          
      })
      .catch(err => {
        console.log(`Error: ${err}`)
        next()
      })
})



//....................to delete an item..................... 

router.post('/:itemId/delete', (req, res, next) => {
  
  Item.findByIdAndDelete(req.params.itemId)

      .then( () => {
         res.redirect("/dashboard")
      })
      .catch(err => {
        console.log(`Error: ${err}`)
      next()
      });
});

//....................to edit an item..................... 

router.get('/:itemId/item-edit', (req, res, next) => {
  
  let userInSession = false

  if (req.session.passport) {
    userInSession = true;
  }

  Item.findById(req.params.itemId)
    .then(itemDB => {
      console.log(itemDB);
      res.render("items/item-edit", {userInSession, itemDB});
    })
    .catch(err => {
      console.log(`Error: ${err}`)
    });
});


// router.post('/:itemId/item-edit', (req, res, next) => {

//   console.log("params: ", req.params)
//   console.log("body: ",req.body)

//   Item.findByIdAndUpdate(req.params.itemId, req.body, { new: true })

//     .then(itemDB => {
//       res.redirect(`/${itemDB._id}`);
//     }) 
//     .catch(err => {
//       console.log(`Error: ${err}`)
//     });
// });


module.exports = router;
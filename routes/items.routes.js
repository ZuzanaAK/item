const express = require('express');
const Item = require('../models/Item.model');
const router = express.Router();


router.get("/myItems", (req, res, next) => {
  
  let userId = req.session
  console.log(userId)
  
  Item.find()
      .then((items) => {
          //console.log(items)
          res.render("items/myItems", {items})

      })
      .catch(err => {
          console.log(`Error: ${err}`)
      });
});

//....................to add a new item.....................

router.get("/item-new", (req, res, next) => {
  res.render("items/item-new");
});


//....................to show item.....................

router.get("/:itemId", (req, res, next) => {
    Item.findById(req.params.itemId)
      .then((itemDB) => {
        //console.log(itemDB);
          res.render("items/item-show", {itemDB})
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
  

  Item.findById(req.params.itemId)
    .then(itemDB => {
      console.log(itemDB);
      res.render("items/item-edit", itemDB);
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
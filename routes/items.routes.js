const express = require('express');
const Item = require('../models/Item.model');
const router = express.Router();


router.get("/index", (req, res, next) => {
  
  Item.find()
      .then((items) => {
          //console.log(items)
          res.render("items/index", {items})

      })
      .catch(err => {
          console.log(`Error: ${err}`)
      });
});


router.get("/:itemId", (req, res, next) => {

    Item.findById(req.params.itemId)
      .then((itemDB) => {
          res.render("items/item-show", {itemDB})
      })
      .catch(err => {
        console.log(`Error: ${err}`)
        next()
      })
})


//....................to add a new item.....................

router.get("/item-new", (req, res, next) => {
  
  Item.findById(req.params.itemId)
      .then((itemsDB) => {
          console.log(itemsDB)
          res.render("items/item-new", {itemsDB})

      })
      .catch(err => {
          console.log(`Error: ${err}`)
          next()
      });
});


// router.post("/item-new", (req,res,next) => {
  
//   Item.create(req.body)

//       .then((itemDB) => {
//         console.log("Your Item Is Successfully Saved In The DB!")
//         res.redirect("/dashboard")
//       })
//       .catch(err => {
//         console.log(`Error: ${err}`)
//       });
// });

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
      res.render("items/item-edit", itemDB);
    })
    .catch(err => {
      console.log(`Error: ${err}`)
    });
});


router.post('/:itemId/item-edit', (req, res, next) => {

  Item.findByIdAndUpdate(req.params.itemId, req.body, { new: true })

    .then(itemDB => {
      res.redirect(`/items/${itemDB._id}`);
    })
    .catch(err => {
      console.log(`Error: ${err}`)
    });
});


module.exports = router;
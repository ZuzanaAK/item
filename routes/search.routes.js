const express = require('express');
const router = express.Router();

router.get('/search', (req, res, next) => {
  //TODO: implement the search of the items in the database
  console.log(req.query);

  const query = req.query;
  res.render('searches/search', {query});
} );

module.exports = router;
const express = require('express');
const router = express.Router();

const axios = require('axios');

router.get('/search', (req, res, next) => {
  //TODO: implement the search of the items in the database
  const query = req.query;
  const address = req.query.location;
  const google_key = process.env.GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${google_key}`
  axios.get(url)
  .then( response => {
    const coordinates = response.data.results[0].geometry.location;
    console.log(coordinates);
  res.render('searches/search', {query, google_key, coordinates});
  })
  .catch(err => {
    console.log(err);
  });
} );

module.exports = router;
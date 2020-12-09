const mongoose = require("mongoose")
let Item = require("../models/Item.model.js")

mongoose
  .connect('mongodb://localhost/item',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch(err => console.error('Error connecting to mongo', err));

let items = [
    { 
      item: "lamp", 
      category: "Furniture", 
      image: "abc",
      description: "This lamp is completely new. It is an unwanted present. Must go."

     },
    { 
      item: "Bob Marley t-shirt", 
      category: "Clothes", 
      image: "abc",
      description: "Worn a few times, doesn't fit anymore. I got fat."
    },
  ]

Item.create(items)
  .then(() => {
    console.log("connection established")
    mongoose.connection.close()
  })
  .catch(() =>{
    console.log("Error. Something went wrong.")
  })

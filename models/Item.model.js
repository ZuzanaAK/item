const mongoose = require("mongoose")

let ItemSchema = new mongoose.Schema({
  item: String,
  category: String,
  image: String,
  description: String,
})

let Item = mongoose.model("Item", ItemSchema)

module.exports = Item
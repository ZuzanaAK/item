const mongoose = require("mongoose");
console.log(__dirname);

const {Schema, model} = mongoose

let ItemSchema = new Schema({
  item: String,
  category: {
    type: String,
    required: [true, "This field is required"],
  }, 
  image: String,
  description: {
    type: String,
    required: [true, "This field is required"],
  }, 
  user: {type: Schema.Types.ObjectId, ref: "User"},
},
{
  timestamps: true

})

let Item = mongoose.model("Item", ItemSchema)

module.exports = Item
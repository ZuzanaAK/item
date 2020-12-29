const mongoose = require("mongoose");
console.log(__dirname);

const {Schema, model} = mongoose

let ItemSchema = new Schema({
  item: String,
  category: {
    type: String,
    enum : ['Books','Cars',"Clothes","Computers/Laptops", "Electronics","Furniture","Toys","Tools", "White_Goods","Others"],
    required: [true, "This field is required"],
  }, 
  image: String,
  description: {
    type: String,
    required: [true, "This field is required here"],
  }, 
  user: {type: Schema.Types.ObjectId, ref: "User"},
  operation: {
    type: String,
    enum : ['Donate','Sell','Exchange'],
    required: [true, "This field is required"],
  },
},
{
  timestamps: true

})

let Item = mongoose.model("Item", ItemSchema)

module.exports = Item
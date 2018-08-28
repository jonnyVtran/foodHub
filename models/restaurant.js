const mongoose = require('mongoose');

let restaurantSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
})

module.exports = mongoose.model("Restaurant", restaurantSchema);

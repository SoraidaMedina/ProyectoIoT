const mongoose = require("mongoose");

const SliderSchema = new mongoose.Schema({
  image: String,
  title: String,
  description: String,
  buttonText: String,
});

module.exports = mongoose.model("Slider", SliderSchema);

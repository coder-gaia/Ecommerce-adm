const { Schema, model, models } = require("mongoose");

const ProductSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  images: [String],
});

export const Product = models.Product || model("Product", ProductSchema);

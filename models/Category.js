const { Schema, models, model } = require("mongoose");

const CategorySchema = new Schema({
  name: String,
});

export const Category = models?.Category || model("Category", CategorySchema);

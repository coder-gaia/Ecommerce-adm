const { Schema, models, model, default: mongoose } = require("mongoose");

const CategorySchema = new Schema({
  name: String,
  parent: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: [Object],
});

export const Category = models?.Category || model("Category", CategorySchema);

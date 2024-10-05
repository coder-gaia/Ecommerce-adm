const { Schema, models, model, default: mongoose } = require("mongoose");

const CategorySchema = new Schema({
  name: String,
  parent: { type: mongoose.Types.ObjectId, ref: "Category" },
});

export const Category = models?.Category || model("Category", CategorySchema);

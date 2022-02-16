const mongoose = require("mongoose");

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const subCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      //   minlength: [2, "Too short"],
      //   maxlength: [30, "Too long"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.SubCategory ||
  mongoose.model("SubCategory", subCategorySchema);

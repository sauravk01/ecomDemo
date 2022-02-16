const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const tagSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    // product: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Category",
    //   },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Tag || mongoose.model("Tag", tagSchema);

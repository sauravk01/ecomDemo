const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const { ObjectId } = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      required: true,
      ref: "Category",
    },
    subCategory: {
      type: ObjectId,
      required: true,
      ref: "SubCategory",
    },
    tags: [
      {
        type: ObjectId,
        required: true,
        ref: "Tag",
      },
    ],
    colors: [
      {
        type: ObjectId,
        // required: true,
        ref: "Color",
      },
    ],
    inStock: {
      type: Number,
      required: true,
    },

    images: {
      type: Array,
      required: true,
    },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
    color: [
      {
        type: ObjectId,
        ref: "Color",
      },
    ],
    //   brand:[{
    //       type:ObjectId,
    //       ref:'Brand'
    //   }],
    // size:[{
    //       type:ObjectId,
    //       ref:'Brand'
    //   }],
    featuredProduct: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);

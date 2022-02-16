const mongoose = require("mongoose");

const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const { ObjectId } = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        total: Number,
        quantity: Number,
      },
    ],
    paymentId: String,
    method: String,
    delivered: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    dateOfPayment: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);

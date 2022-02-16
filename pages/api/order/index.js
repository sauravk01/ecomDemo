import connectDB from "../../../utils/connectDB";
import Order from "../../../model/orderModel";
import { getSession } from "next-auth/react";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createOrder(req, res);
      break;
    case "GET":
      await getOrders(req, res);
      break;
  }
};

const createOrder = async (req, res) => {
  try {
    const session = await getSession({ req });
    // console.log(session);
    if (!session.accessToken) {
      return res.status(401).json({ error: "Unauthenticated user" });
    }
    const { address, mobile, cartTotal } = req.body;
    console.log(req.body);
    let products = [];
    let cart = req.body.cart;
    if (cart.length > 0) {
      products = cart.map((item) => {
        return { product: item._id, quantity: item.quantity, total: cartTotal };
      });
    }
    let user = session.user.email;
    const newOrder = new Order({
      user,
      address,
      mobile,
      products,
    });
    await newOrder.save();
    console.log(newOrder);
    res.json({
      msg: "Success! created a new Order.",
      newOrder,
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.json({ err: "category already exists" });
    }
    return res.status(500).json({ err: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    // const session = await getSession({ req });
    // console.log(session);
    // if (!session.accessToken) {
    //   return res.status(401).json({ error: "Unauthenticated user" });
    // }
    const getOrders = await Order.find().populate("products.product");
    // console.log(getOrders);
    res.json({ getOrders });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

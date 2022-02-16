import connectDB from "../../../utils/connectDB";
import Order from "../../../model/orderModel";
import { getSession } from "next-auth/react";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await updateOrder(req, res);
      break;
    case "DELETE":
      await deleteOrder(req, res);
      break;
    case "GET":
      await getOrder(req, res);
      break;
  }
};
//update only paid and delivered for order
const updateOrder = async (req, res) => {
  try {
    const session = await getSession({ req });
    // console.log(session);
    if (!session.accessToken) {
      return res.status(401).json({ error: "Unauthenticated user" });
    }
    // finding by id
    // console.log("req", req.body);

    const updateOrder = await Order.findOneAndUpdate(
      { _id: req.body },
      {
        paid: true,
        dateOfPayment: new Date().toISOString(),
        method: "Receive Cash",
        delivered: true,
      }
    );
    res.json({
      msg: "Updated success!",
      updateOrder,
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.json({ err: "Order already exists" });
    }
    return res.status(500).json({ err: err.message });
  }
};

const deleteOrder = async (req, res) => {
  const session = await getSession({ req });
  try {
    if (!session) {
      return res.status(401).json({ error: "Unauthenticated user" });
    }
    const id = req.query.id;
    //find the product in that Category and delete them all
    //code not written

    await Order.findByIdAndDelete(id);
    return res.json({ msg: "success" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session.accessToken) {
      return res.status(401).json({ error: "Unauthenticated user" });
    }

    const getOrder = await Order.findById(req.query.id).populate(
      "products.product"
    );
    res.json({ getOrder });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

import connectDB from "../../../utils/connectDB";
import cartModel from "../../../model/cartModel";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createCartItems(req, res);
      break;
    case "GET":
      await getCartItems(req, res);
      break;
  }
};

const createCartItems = (req, res) => {
  console.log(req);
};

const getCartItems = (req, res) => {
  console.log(req);
};

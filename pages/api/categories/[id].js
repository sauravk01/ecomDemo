import connectDB from "../../../utils/connectDB";
import Category from "../../../model/categoriesModel";
import { getSession } from "next-auth/react";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateCategory(req, res);
      break;
    case "DELETE":
      await deleteCategory(req, res);
      break;
  }
};

const updateCategory = async (req, res) => {
  const session = await getSession({ req });
  try {
    if (!session) {
      return res.status(401).json({ error: "Unauthenticated user" });
    }
    let id = req.query.id;
    let title = req.body.title;
    // console.log(id);

    const updateCategory = await Category.findByIdAndUpdate(id, { title });

    res.json({
      msg: "Category updated",
      category: {
        ...updateCategory._doc,
        title,
      },
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.json({ err: "Category already exists" });
    }
    return res.status(500).json({ err: err.message });
  }
};

const deleteCategory = async (req, res) => {
  const session = await getSession({ req });
  try {
    if (!session) {
      return res.status(401).json({ error: "Unauthenticated user" });
    }
    const id = req.query.id;
    //find the product in that Category and delete them all
    //code not written

    await Category.findByIdAndDelete(id);
    return res.json({ msg: "success" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

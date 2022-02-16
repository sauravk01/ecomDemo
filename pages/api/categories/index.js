import connectDB from "../../../utils/connectDB";
import Category from "../../../model/categoriesModel";
import { getSession } from "next-auth/react";
connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createCategory(req, res);
      break;
    case "GET":
      await getCategories(req, res);
      break;
  }
};

const createCategory = async (req, res) => {
  try {
    const session = await getSession({ req });
    console.log(session);
    if (!session.accessToken) {
      return res.status(401).json({ error: "Unauthenticated user" });
    }
    const { title } = req.body;
    console.log(req.body);

    if (!title)
      return res.status(400).json({ err: "Title can not be left blank." });
    const newCategory = new Category({ title });

    await newCategory.save();
    res.json({
      msg: "Success! created a new Category.",
      newCategory,
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.json({ err: "category already exists" });
    }
    return res.status(500).json({ err: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.json({ categories });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

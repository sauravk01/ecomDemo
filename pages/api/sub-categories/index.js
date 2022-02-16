import connectDB from "../../../utils/connectDB";
import SubCategory from "../../../model/subCategoriesModel";
import sessionFile from "../../../utils/sessionSupply";
connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createSubCategory(req, res);
      break;
    case "GET":
      await getSubCategories(req, res);
      break;
  }
};

const createSubCategory = async (req, res) => {
  try {
    if (sessionFile(req)) {
      let category = req.body.category;
      let title = req.body.title;

      if (!title)
        return res.status(400).json({ err: "Title can not be left blank." });
      const newSubCategory = new SubCategory({ category, title: title });

      await newSubCategory.save();
      // console.log(title);

      res.json({
        msg: "Success! created a new sub-Category.",
        newSubCategory,
      });
    }
  } catch (err) {
    if (err && err.code === 11000) {
      return res.json({ err: "category already exists" });
    }
    return res.status(500).json({ err: err.message });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const data = await SubCategory.find();
    res.json({
      data,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

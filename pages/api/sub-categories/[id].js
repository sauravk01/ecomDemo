import connectDB from "../../../utils/connectDB";
import SubCategory from "../../../model/subCategoriesModel";
import sessionFile from "../../../utils/sessionSupply";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await editSubCategory(req, res);
      break;
    case "DELETE":
      await deleteSubCategory(req, res);
      break;
  }
};

const editSubCategory = async (req, res) => {
  try {
    if (sessionFile(req)) {
      let category = req.body.category;
      let title = req.body.title;

      if (!title)
        return res.status(400).json({ err: "Title can not be left blank." });
      const updateCategory = await SubCategory.findByIdAndUpdate(req.query.id, {
        category,
        title,
      });

      await updateCategory.save();
      // console.log(title);

      res.json({
        msg: "category updated",
        category: {
          ...updateCategory._doc,
          title,
          category,
        },
      });
    }
  } catch (err) {
    if (err && err.code === 11000) {
      return res.json({ err: "category already exists" });
    }
    return res.status(500).json({ err: err.message });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    if (sessionFile(req)) {
      const id = req.query.id;
      //   console.log(id);
      //find the product in that category and delete them all
      //code not written

      await SubCategory.findByIdAndDelete(id);
      return res.json({ msg: "success" });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

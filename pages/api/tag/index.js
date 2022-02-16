import connectDB from "../../../utils/connectDB";
import Tag from "../../../model/tagModel";
import sessionFile from "../../../utils/sessionSupply";
connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createTag(req, res);
      break;
    case "GET":
      await getTags(req, res);
      break;
  }
};

const createTag = async (req, res) => {
  try {
    if (sessionFile(res)) {
      const { title } = req.body;
      console.log(title);
      if (!title)
        return res.status(400).json({ err: "Title can not be left blank." });
      const newTag = new Tag({ title });

      await newTag.save();
      res.json({
        msg: "Success! created a new Tag.",
        newTag,
      });
    }
  } catch (err) {
    if (err && err.code === 11000) {
      return res.json({ err: "Tag already exists" });
    }
    return res.status(500).json({ err: err.message });
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json({ tags });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

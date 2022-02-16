import connectDB from "../../../utils/connectDB";
import Tag from "../../../model/tagModel";
import { getSession } from "next-auth/react";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateTag(req, res);
      break;
    case "DELETE":
      await deleteTag(req, res);
      break;
  }
};

const updateTag = async (req, res) => {
  const session = await getSession({ req });
  try {
    if (!session) {
      return res.status(401).json({ error: "Unauthenticated user" });
    }
    let id = req.query.id;
    let title = req.body.title;
    // console.log(id);

    const updateTag = await Tag.findByIdAndUpdate(id, { title });

    res.json({
      msg: "Tag updated",
      tag: {
        ...updateTag._doc,
        title,
      },
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.json({ err: "Tag already exists" });
    }
    return res.status(500).json({ err: err.message });
  }
};

const deleteTag = async (req, res) => {
  const session = await getSession({ req });
  try {
    if (!session) {
      return res.status(401).json({ error: "Unauthenticated user" });
    }
    const id = req.query.id;
    //find the product in that Tag and delete them all
    //code not written

    await Tag.findByIdAndDelete(id);
    return res.json({ msg: "success" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

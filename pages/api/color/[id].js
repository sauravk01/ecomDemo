import connectDB from "../../../utils/connectDB";
import nc from "next-connect";
import upload from "../../../utils/milter";
import Color from "../../../model/colorModel";
const staticResourceUrl = `http://localhost:3000/uploads/`;
import fs from "fs";
import path from "path";
connectDB();

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end("Page is not found");
  },
})
  .use(upload.single("image"))
  .put(async (req, res) => {
    // console.log(req.file);
    try {
      let reqBody = JSON.parse(JSON.stringify(req.body));
      //selecting id and deleting images from the server
      let selectItem = await Color.findById(reqBody.id);

      let image = selectItem.image;
      console.log("se", selectItem.image);

      let imageName = image.substr(30);

      let file = path.join(process.cwd(), "public", "uploads", imageName);
      fs.unlinkSync(file);
      //******************//

      const url = `${staticResourceUrl}${req.file.filename}`;
      const updateColor = await Color.findByIdAndUpdate(reqBody.id, {
        title: reqBody.title,
        image: url,
      });
      await updateColor.save();

      res.json({ msg: "success", updateColor });
    } catch (err) {
      if (err && err.code === 11000) {
        return res.json({ err: "title already exists" });
      }
      return res.status(500).json({ err: err.message });
    }
  })
  .delete(async (req, res) => {
    try {
      let deleteItem = await Color.findById(req.query.id);
      let imageName = deleteItem.image.substr(30);

      let file = path.join(process.cwd(), "public", "uploads", imageName);
      fs.unlinkSync(file);
      await Color.findByIdAndDelete(req.query.id);
      res.json({ msg: "color successfully deleted" });
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  });

export default handler;

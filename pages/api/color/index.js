import connectDB from "../../../utils/connectDB";
import nc from "next-connect";
import upload from "../../../utils/milter";
import Color from "../../../model/colorModel";
const staticResourceUrl = `http://localhost:3000/uploads/`;
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
  .post(async (req, res) => {
    try {
      //to match location of server and creating url accordingly to display in screen
      const url = `${staticResourceUrl}${req.file.filename}`;
      const newColor = new Color({
        ...req.body,
        image: url,
      });
      await newColor.save();

      res.json({ msg: "success", newColor });
    } catch (err) {
      if (err && err.code === 11000) {
        return res.json({ err: "title already exists" });
      }
      return res.status(500).json({ err: err.message });
    }
  })
  .get(async (req, res) => {
    try {
      let getColors = await Color.find();
      res.json({ getColors });
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  });

export default handler;

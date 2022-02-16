import connectDB from "../../../utils/connectDB";
import nc from "next-connect";
import upload from "../../../utils/milter";
import _ from "lodash";
import Product from "../../../model/productModel";
const staticResourceUrl = `http://localhost:3000/uploads/`;
import fs from "fs";
import path from "path";
import { getSession } from "next-auth/react";
import sessionFile from "../../../utils/sessionSupply";

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
  .use(upload.any())
  .put(async (req, res) => {
    try {
      if (!sessionFile(req)) {
        return res.status(401).json({ error: "Unauthenticated user" });
      }
      if (!req.files)
        return res
          .status(400)
          .json({ err: `Product item details can not be left blank.` });

      let reqBody = JSON.parse(JSON.stringify(req.body));
      let { files } = req;
      //selecting id and deleting images from the server
      let selectItem = await Product.findById(reqBody.id);
      // console.log("req", selectItem);

      let deleteImages = selectItem.images;

      for (const image of deleteImages) {
        let imageName = image.substr(30);

        let file = path.join(process.cwd(), "public", "uploads", imageName);
        fs.unlinkSync(file);
      }
      //******************//

      //collection of array from the browser for new images
      let images = [];
      _.forEach(files, (file) => {
        //to match location of server and creating url accordingly to display in screen
        const url = `${staticResourceUrl}${file.filename}`;
        //pushing each file into array
        images.push(url);
      });
      console.log(images);

      let id = req.query.id;
      let price = parseInt(req.body.price);
      let inStock = parseInt(req.body.inStock);
      let newProductItem = { ...req.body, price, inStock, images };
      // console.log(newProductItem);

      const updateProduct = await Product.findByIdAndUpdate(id, newProductItem);

      res.json({
        msg: "Product updated",
        category: {
          ...updateProduct._doc,
          updateProduct,
        },
      });
    } catch (err) {
      // if (err && err.code === 11000) {
      //   return res.json({ err: "Category already exists" });
      // }
      return res.status(500).json({ err: err.message });
    }
  })
  .delete(async (req, res) => {
    const session = await getSession({ req });
    try {
      if (!session) {
        return res.status(401).json({ error: "Unauthenticated user" });
      }
      let deleteItem = await Product.findById(req.query.id);
      let images = deleteItem.images;

      for (const image of images) {
        let imageName = image.substr(30);
        // console.log(imageName);

        let file = path.join(process.cwd(), "public", "uploads", imageName);
        fs.unlinkSync(file);
      }
      await Product.findByIdAndDelete(req.query.id);
      res.json({ msg: "Product successfully deleted" });
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  });

export default handler;

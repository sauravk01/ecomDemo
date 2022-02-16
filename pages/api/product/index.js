import connectDB from "../../../utils/connectDB";
import nc from "next-connect";
import upload from "../../../utils/milter";
import _ from "lodash";
import Product from "../../../model/productModel";
import sessionFile from "../../../utils/sessionSupply";
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
  .use(upload.any())
  .post(async (req, res) => {
    try {
      if (sessionFile(req)) {
        if (
          !req.body.title ||
          !req.body.description ||
          !req.body.price ||
          !req.body.inStock ||
          !req.body.tags[0] ||
          !req.body.category ||
          !req.body.subCategory
        )
          return res
            .status(400)
            .json({ err: `Product item details can not be left blank.` });

        let { files } = req;
        let images = [];
        _.forEach(files, (file) => {
          //to match location of server and creating url accordingly to display in screen
          const url = `${staticResourceUrl}${file.filename}`;
          //pushing each file into array
          images.push(url);
        });
        //putting directly object in schema
        let price = parseInt(req.body.price);
        let inStock = parseInt(req.body.inStock);
        let newProductItem = { ...req.body, price, inStock, images };
        // console.log('newProducts',newProductItem)

        const newProduct = new Product(newProductItem);
        await newProduct.save();
        res.json({
          msg: "req send success",
          newProduct,
        });
      }
    } catch (err) {
      if (err && err.code === 11000) {
        return res.json({ err: "Product title already exists!" });
      }
      return res.status(500).json({ err: err.message });
    }
  })
  .get(async (req, res) => {
    try {
      // console.log("req", req);
      const pageOptions = {
        currentPage: req.query.page ? parseInt(req.query.page) : 1,
        perPage: req.query.limit ? parseInt(req.query.limit) : 15,
      };
      console.log("skip", (pageOptions.currentPage - 1) * pageOptions.perPage);
      console.log("limit", pageOptions.perPage);
      let products;
      if (req.query.title == undefined || "") {
        let products = await Product.find()
          .populate("category")
          .populate("subCategory")
          .populate("tags")
          // .distinct("_id")
          .sort([["createdAt", "desc"]])
          .skip((pageOptions.currentPage - 1) * pageOptions.perPage)
          .limit(pageOptions.perPage);

        // console.log("products", products);

        return res.json({
          msg: "All products",
          products,
          page: pageOptions.currentPage,
        });
      } else {
        console.log("req", req.query);

        products = await Product.find({
          $or: [
            { title: { $regex: req.query.title, $options: "i" } },
            // { body: { $regex: search, $options: "i" } },
          ],
        })
          .populate("category")
          .populate("subCategory")
          .populate("tags")
          .sort([["createdAt", "desc"]])
          .skip((pageOptions.currentPage - 1) * pageOptions.perPage)
          .limit(pageOptions.perPage);
        // console.log("products", products);

        return res.json({
          msg: "updated Products",
          products,
          page: pageOptions.currentPage,
        });
      }
    } catch (err) {
      return res.status(500).json({ err: err.message });
    }
  });

export default handler;

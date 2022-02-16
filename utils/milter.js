import multer from "multer";
import path from "path";

const upload = multer({
  //hover over each property n methods to understand its job
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      //where its save
      cb(null, path.join(process.cwd(), "public", "uploads"));
    },
    filename: function (req, file, cb) {
      // file name is created
      cb(null, new Date().getTime() + "-" + file.originalname);
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
    },
  }),
});

export default upload;

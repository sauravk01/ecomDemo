//this is just to refer if i create with cloudinary.Note this is not being used//
const cloudinary = require("cloudinary");

// we will upload image on cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await imageDelete(req, res);
      break;
  }
};
// Upload image only admin can use
const imageDelete = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ msg: "No images Selected" });

    cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
      if (err) throw err;

      res.json({ msg: "Deleted Image" });
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Delete image only admin can use
// router.post('/destroy', (req, res) =>{

// })

// const removeTmp = (path) => {
//   fs.unlink(path, (err) => {
//     if (err) throw err;
//   });
// };

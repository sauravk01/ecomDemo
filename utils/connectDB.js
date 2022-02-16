import mongoose from "mongoose";
let db = process.env.DATABASE_URL;
const connectDB = () => {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected.");
    return;
  }
  mongoose.connect(
    db,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) throw err;
      console.log("Connected to mongodb.");
    }
  );
};

export default connectDB;

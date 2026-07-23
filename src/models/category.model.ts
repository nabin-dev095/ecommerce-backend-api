import mongoose from "mongoose";
import ImageSchema from "./image.model";

const categorySchema = new mongoose.Schema({
  name: {
    required: [true, "name is required"],
    unique: [true, "category already exists with same name"],
    minLenghth: 3,
    trim: true,
  },
  description: {
    type: String,
    minLength: [10, "description must be at least 10 character long"],
  },
  logo: {
    type: ImageSchema,
    required: true,
  },
},  
   { timestamps: true },
);

//* model
const Category = mongoose.model("category", categorySchema);
export default  Category;

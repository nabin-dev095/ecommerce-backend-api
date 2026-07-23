import mongoose from "mongoose";
import ImageSchema from "./image.model";
// name description , logo

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: [true, "brand already exists with same name"],
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
const Brand = mongoose.model("brand", brandSchema);
export default Brand;

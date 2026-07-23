import mongoose from "mongoose";
import ImageSchema from "./image.model";

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

//* user interface
interface IUser extends Document {
  full_name: string;
  email: string;
  password: string;
  profile_image?: {
    path: string;
    public_id: string;
  }
  role: Role;
}

//* schema
const userSchema = new mongoose.Schema<IUser>(
  {
    full_name: {
      type: String,
      required: [true, "full_name is required"],
      trim: true,
      minLength: [3, "name must be 3 characters long."],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: [true, "user already exists with provided email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    profile_image: {
      type: ImageSchema,
      default: null,
    },
  },
  { timestamps: true },
);

//* model
const User = mongoose.model<IUser>("user", userSchema);
export default User;
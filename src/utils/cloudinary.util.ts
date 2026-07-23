import cloudinary from "../config/cloudinary.config";
import AppError from "./apperror.utils";
import fs from "fs";


export const uploadFileToCloudinary = async (
  file: Express.Multer.File,
  dir = "/",
) => {
  try {
    const uploadFolder = "mernstack" + dir;
    const { secure_url: path, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        unnique_filename: true,
        folder: uploadFolder,
      },
    );

    //* delete from local uploads folder
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return { path, public_id };
  } catch (error) {
    console.log(error);
    throw new AppError("Something went wrong", 500);
  }
};

//* delete file from cloudinary

export const deleteFileFormCloudinary = async (public_id: string) => {
  
  try {
    await cloudinary.uploader.destroy(public_id);
    return true;
    
  } catch (error) {
    console.log(error);
    throw new AppError("something went wrong", 500);
    
    
  }
};

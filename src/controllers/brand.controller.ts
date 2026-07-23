import { NextFunction, Request, Response } from "express"
import Brand from  "../models/brand.model"
import { sendResponse } from "../utils/sendResponse.utils";
import { catchAsync } from "../utils/catch.Async.utils";
import AppError from "../utils/apperror.utils";
import { deleteFileFormCloudinary, uploadFileToCloudinary } from "../utils/cloudinary.util";

//* get all
export const getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,

) => {
    try {
        const brands = await Brand.find({});

        //* send success response
        sendResponse(res, {
            data: brands,
            message: "brands fetched",
            statusCode: 200,
        });
        
    } catch (error) {
        next(error);
        
    }
}

//* get by id

export const getById = catchAsync (async (req: Request, res: Response) => {
  const { id } = req.params;
  const brand = await Brand.findOne({ _id: id });

  if (!brand) throw new AppError("brand not found", 404);
  //* send success response
  sendResponse(res, {
    data: brand,
    message: "brand fetched",
    statusCode: 200,
  });
});


//* create
export const crate = catchAsync(async (req, res) => {
    const { name, description } = req.body;
    const file = req.file;
    if(!file) throw new AppError("cover_image is required", 400);

    const brand = new Brand({ name, description});
    
    const { path, public_id} = await uploadFileToCloudinary(file, "/brands");

    brand.logo = {
        path,
        public_id,
    };

    await brand.save();

    sendResponse(res, {
        message: "brand created",
        data: brand,
        statusCode: 201,
    });
});

//* update
export const update = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;

    const brand = await Brand.findOne({ _id: id });

    if(!brand) throw new AppError("brand not found", 404);

    if (name) brand.name = name;
    if(description) brand.description;

    if(file){
        //! delete old logo
        deleteFileFormCloudinary(brand.logo.public_id);
        //* uploead new logo
        const { path, public_id} = await uploadFileToCloudinary(file, "/brands");

        brand.logo = {
          path,
          public_id,
        };
    }    

        await brand.save();

        sendResponse(res, {
            message: "brand updated",
            data: brand,
            statusCode: 200,
        });
    
});

//* delete
export const remove = catchAsync(async (req, res) => {
    const { id }  = req.params;

    const brand = await Brand.findOne({ _id: id });

    if(!brand) throw new AppError("brand not found", 404);
    deleteFileFormCloudinary(brand.logo.public_id);

    await brand.deleteOne();

    
        sendResponse(res, {
            message: "brand updated",
            data: brand,
            statusCode: 200,
        });

    
});

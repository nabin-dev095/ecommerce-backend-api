import { NextFunction, Request, Response } from "express";
import { Role } from "../types/enum.types";
import AppError from "../utils/apperror.utils";
import { verifyToken } from "../utils/jwt.utils";

export const authenticate = (roles?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      //*1. get jwt token
      //console.log(req.headers);
      const access_token = req.cookies["äccess_token"];
      console.log(access_token);
      if (!access_token) {
        throw new AppError("Unauthorized.Token required", 401);
      }

      //* 2. verify token
      const decoded_data = verifyToken(access_token);
      console.log(decoded_data);

      if (!decoded_data) {
        throw new AppError("Unauthorized.Invalid token", 401);
      }

      //*3. check user role
      if (roles && roles.length > 0 && !roles.includes(decoded_data.role)) {
        throw new AppError("Can not access this resource", 403);
      }
      req.user = {
        _id: decoded_data._id,
        email: decoded_data.email,
        role: decoded_data.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

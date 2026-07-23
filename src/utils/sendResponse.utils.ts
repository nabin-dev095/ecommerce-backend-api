import { Response } from "express";
interface IResponseData {
    message: string;
    data: any;
    statusCode: number;

}

export const sendResponse = ( res: Response, resData: IResponseData) => {
    const { data, message, statusCode} = resData;
    res.status(statusCode).json({
        message,
        data,
        success: String(statusCode).startsWith("2"),
        status: String(statusCode).startsWith("2")
        ? "success"
        :String(statusCode).startsWith("4")
        ? "fail"
        : "error",
    });
};
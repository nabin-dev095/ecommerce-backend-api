"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorhandler_middleware_1 = require("./middleware/errorhandler.middleware");
// npm i -D @types/express
//* express app instance 
const app = (0, express_1.default)();
//! using middlewares
app.use(express_1.default.json());
//! health check route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "server is up & running!!!",
        success: true,
        status: "success",
        data: null
    });
});
//! using routes
//!  using path not found route
app.use((req, res, next) => {
    const message = `can not ${req.method} on ${req.path}`;
    res.status(404).json({
        message,
        status: "'fail"
    });
});
//! error handler middleware
app.use(errorhandler_middleware_1.errorHandler);
exports.default = app;

const { StatusCodes } = require("http-status-codes");

const { ErrorResponse } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

function validateAuthRequest(req, res, next) {
  if (!req.body.email) {
    ErrorResponse.message = "Something went wrong while authentication user";
    ErrorResponse.error = new AppError(["Email is not found in the incoming request body"],StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.passwprd) {
    ErrorResponse.message = "Something went wrong while authentication user";
    ErrorResponse.error = new AppError(["password is not found in the incoming request body"],StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}
module.exports = {
    validateAuthRequest,
}
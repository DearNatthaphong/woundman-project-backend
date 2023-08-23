// สร้าง class
module.exports = class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
};

// // หรือสร้าง function
// createError = (message, statusCode) => {
//   const error = { message, statusCode };
//   // error.statusCode = statusCode
//   throw error;
// };

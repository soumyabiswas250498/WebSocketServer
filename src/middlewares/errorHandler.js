// errorMiddleware.js

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err, "***error3");
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Something went wrong, Try again!";

  res.status(statusCode).json({
    message: errorMessage,

    success: false,
  });
}

// export function errorHandler(err, req, res, next) {
//   console.error(err.message, "***");
//   res.status(500).json({ error: err.message });
// }

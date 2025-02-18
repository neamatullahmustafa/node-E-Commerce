let mod = "prod";
export const globalError = (err, req, res, next) => {
  let code = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  res.status(code).json({
    status: "error",
    message: message,
    error: err,
  });
};

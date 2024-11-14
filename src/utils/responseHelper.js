export function successResponse(
  res,
  data = {},
  message = "Operation successful"
) {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
}

import { ZodError } from "zod";
import { ApiError } from "../utils/errors.js";

export function validateData(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(
          (issue) => {
            if (issue.message === "Required") {
              return `${issue.path.join(".")} is ${issue.message}`.toUpperCase()
            } else {
              return issue.message.toUpperCase()
            }
          }
        );

        throw new ApiError(400, errorMessages[0]);
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}

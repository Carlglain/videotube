import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const HealthCheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "Health Check Passed", "Ok"));
});
export { HealthCheck };

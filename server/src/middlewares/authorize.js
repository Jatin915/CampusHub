// authorize(ROLES.SUPER_ADMIN)
// authorize(ROLES.OWNER)
// authorize(ROLES.ADMIN)

import ApiError from "../utils/ApiError.js";

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You are not authorized to perform this action."
      );
    }
    
    next();
  };
};  

export default authorize;
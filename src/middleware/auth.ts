import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError, UnauthorizedError } from "../errors";
import { verifyJWT } from "../helpers";

export interface AuthUserRequest extends Request {
  user?: { name: string; userId: string; role: string };
}

const authenticateUser = (
  req: AuthUserRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  // check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  // check cookies
  else if (req.signedCookies.token) {
    token = req.signedCookies.token;
  }

  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { name, userId, role } = verifyJWT({ token }) as {
      name: string;
      userId: string;
      role: string;
    };

    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("User cannot access this route");
  }
};

const authorizeRoles = (...roles: string[]) => {
  return (req: AuthUserRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role)) {
      throw new UnauthorizedError("User not allowed to access this route");
    }
    next();
  };
};

export { authenticateUser, authorizeRoles };

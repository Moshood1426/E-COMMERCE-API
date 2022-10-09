import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError } from "../errors";
import { verifyJWT } from "../helpers";

export interface AuthUserRequest extends Request {
  user?: { name: string; userId: object; role: string };
}

const authenticateUser = (
  req: AuthUserRequest,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.signedCookies as { token: string };

  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { name, userId, role } = verifyJWT({ token }) as {
      name: string;
      userId: object;
      role: string;
    };

    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("User cannot access this route");
  }
};

export { authenticateUser };

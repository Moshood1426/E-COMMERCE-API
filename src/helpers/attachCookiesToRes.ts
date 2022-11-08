import jwt from "jsonwebtoken";
import { Response } from "express";
import createJWT from "./createJWT";

//verify jwt
const verifyJWT = ({ token }: { token: string }) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

//attach cookies to response
const attachCookiesToRes = (
  res: Response,
  user: { name: string; userId: object; role: string }
) => {
  const token = createJWT(user);

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

export { verifyJWT, attachCookiesToRes };

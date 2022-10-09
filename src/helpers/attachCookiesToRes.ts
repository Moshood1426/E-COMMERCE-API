import jwt from "jsonwebtoken";
import { Response } from "express";
import createJWT from "./createJWT";
import { TokenUserArg } from "./createTokenUser";

const verifyJWT = ({ token }: { token: string }) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

const attachCookiesToRes = (
  res: Response,
  user: { name: string; userId: object; role: string }
) => {
  console.log(user);
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

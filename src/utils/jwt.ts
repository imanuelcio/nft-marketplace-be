import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;

export const signJwt = (payload: object) => {
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, secret);
};

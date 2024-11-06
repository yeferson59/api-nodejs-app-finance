import * as bcrypt from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import db from "@/config/db";
import { algoritmic, production, secretToken } from "@/config/index";
import { Session } from "@/interfaces/session.interface";
import { Response } from "express";

export const encryptPassword = async (pass: string) => {
  if (!pass) throw new Error("error");
  const password = await bcrypt.hash(pass, 11);
  return password;
};

export const setFirstUppercase = async (word: string) => {
  if (!word) return "";
  if (word.length === 1) return word.charAt(0).toUpperCase();
  return (
    word.charAt(0).toUpperCase() + word.slice(1, word.length).toLowerCase()
  );
};

export const validatePassword = async (password: string, hash: string) => {
  if (!password || !hash) return false;

  const isUser = await bcrypt.compare(password, hash);

  if (!isUser) return false;

  return isUser;
};

export const tokenCookie = async (payload: Session) => {
  const secret = new TextEncoder().encode(secretToken);
  const alg = algoritmic;

  const jwt = await new SignJWT(payload)
    .setIssuedAt()
    .setProtectedHeader({ alg })
    .setExpirationTime("7d")
    .sign(secret);

  return jwt;
};

export const setTokenDb = async (
  jwt: string,
  userId: string,
  expires: Date
) => {
  try {
    const {
      rows: [session],
    } = await db.query("SELECT ID FROM AUTH_SESSION WHERE USER_ID = $1", [
      userId,
    ]);
    if (session) {
      await db.query(
        "UPDATE AUTH_SESSION SET TOKEN = $2, EXPIRES = $3 WHERE ID = $1",
        [session.id, jwt, expires]
      );
      return;
    }
    await db.query(
      "INSERT INTO AUTH_SESSION(TOKEN, USER_ID, EXPIRES) VALUES($1, $2, $3)",
      [jwt, userId, expires]
    );
    return;
  } catch (error) {
    console.log(error);
    throw new Error("Not set token");
  }
};

export const verifiedToken = async (token: string, secret: Uint8Array) => {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: [algoritmic],
  });

  const {
    rows: [userSession],
  } = await db.query("SELECT * FROM AUTH_SESSION WHERE USER_ID = $1", [
    payload.userId,
  ]);

  await jwtVerify(userSession.token, secret, {
    algorithms: [algoritmic],
  });

  const date = userSession.expires as Date;

  if (
    userSession.user_id !== payload.userId ||
    date.toISOString() !== payload.expiresAt
  ) {
    return;
  }
  return payload;
};

export const handleErrorResponse = (
  res: Response,
  message: string,
  details: unknown = null,
  statusCode = 400
) => {
  res.status(statusCode).json({ message, details });
};

export const setAuthCookie = (res: Response, session: string) => {
  res.cookie("token", session, {
    httpOnly: true,
    secure: production,
    sameSite: "lax",
    path: "/",
  });
};

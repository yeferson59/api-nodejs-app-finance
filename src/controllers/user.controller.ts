import { Request, Response } from "express";
import db from "@/config/db.js";
import { z } from "zod";
import createUserSchema, { updateUserSchema } from "@/schemas/user.js";
import UserModel from "@/models/user.model.js";

const typeInputUser = z.string().uuid();

const handleErrorResponse = (
  res: Response,
  message: string,
  details?: unknown,
  statusCode: number = 400
) => {
  res.status(statusCode).json({ message, details });
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.getUsers();
    res.json(users);
  } catch (error) {
    handleErrorResponse(res, "Error retrieving users", error, 500);
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsedId = typeInputUser.safeParse(id);

  if (!parsedId.success) {
    return handleErrorResponse(res, "Invalid user ID", parsedId.error);
  }

  try {
    const user = await UserModel.getUser(parsedId.data);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    handleErrorResponse(res, "Error retrieving user", error, 500);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const parsedData = createUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    return handleErrorResponse(res, "Validation error", parsedData.error);
  }

  try {
    const newUser = await UserModel.createUser(parsedData.data);
    res.status(201).json(newUser);
  } catch (error) {
    handleErrorResponse(res, "Error creating user", error, 500);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsedId = typeInputUser.safeParse(id);
  if (!parsedId.success) {
    handleErrorResponse(res, "Invalid user ID", parsedId.error);
    return;
  }

  const parsedData = updateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    handleErrorResponse(res, "Invalid user data", parsedData.error);
    return;
  }

  try {
    const updatedUser = await UserModel.updateUser(
      parsedData.data,
      parsedId.data
    );
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(updatedUser);
  } catch (error) {
    handleErrorResponse(res, "Error updating user", error, 500);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsedId = typeInputUser.safeParse(id);

  if (!parsedId.success) {
    handleErrorResponse(res, "Invalid user ID", parsedId.error);
    return;
  }

  try {
    const deletedUser = await UserModel.deleteUser(parsedId.data);
    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(deletedUser);
  } catch (error) {
    handleErrorResponse(res, "Error deleting user", error, 500);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const {
      rows: [user],
    } = await db.query("SELECT * FROM AUTH_USER WHERE EMAIL = $1", [email]);
    return user || null;
  } catch (error) {
    console.error("Error retrieving user by email:", error);
    throw new Error("Error retrieving user by email");
  }
};

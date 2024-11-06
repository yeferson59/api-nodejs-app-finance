import { Response, Request } from "express";
import AdminModel from "@/models/admin.model";
import { z } from "zod";
import { CreateAdminSchema, updateAdminSchema } from "@/schemas/admin";

export const getAdmins = async (_eq: Request, res: Response) => {
  try {
    const admins = await AdminModel.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createAdmin = async (req: Request, res: Response) => {
  const { success, error, data } = await CreateAdminSchema.safeParseAsync(
    req.body
  );

  if (!success) {
    res.status(400).json({ error: error.flatten().fieldErrors });
    return;
  }

  try {
    const admin = await AdminModel.createAdmin(data);
    res.status(201).json(admin);
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsedId = await z.string().uuid().safeParseAsync(id);

  if (!parsedId.success) {
    res.status(400).json({ error: parsedId.error.flatten().formErrors });
    return;
  }

  try {
    const admin = await AdminModel.getAdmin(parsedId.data);
    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error retrieving admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsedId = await z.string().uuid().safeParseAsync(id);
  const { success, error, data } = await updateAdminSchema.safeParseAsync(
    req.body
  );

  if (!parsedId.success) {
    res.status(400).json({ error: parsedId.error.flatten().formErrors });
    return;
  }

  if (!success) {
    res.status(400).json({ error: error.flatten().fieldErrors });
    return;
  }

  try {
    const updatedAdmin = await AdminModel.updateAdmin(parsedId.data, data);
    if (!updatedAdmin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const parsedId = await z.string().uuid().safeParseAsync(id);

  if (!parsedId.success) {
    res.status(400).json({ error: parsedId.error.flatten().formErrors });
    return;
  }

  try {
    const deletedAdmin = await AdminModel.deleteAdmin(parsedId.data);
    if (!deletedAdmin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }
    res.status(200).json(deletedAdmin);
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

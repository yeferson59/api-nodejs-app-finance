import db from "@/config/db";
import { encryptPassword, setFirstUppercase } from "@/lib/auth-functions";
import { typeSignUp } from "@/schemas/auth";
import { TypeUpdateUser } from "@/schemas/user";

export default class UserModel {
  // Fetch all users with the 'user' role
  static async getUsers() {
    const query = `
      SELECT * FROM AUTH_USER 
      WHERE ROLE_ID = (SELECT ID FROM AUTH_ROLE WHERE NAME = 'user');
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // Fetch a single user by ID if they have the 'user' role
  static async getUser(id: string) {
    const query = `
      SELECT * FROM AUTH_USER 
      WHERE ID = $1 AND ROLE_ID = (SELECT ID FROM AUTH_ROLE WHERE NAME = 'user');
    `;
    try {
      const {
        rows: [user],
      } = await db.query(query, [id]);
      return user || null;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  // Create a new user with unique email
  static async createUser(data: typeSignUp) {
    const checkUserQuery = "SELECT * FROM AUTH_USER WHERE EMAIL = $1;";
    const {
      rows: [existingUser],
    } = await db.query(checkUserQuery, [data.email]);

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Prepare fields
    const passwordHash = await encryptPassword(data.password);
    const formattedName = await setFirstUppercase(data.name);
    const formattedLastName = await setFirstUppercase(data.last_name);

    // Get role ID for 'user'
    const roleQuery = "SELECT ID FROM AUTH_ROLE WHERE NAME = $1;";
    let roleId = 1; // Default role ID

    try {
      const {
        rows: [role],
      } = await db.query(roleQuery, ["user"]);
      if (role) roleId = role.id;
    } catch (error) {
      console.error("Error finding role ID:", error);
      throw new Error("Role ID not found");
    }

    // Insert the new user
    const insertQuery = `
      INSERT INTO AUTH_USER (NAME, LAST_NAME, EMAIL, PASSWORD, ROLE_ID) 
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    try {
      const {
        rows: [createdUser],
      } = await db.query(insertQuery, [
        formattedName,
        formattedLastName,
        data.email,
        passwordHash,
        roleId,
      ]);
      return createdUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  // Update an existing user by ID
  static async updateUser(data: TypeUpdateUser, id: string) {
    try {
      // Verifica que el email no esté duplicado si es parte de la actualización
      if (data.email) {
        const emailCheckQuery = `
          SELECT ID FROM AUTH_USER 
          WHERE EMAIL = $1 AND ID != $2 
          AND ROLE_ID = (SELECT ID FROM AUTH_ROLE WHERE NAME = 'user');
        `;
        const { rows: existingUsers } = await db.query(emailCheckQuery, [
          data.email,
          id,
        ]);
        if (existingUsers.length > 0) {
          throw new Error("Email already in use");
        }
      }

      // Prepara los campos para la actualización
      const updateFields: Partial<TypeUpdateUser> = {};
      if (data.password)
        updateFields.password = await encryptPassword(data.password);
      if (data.name) updateFields.name = await setFirstUppercase(data.name);
      if (data.last_name)
        updateFields.last_name = await setFirstUppercase(data.last_name);
      if (data.email) updateFields.email = data.email;

      const fields = Object.keys(updateFields) as Array<keyof TypeUpdateUser>;

      // Construye la consulta de actualización dinámica
      const setClause = fields
        .map((field, index) => `${field.toUpperCase()} = $${index + 2}`)
        .join(", ");
      const updateQuery = `
        UPDATE AUTH_USER 
        SET ${setClause} 
        WHERE ID = $1 AND ROLE_ID = (SELECT ID FROM AUTH_ROLE WHERE NAME = 'user') 
        RETURNING *;
      `;
      const values = [id, ...fields.map((field) => updateFields[field])];

      const {
        rows: [updatedUser],
      } = await db.query(updateQuery, values);
      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  // Delete a user by ID
  static async deleteUser(id: string) {
    const deleteQuery = `
      DELETE FROM AUTH_USER 
      WHERE ID = $1 AND ROLE_ID = (SELECT ID FROM AUTH_ROLE WHERE NAME = 'user') 
      RETURNING *;
    `;
    try {
      const {
        rows: [deletedUser],
      } = await db.query(deleteQuery, [id]);
      return deletedUser || null;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user");
    }
  }
}

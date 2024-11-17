import db from "@/config/db";
import { encryptPassword, setFirstUppercase } from "@/lib/auth-functions";
import { CreateAdminType } from "@/schemas/admin";
import { TypeUpdate } from "@/schemas/admin";

export default class AdminModel {
  static async getAllAdmins() {
    try {
      const { rows } = await db.query(
        "SELECT * FROM AUTH_USER WHERE ROLE_ID = (SELECT ID FROM AUTH_ROLE WHERE NAME = 'admin');"
      );
      return rows;
    } catch (error) {
      console.error("Error fetching admins:", error);
      throw new Error("Failed to fetch admins");
    }
  }

  static getAdmin(id: string) {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM AUTH_USER WHERE ID = $1 AND ROLE_ID = (SELECT ID FROM AUTH_ROLE WHERE NAME = 'admin');",
        [id],
        (error, result) => {
          if (error) {
            console.error("Error executing query:", error); // Puedes loguear el error
            reject(error); // Rechaza la promesa con el error
            return;
          }

          if (result.rows.length === 0) {
            reject(new Error("Admin not found")); // Rechaza si no se encuentra un admin
            return;
          }

          resolve(result.rows); // Resuelve con los resultados
        }
      );
    });
  }

  static async createAdmin(createAdmin: CreateAdminType) {
    try {
      // Obtén el ID del rol basándote en el nombre del rol proporcionado
      const {
        rows: [role],
      } = await db.query("SELECT ID FROM AUTH_ROLE WHERE NAME = $1", [
        createAdmin.role,
      ]);

      // Si no se encontró el rol, lanzar un error
      if (!role) {
        throw new Error("Role not found");
      }

      const passwordHash = await encryptPassword(createAdmin.password);
      createAdmin.name = await setFirstUppercase(createAdmin.name);
      createAdmin.last_name = await setFirstUppercase(createAdmin.last_name);

      // Realizar la inserción del admin en la tabla AUTH_USER
      const insertQuery = `
      INSERT INTO AUTH_USER (NAME, LAST_NAME, EMAIL, ROLE_ID, PASSWORD)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
      const insertValues = [
        createAdmin.name,
        createAdmin.last_name,
        createAdmin.email,
        role.id,
        passwordHash,
      ];

      const {
        rows: [admin],
      } = await db.query(insertQuery, insertValues);

      // Retornar el admin creado
      return admin;
    } catch (error) {
      console.error("Error creating admin:", error);
      throw new Error("Failed to create admin");
    }
  }

  static async updateAdmin(id: string, updateAdmin: TypeUpdate) {
    try {
      // Procesar los valores que necesiten manipulación antes de la actualización
      const updatedFields = { ...updateAdmin };
      // Capitalizar nombre y apellido si se proporcionan
      if (updatedFields.name) {
        updatedFields.name = await setFirstUppercase(updatedFields.name);
      }
      if (updatedFields.last_name) {
        updatedFields.last_name = await setFirstUppercase(
          updatedFields.last_name
        );
      }

      // Encriptar la contraseña si se proporciona
      if (updatedFields.password) {
        updatedFields.password = await encryptPassword(updatedFields.password);
      }

      // Obtener el ID del rol si `role` se incluye en los campos de actualización
      if (updatedFields.role) {
        const {
          rows: [role],
        } = await db.query("SELECT ID FROM AUTH_ROLE WHERE NAME = $1", [
          updatedFields.role,
        ]);

        if (!role) {
          throw new Error("Role not found");
        }
      }

      // Construcción dinámica de la consulta
      const fields = Object.keys(updatedFields);
      const values = Object.values(updatedFields);

      if (fields.length === 0) {
        throw new Error("No fields provided for update");
      }

      const setClause = fields
        .map((field, index) => `${field.toUpperCase()} = $${index + 2}`)
        .join(", ");

      const updateQuery = `
      UPDATE AUTH_USER
      SET ${setClause}
      WHERE ID = $1
      RETURNING *;
    `;

      const {
        rows: [updatedAdmin],
      } = await db.query(updateQuery, [id, ...values]);

      if (!updatedAdmin) {
        throw new Error("Admin not found");
      }

      return updatedAdmin;
    } catch (error) {
      console.error("Error updating admin:", error);
      throw new Error("Failed to update admin");
    }
  }

  static async deleteAdmin(id: string) {
    try {
      const deleteQuery = `
      DELETE FROM AUTH_USER
      WHERE ID = $1
      RETURNING *;
    `;

      const {
        rows: [deletedAdmin],
      } = await db.query(deleteQuery, [id]);

      if (!deletedAdmin) {
        throw new Error("Admin not found");
      }

      return deletedAdmin;
    } catch (error) {
      console.error("Error deleting admin:", error);
      throw new Error("Failed to delete admin");
    }
  }
}

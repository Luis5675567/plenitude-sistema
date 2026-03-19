import { pgTable, text, serial, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  enrollmentDate: date("enrollment_date").notNull(),
  dueDate: date("due_date").notNull(),
  photo: text("photo"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("admin"),
});

export const insertStudentSchema = createInsertSchema(students).omit({ id: true });
export const updateStudentSchema = insertStudentSchema.partial();

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type User = typeof users.$inferSelect;
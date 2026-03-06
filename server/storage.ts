import fs from "fs/promises";
import path from "path";
import { type Student, type InsertStudent } from "@shared/schema";

const DB_FILE = path.join(process.cwd(), "database", "alunos.json");

// Ensure the directory and file exist
async function ensureDb() {
  try {
    await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      const today = new Date();
      const in5Days = new Date(today);
      in5Days.setDate(today.getDate() + 5);
      
      const in30Days = new Date(today);
      in30Days.setDate(today.getDate() + 30);

      const past = new Date(today);
      past.setDate(today.getDate() - 10);

      const seedData: Student[] = [
        {
          id: 1,
          name: "João Silva",
          phone: "11988887777",
          enrollmentDate: "2023-01-10",
          dueDate: past.toISOString().split('T')[0],
          photo: null
        },
        {
          id: 2,
          name: "Maria Oliveira",
          phone: "11977776666",
          enrollmentDate: "2023-05-15",
          dueDate: in5Days.toISOString().split('T')[0],
          photo: null
        },
        {
          id: 3,
          name: "Carlos Souza",
          phone: "11966665555",
          enrollmentDate: "2023-11-20",
          dueDate: in30Days.toISOString().split('T')[0],
          photo: null
        }
      ];
      await fs.writeFile(DB_FILE, JSON.stringify(seedData, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Failed to initialize database", err);
  }
}

// Call once
ensureDb();

export interface IStorage {
  getStudents(): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, updates: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;
}

export class JsonStorage implements IStorage {
  private async readData(): Promise<Student[]> {
    try {
      const data = await fs.readFile(DB_FILE, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Failed to read data", err);
      return [];
    }
  }

  private async writeData(data: Student[]): Promise<void> {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  }

  async getStudents(): Promise<Student[]> {
    return await this.readData();
  }

  async getStudent(id: number): Promise<Student | undefined> {
    const students = await this.readData();
    return students.find((s) => s.id === id);
  }

  async createStudent(student: InsertStudent): Promise<Student> {
    const students = await this.readData();
    const id = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    const newStudent: Student = { ...student, id };
    students.push(newStudent);
    await this.writeData(students);
    return newStudent;
  }

  async updateStudent(id: number, updates: Partial<InsertStudent>): Promise<Student | undefined> {
    const students = await this.readData();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) return undefined;
    
    students[index] = { ...students[index], ...updates };
    await this.writeData(students);
    return students[index];
  }

  async deleteStudent(id: number): Promise<boolean> {
    const students = await this.readData();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) return false;
    
    students.splice(index, 1);
    await this.writeData(students);
    return true;
  }
}

export const storage = new JsonStorage();

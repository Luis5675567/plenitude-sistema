import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import express from "express";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// Setup multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  })
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  app.use(session({
    secret: process.env.SESSION_SECRET || 'plenitude-secret-1234',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }
  }));

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Authentication Middleware
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session && (req.session as any).user) {
      next();
    } else {
      res.status(401).json({ message: "Não autorizado" });
    }
  };

  // Auth Routes
  app.post(api.auth.login.path, (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      if (input.username === "admin" && input.password === "admin1234") {
        (req.session as any).user = { username: "admin" };
        res.json({ message: "Login realizado com sucesso" });
      } else {
        res.status(401).json({ message: "Usuário ou senha incorretos" });
      }
    } catch (err) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get(api.auth.me.path, requireAuth, (req, res) => {
    res.json((req.session as any).user);
  });

  // Upload Route
  app.post(api.upload.path, requireAuth, upload.single('photo'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Nenhuma foto enviada" });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });

  // Students Routes
  app.get(api.students.list.path, requireAuth, async (req, res) => {
    const students = await storage.getStudents();
    res.json(students);
  });

  app.get(api.students.get.path, requireAuth, async (req, res) => {
    const student = await storage.getStudent(Number(req.params.id));
    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    res.json(student);
  });

  app.post(api.students.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.students.create.input.parse(req.body);
      const student = await storage.createStudent(input);
      res.status(201).json(student);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Erro interno" });
    }
  });

  app.put(api.students.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.students.update.input.parse(req.body);
      const student = await storage.updateStudent(Number(req.params.id), input);
      if (!student) {
        return res.status(404).json({ message: "Aluno não encontrado" });
      }
      res.json(student);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Erro interno" });
    }
  });

  app.delete(api.students.delete.path, requireAuth, async (req, res) => {
    const success = await storage.deleteStudent(Number(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    res.status(204).send();
  });

  app.post(api.students.renew.path, requireAuth, async (req, res) => {
    const student = await storage.getStudent(Number(req.params.id));
    if (!student) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }

    const currentDue = new Date(student.dueDate);
    const newDue = new Date(currentDue);
    newDue.setDate(newDue.getDate() + 30);
    
    // Format YYYY-MM-DD
    const newDueStr = newDue.toISOString().split('T')[0];

    const updated = await storage.updateStudent(student.id, { dueDate: newDueStr });
    res.json(updated);
  });

  // Dashboard Stats
  app.get(api.dashboard.stats.path, requireAuth, async (req, res) => {
    const students = await storage.getStudents();
    
    let active = 0;
    let overdue = 0;
    let expiringSoon = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    students.forEach(s => {
      const due = new Date(s.dueDate);
      due.setHours(0, 0, 0, 0);

      if (due < today) {
        overdue++;
      } else if (due <= nextWeek) {
        expiringSoon++;
      } else {
        active++;
      }
    });

    res.json({
      total: students.length,
      active,
      overdue,
      expiringSoon
    });
  });

  return httpServer;
}

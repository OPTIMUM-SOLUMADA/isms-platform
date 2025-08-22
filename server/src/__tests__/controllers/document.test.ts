import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { DocumentController } from "@/controllers/document.controller";

import prisma from '@/database/mocks/prisma';
import { document } from "../mocks/data";
import multer from "multer";
import path from "path";

const controller = new DocumentController();

// config multer pour les tests (stockage en mémoire)
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
app.use(bodyParser.json());

// routes bindées au controller
// app.post("/documents", (req, res) => controller.create(req, res));
app.get("/documents/:id", (req, res) => controller.getById(req, res));
app.put("/documents/:id", (req, res) => controller.update(req, res));
app.delete("/documents/:id", (req, res) => controller.delete(req, res));
app.get("/documents", (req, res) => controller.list(req, res));

// route POST avec upload
app.post(
  "/documents",
  upload.single("file"), // nom du champ attendu dans le form
  (req, res) => controller.create(req, res)
);


describe("Document routes", () => {
  it("should create a document", async () => {
    
    prisma.document.create.mockResolvedValue(document); // ✅ mock création

    const res = await request(app).post("/documents").send({
        title: "My Policy",
        description: "Test policy",
        ownerId: "user123",
        categoryId: null,
    });

    expect(res.status).toBe(201);
  });

  it("should create a document with a file upload", async () => {
    const filePath = path.join(__dirname, "test-file.pdf");    

    prisma.document.create.mockResolvedValue(document);
 
    const res = await request(app)
      .post("/documents")
      .field("title", "Doc with file")
      .field("ownerId", "user123")
      .attach("file", filePath);

    expect(res.status).toBe(201);
  });

  it("should get a document by id", async () => {
    prisma.document.findUnique.mockResolvedValue(document);
    const res = await request(app).get(`/documents/${document.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(document.id);
  });

  it("should return 404 for unknown id", async () => {
    prisma.document.findUnique.mockResolvedValue(null); 
    const res = await request(app).get("/documents/invalid-id-123");
    expect(res.status).toBe(404);
  });

  it("should update a document", async () => {
    const updatedDoc = { ...document, title: "Updated title" };
    prisma.document.update.mockResolvedValue(updatedDoc);

    const res = await request(app)
      .put(`/documents/${document.id}`)
      .send({ title: "Updated title" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated title");
  });

  it("should delete a document", async () => {
    prisma.document.delete.mockResolvedValue(document); // ✅ simulate successful deletion
    const res = await request(app).delete(`/documents/${document.id}`);
    expect(res.status).toBe(204);
  });

  it("should list documents", async () => {
    const docs = [
        { ...document, id: "doc1", title: "Doc 1" },
        { ...document, id: "doc2", title: "Doc 2" },
    ];

    prisma.document.findMany.mockResolvedValue(docs); // ✅ mock du service

    const res = await request(app).get("/documents");
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0].title).toBe("Doc 1");
    expect(res.body[1].title).toBe("Doc 2");
  });
});

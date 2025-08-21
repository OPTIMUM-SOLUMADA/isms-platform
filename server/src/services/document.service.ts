import { Document, Prisma } from "@prisma/client";
import prisma from "@/database/prisma";
import { UserService } from "./user.service";

export class DocumentService {
    protected userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

    async createDocument(data: Prisma.DocumentCreateInput) {
        return prisma.Document.create({ data });
    }

    async getDocumentById(id: string) {
        return prisma.Document.findUnique({
            where: { id },
            include: {
                members: true,
            },
        });
    }

    async getDocumentByName(name: string) {
        return prisma.Document.findUnique({
            where: { name },
            include: {
                members: true,
            },
        });
    }

    async updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
        return prisma.Document.update({
            where: { id },
            data,
        });
    }

    async deleteDocument(id: string) {
        return prisma.Document.delete({ where: { id } });
    }

    async listDocuments() {
        return prisma.Document.findMany({
            include: {
                members: true,
            },
        });
    }

    async init() {
        // Add default Documents if not exists
        const Documents = [
            { name: "IT", description: "Information Technology" },
            { name: "DEV", description: "Development" },
            { name: "HR", description: "Human Resources" },
            { name: "ROP", description: "Responsable Operations" },
            { name: "Internal Audit", description: "Internal Audit" },
            { name: "Legal", description: "Legal" },
        ];

        const results: Document[] = [];

        for (const Document of Documents) {
            const existing = await this.getDocumentByName(Document.name);

            if (!existing) {
                console.log(`Creating Document: ${Document.name}`);
                const created = await this.createDocument({
                    ...Document,
                });
                results.push(created);
            }
        }

        return results;
    }
}

import { Request, Response } from "express";
import { ISOClauseService } from "@/services/isoclause.service";

const service = new ISOClauseService();

export class ISOClauseController {
    async create(req: Request, res: Response) {
        try {
            const { name, description, code } = req.body;
            const clause = await service.create({ name, description, code });
            return res.status(201).json(clause);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findAll(_req: Request, res: Response) {
        try {
            const clauses = await service.findAll();
            return res.json(clauses);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const clause = await service.findById(req.params.id!);
            if (!clause) return res.status(404).json({ error: "Clause not found" });
            return res.json(clause);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const clause = await service.update(req.params.id!, req.body);
            return res.json(clause);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await service.delete(req.params.id!);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async initialize(req: Request, res: Response) {
        try {
            const clauses = await service.init();
            return res.json(clauses);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}

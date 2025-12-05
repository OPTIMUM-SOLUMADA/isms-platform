// controllers/compliance.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ComplianceService } from '@/services/compliance.service';

const service = new ComplianceService();

export class ComplianceController {

  async listClause(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.listClause();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Id is required' });
      const result = await service.getById(id);
      if (!result) return res.status(404).json({ message: "Compliance not found" });
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  async createClauseCompliance(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.createClause(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  }

  async createDocumentCompliance(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.createDocument(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Id is required' });
      const result = await service.update(id, req.body);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: 'Id is required' });
      await service.delete(id);
      return res.json({ message: "Compliance deleted" });
    } catch (err) {
      return next(err);
    }
  }
}

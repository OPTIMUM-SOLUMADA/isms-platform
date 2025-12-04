// controllers/compliance.controller.ts
import { Request, Response } from 'express';
import { ComplianceService } from '@/services/compliance.service';

export class ComplianceController {
  private service = new ComplianceService();
  // -------------------------
  // CLAUSES
  // -------------------------
  async getClauses(req: Request, res: Response) {
    try {
      const clauses = await this.service.getAllClauses();
      res.status(200).json(clauses);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

    async updateClauseStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status, evidence } = req.body;
      const updated = await this.service.updateClauseStatus(id, status, evidence);
      res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // -------------------------
  // DOCUMENT COMPLIANCE
  // -------------------------
    async getDocumentCompliance(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const data = await this.service.getDocumentCompliance(id);
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

    async updateDocumentCompliance(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status, description } = req.body;
      const updated = await this.service.updateDocumentCompliance(id, status, description);
      res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // -------------------------
  // NON-CONFORMITIES
  // -------------------------
  async getNonConformities(req: Request, res: Response) {
    try {
      const ncs = await this.service.getAllNonConformities();
      res.status(200).json(ncs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createNonConformity(req: Request, res: Response) {
    try {
      const { type, description, documentId, userId } = req.body;
      const nc = await this.service.createNonConformity({ type, description, documentId, userId });

      res.status(201).json(nc);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

    async updateNonConformityStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const updated = await this.service.updateNonConformityStatus(id, status);
      res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // -------------------------
  // CORRECTIVE ACTIONS
  // -------------------------
    async getCorrectiveActions(req: Request, res: Response) {
    try {
      const nonConformityId = req.params.nonConformityId as string;
      const actions = await this.service.getCorrectiveActions(nonConformityId);
      res.status(200).json(actions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createCorrectiveAction(req: Request, res: Response) {
    try {
      const { nonConformityId, description, ownerId, dueDate } = req.body;
      const action = await this.service.createCorrectiveAction(nonConformityId, description, ownerId, dueDate);
      res.status(201).json(action);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

    async updateCorrectiveActionStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status, completedAt } = req.body;
      const updated = await this.service.updateCorrectiveActionStatus(id, status, completedAt);
      res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// services/compliance.service.ts

import { prismaPostgres } from "@/database/prisma";
import { Prisma } from '../../node_modules/.prisma/client/postgresql';

export class ComplianceService {

  // Lister toutes les conformités
  async listClause() {
    return prismaPostgres.clauseCompliance.findMany({
      include: {
        iso_clause: true,
        clause_compliance_risk: true,
        clause_compilance_status: true,
      },
      orderBy: { updated_at: "desc" }
    });
  }

  // Obtenir une conformité par ID
  async getById(id: string) {
    return prismaPostgres.clauseCompliance.findUnique({
      where: { id_clause_compliance: id },
      include: {
        iso_clause: true,
        clause_compliance_risk: true,
        clause_compilance_status: true,
      }
    });
  }

  // Créer une conformité
  async createClause(data: Prisma.ClauseComplianceCreateInput) {
    return prismaPostgres.clauseCompliance.create({
      data
    });
  }

  // Créer une conformité
  async createDocument(data: Prisma.ClauseComplianceCreateInput) {
    return prismaPostgres.clauseCompliance.create({
      data
    });
  }
  // Mettre à jour une conformité
  async update(id: string, data: Prisma.ClauseComplianceUpdateInput) {
    return prismaPostgres.clauseCompliance.update({
      where: { id_clause_compliance: id },
      data
    });
  }

  // Supprimer
  async delete(id: string) {
    return prismaPostgres.clauseCompliance.delete({
      where: { id_clause_compliance: id }
    });
  }

}

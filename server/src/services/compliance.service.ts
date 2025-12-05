// services/compliance.service.ts

import prisma from "@/database/prisma";

export class ComplianceService {

  // Lister toutes les conformités
  async listClause() {
    return prisma.documentCompliance.findMany({
      include: {
        document: true,
      },
      orderBy: { checkedAt: "desc" }
    });
  }

  // Obtenir une conformité par ID
  async getById(id: string) {
    return prisma.documentCompliance.findUnique({
      where: { id },
      include: { document: true }
    });
  }

  // Créer une conformité
  async createClause(data: any) {
    return prisma.clauseCompliance.create({
      data
    });
  }

  // Créer une conformité
  async createDocument(data: any) {
    return prisma.documentCompliance.create({
      data
    });
  }
  // Mettre à jour une conformité
  async update(id: string, data: any) {
    return prisma.documentCompliance.update({
      where: { id },
      data
    });
  }

  // Supprimer
  async delete(id: string) {
    return prisma.documentCompliance.delete({
      where: { id }
    });
  }

}

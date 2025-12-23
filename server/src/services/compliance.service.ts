// services/compliance.service.ts

import prisma from "@/database/prisma";

export class ComplianceService {

  // Lister toutes les conformités
  async listClause() {
    return prisma.clauseCompliance.findMany({
      include: {
        isoClause: true,
        document: true,
      },
      orderBy: { updatedAt: "desc" }
    });
  }

  // Obtenir une conformité par ID
  async getById(id: string) {
    return prisma.clauseCompliance.findUnique({
      where: { id },
      include: {
        isoClause: true,
      }
    });
  }

  // Obtenir une conformité par ID
  async getByDocument(documentId: string) {
    return prisma.clauseCompliance.findFirst({
      where: { documentId: documentId },
      include: {
        isoClause: true,
      }
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
    return prisma.clauseCompliance.create({
      data
    });
  }
  // Mettre à jour une conformité
  async update(id: string, data: any) {
    console.log(id, data);
    
    return prisma.clauseCompliance.update({
      where: { id },
      data
    });
  }

  // Supprimer
  async delete(id: string) {
    return prisma.clauseCompliance.delete({
      where: { id }
    });
  }

}

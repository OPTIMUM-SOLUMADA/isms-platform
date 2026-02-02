export {};

import { AuditStatus, AuditEventType, RoleType } from '@prisma/client';

interface AuditTarget {
    type: string;
    id: string;
}

interface LogPayload {
    event: AuditEventType;
    details: Record<string, any>;
    targets: AuditTarget[];
    status?: AuditStatus;
}

interface UserPayload {
    id: string;
    name: string | null;
    email: string;
    role: RoleType;
    isActive: boolean;
}

declare global {
    namespace Express {
        interface Request {
            // Accedena am alalan'ny req.user sy req.log ireto
            // Raha tsy asina dia tsy mandeha ilay run dev tsy vanona
            user?: UserPayload;
            log: (data: LogPayload) => Promise<void>;
        }
    }
}

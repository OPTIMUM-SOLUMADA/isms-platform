export {};

import { RoleType } from '@/types/roles';
import { AuditStatus, User } from '@prisma/client';
interface LogPayload {
    event: AuditEventType;
    details: Record<string, any>;
    targets: AuditTarget[];
    status?: AuditStatus;
}

declare global {
    namespace Express {
        interface Request {
            // Accedena am alalan'ny req.user sy req.log ireto
            // Raha tsy asina dia tsy mandeha ilay run dev tsy vanona
            user?: User;
            log: (data: LogPayload) => Promise<void>;
        }
    }
}

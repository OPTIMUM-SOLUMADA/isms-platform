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
            user?: User;
            log: (data: LogPayload) => Promise<void>;
        }
    }
}

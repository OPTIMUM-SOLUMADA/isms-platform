export {};

import { RoleType } from '@/types/roles';
import { User } from '@prisma/client';
interface LogPayload {
    event: AuditEventType;
    details: Record<string, any>;
    targets: AuditTarget[];
}

declare global {
    namespace Express {
        interface Request {
            user?: User;
            session: any;
            log: (data: LogPayload) => Promise<void>;
        }
    }
}

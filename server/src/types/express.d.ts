import { RoleType } from "@/types/roles";
import { User } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as express from 'express;'
import type { User } from "generated/prisma";


declare global{
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}
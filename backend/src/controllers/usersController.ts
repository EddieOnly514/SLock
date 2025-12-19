import type { Request, Response } from "express";
import type { UserProfile } from "../types/user";

type AuthenticatedRequest = Request & { user?: UserProfile };
const GENERIC_SERVER_ERROR = 'An unexpected server error occurred.';

async function getUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
        const userData = req.user; 

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' })
        }

        return res.status(200).json({ user: userData });
    } catch (error) {
        console.error("GETUSER ERROR:", error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}





export { getUser };

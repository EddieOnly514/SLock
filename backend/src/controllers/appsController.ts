import type { Request, Response } from "express";
import type { UserProfile } from "../types/user";
import { supabaseAdmin } from "../config/supabase";

const GENERIC_SERVER_ERROR = 'An unexpected server error occurred.';

type AuthenticatedRequest = Request & { user?: UserProfile };

async function getUserApps(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        const { error: appsError, data: appsData } = await supabaseAdmin.from('user_apps')
                                                                        .select(`*, tracked_apps (*)`)
                                                                        .eq('user_id', userData.id)

        if (appsError) {
            console.error('Error when fetching data from server: ', appsError);
            return res.status(500).json({ error: 'Error fetching tracked apps'});
        }

        if (!appsData) {
            return res.status(200).json({ apps: [] });
        } 

        return res.status(200).json({ apps: appsData });

    } catch (error) {
        console.error("GET USER APPS ERROR", error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}

async function addUserApp(req: AuthenticatedRequest, res: Response): Promise<Response> {
    throw new Error('Not implemented');
}

async function updateUserApp(req: AuthenticatedRequest, res: Response): Promise<Response> {
    throw new Error('Not implemented');
}

async function deleteUserApp(req: AuthenticatedRequest, res: Response): Promise<Response> {
    throw new Error('Not implemented');
}


export { getUserApps, addUserApp, updateUserApp, deleteUserApp }
import type { Request, Response } from "express";
import type { UserProfile } from "../types/user";
import { supabaseAdmin } from "../config/supabase";
import { validateAddAppPayload, validateUpdateAppPayload } from "../utils/validate";
import { AddAppData, UpdateAppData } from "../types/validation";

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
            return res.status(500).json({ error: 'Error fetching tracked apps' });
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
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        const { error: validationError, data: validationData } = validateAddAppPayload(req.body);

        if (validationError || !validationData ) {
            const message = validationError?.message || 'Error when validating app payload';
            return res.status(400).json({ error: message });
        }

        const { error: trackedAppError, data: trackedAppData } = await supabaseAdmin.from('tracked_apps').select('*').eq('id', validationData.app_id);

        if (trackedAppError) {
            console.error('Error when fetching data from server: ', trackedAppError);
            return res.status(500).json({ error: 'Error when fetching for tracked app' })
        }

        if (!trackedAppData || trackedAppData.length === 0) {
            return res.status(404).json({ error: 'App not found in catalog' });
        }

        const { error: userAppError, data: userAppData } = await supabaseAdmin
                                                        .from('user_apps').select('*')
                                                        .eq('user_id', userData.id).eq('app_id', validationData.app_id);

        if (userAppError) {
            console.error('Error when fetching data from server: ', userAppError);
            return res.status(500).json({ error: 'Error when fetching server for user app' })
        }

        if (userAppData && userAppData.length > 0) {
            return res.status(400).json({ error: 'User already has this app tracked' });
        }

        const finalAppData: AddAppData & { user_id: string } = { user_id: userData.id, app_id: validationData.app_id };

        if (validationData?.is_blocked === undefined) {
            finalAppData.is_blocked = false;
        } else {
            finalAppData.is_blocked = validationData.is_blocked;
        }

        if (validationData?.is_tracked === undefined) {
            finalAppData.is_tracked = true; 
        } else {
            finalAppData.is_tracked = validationData.is_tracked;
        }

        const { error: addedAppError, data: app } = await supabaseAdmin.from('user_apps')
                                                            .insert(finalAppData).select().single();
        
        if (addedAppError || !app) {
            console.error('Error when adding app to server: ', addedAppError);
            return res.status(500).json({ error: 'Error when adding app' })
        }

        const { error: appError, data: fetchedApp } = await supabaseAdmin.from('user_apps')
                                                            .select(`*, tracked_apps (*)`)
                                                            .eq('id', app.id).single()

        if (appError || !fetchedApp) {
            console.error('Error when fetching data from server: ', appError);
            return res.status(500).json({ error: 'Error fetching tracked apps' });
        }

        return res.status(201).json({ app: fetchedApp });
    } catch (error) {
        console.error("ADD USER APP ERROR: ", error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}

async function updateUserApp(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        const { error: validationError, data: validationData } = validateUpdateAppPayload(req.body);

        if (validationError || !validationData) {
            const message = validationError?.message || 'Error when validating update app payload';
            return res.status(400).json({ error: message });
        }

        const { error: reqUserAppError, data: reqUserApp } = await supabaseAdmin
                                                            .from('user_apps').select('*')
                                                            .eq('id', req.params.id).eq('user_id', userData.id);
        
        if (reqUserAppError) {
            throw reqUserAppError;
        }

        if (reqUserApp && reqUserApp.length === 0) {
            return res.status(404).json({ error: 'App not found' });
        }

        const updateAppFields: UpdateAppData = {};

        if (validationData?.is_blocked !== undefined) {
            updateAppFields.is_blocked = validationData.is_blocked;
        }

        if (validationData?.is_tracked !== undefined) {
            updateAppFields.is_tracked = validationData.is_tracked;
        }

        if (Object.keys(updateAppFields).length === 0) {
            return res.status(400).json({ error: 'At least one field must be provided for an update' });
        }

        const { error: updateAppError, data: app} = await supabaseAdmin.from('user_apps')
                                                    .update(updateAppFields).eq('id', req.params.id).select().single();

        if (updateAppError || !app) {
            throw updateAppError || Error('Error when updating from database');
        }

        const { error: appError, data: fetchedApp } = await supabaseAdmin.from('user_apps')
                                                    .select(`*, tracked_apps (*)`).eq('id', req.params.id).single();

        if (appError || !fetchedApp) {
            throw appError || Error('Error when fetching from database');
        }

        return res.status(200).json({ app: fetchedApp });
    } catch (error) {
        console.error("UPDATE USER APP ERROR: ", error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}

async function deleteUserApp(req: AuthenticatedRequest, res: Response): Promise<Response> {
    throw new Error('Not implemented');
}


export { getUserApps, addUserApp, updateUserApp, deleteUserApp }
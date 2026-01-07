import type { Request, Response } from "express";
import { validateAppUsagePayload } from "../utils/validate";
import { supabaseAdmin } from "../config/supabase";



async function upsertAppUsage(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User '});
        }

        const { error: validationError, data: validationData } = validateAppUsagePayload(req.body);

        if (validationError || !validationData) {
            return res.status(400).json({ error: validationError?.message ?? 'Error validating app usage payload'});
        }

        const { error: fetchRequestedAppError, data: requestedApp } = await supabaseAdmin.from('tracked_apps')
                                                                    .select('*').eq('id', validationData.app_id).single();
        
        if (fetchRequestedAppError) {
            throw fetchRequestedAppError;
        }

        if (!requestedApp) {
            return res.status(404).json({ error: 'app does not exist' });
        }

        const updateFields: Record<string, string | any> = {
                                                            user_id: userData.id,
                                                            app_id: validationData.app_id, 
                                                            date: validationData.date,
                                                            duration_minutes: validationData.duration_minutes,
                                                            sessions_count: validationData.sessions_count
                                                            }

        const { error: upsertError, data: app } = await supabaseAdmin.from('app_usage')
                                                        .upsert(updateFields, { onConflict: 'user_id,app_id,date' }).select().single();
        
        if (upsertError || !app) {
            throw upsertError || Error('Error when upserting app into database');
        }

        const { error: fetchError, data: usageData } = await supabaseAdmin.from('app_usage')
                                                        .select(`*, tracked_apps(*)`).eq('id', app.id).single();

        if (fetchError || !usageData) {
            throw fetchError || Error('Error when fetching app usage from database');
        }

        return res.status(200).json({ usage: usageData });
    } catch (error) {
        console.error('UPSERT APP USAGE ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}

async function getAppUsage(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        let query = supabaseAdmin.from('app_usage').select(`*, tracked_apps(*)`).eq('user_id', userData.id);

        if (req.query.date) {
            query = query.eq('date', req.query.date);
        }

        if (req.query.start_date) {
            query = query.gte('date', req.query.start_date);
        }

        if (req.query.end_date) {
            query = query.lte('date', req.query.end_date);
        }
                
        if (req.query.app_id) {
            query = query.eq('app_id', req.query.app_id);
        }

        if (req.query.limit) {
            query = query.limit(Number(req.query.limit));
        }

        const { error: fetchError, data: usageData } = await query.order('date', { ascending: false });

        if (fetchError) {
            throw fetchError;
        }

        if (!usageData || usageData.length === 0) {
            return res.status(200).json({ usage: [] });
        }

        return res.status(200).json({ usage: usageData });
    } catch (error) {
        console.error('GET APP USAGE ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}


export { upsertAppUsage, getAppUsage };
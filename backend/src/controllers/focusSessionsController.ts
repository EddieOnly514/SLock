import type { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { validateCreateSessionPayload, validateUpdateSessionPayload } from '../utils/validate';

const GENERIC_SERVER_ERROR = 'An unexpected server error has occured. Please try again.';

async function createFocusSession(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        const { error: validationError, data: validationData } = validateCreateSessionPayload(req.body);

        if (validationError || !validationData) {
            return res.status(400).json({ error: validationError?.message ?? 'Error when validating payload'})
        }

        const { error: createSessionError, data: createdSession } = await supabaseAdmin.from('focus_sessions').insert({ 
                                                                        user_id: userData.id, 
                                                                        start_time: new Date().toISOString(), 
                                                                        scheduled_duration: validationData.scheduled_duration}).select('id').single();

        if (createSessionError || !createdSession) {
            throw createSessionError || Error('Error when creating focus session');
        }


        const { error: mapSessionError } = await supabaseAdmin.from('focus_session_apps')
                                        .insert(validationData.app_ids.map((currentValue) => { return { session_id: createdSession.id, app_id: currentValue } }));
        
        if (mapSessionError) {
            throw mapSessionError;
        }


        const { error: fetchSessionError, data: sessionData } = await supabaseAdmin.from('focus_sessions')
                                                                .select(`*, focus_session_apps(tracked_apps(*))`).eq('id', createdSession.id).single();
        
        if (fetchSessionError || !sessionData) {
            throw fetchSessionError || Error('Error when fetching focus session from database');
        }

        return res.status(201).json({ session: sessionData });
    } catch (error) {
        console.error('CREATE FOCUS SESSION ERROR: ', error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}

async function getFocusSession(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        const { error: fetchFocusSessionsError, data: focusSessions } = await supabaseAdmin.from('focus_sessions')
                                                                        .select(`*, focus_session_apps(tracked_apps(*))`).eq('user_id', userData.id)
                                                                        .order('created_at', { ascending: false });
        
        if (fetchFocusSessionsError) {
            throw fetchFocusSessionsError;
        }

        if (focusSessions && focusSessions.length === 0) {
            return res.status(200).json({ sessions: [] });
        }

        return res.status(200).json({ sessions: focusSessions });
    } catch (error) {
        console.error('GET FOCUS SESSION ERROR: ', error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}

async function updateFocusSession(req: Request, res: Response): Promise<Response> {
    try {
        throw Error("Not implemented");
    } catch (error) {
        console.error('UPDATE FOCUS SESSION ERROR: ', error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}



export {
    createFocusSession,
    getFocusSession,
    updateFocusSession
}
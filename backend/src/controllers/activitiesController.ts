import type { Request, Response } from "express";
import { validateCreateActivityPayload } from "../utils/validate";
import { supabaseAdmin } from "../config/supabase";

async function createActivity(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User '});
        }

        const { error: validationError, data: validationData } = validateCreateActivityPayload(req.body);

        if (validationError || !validationData) {
            return res.status(400).json({ error: validationError?.message ?? 'Error when validating activity payload' });
        }

        const createActivityFields: Record<string, string> = {user_id: userData.id, type: validationData.type};

        if (validationData.circle_id !== undefined) {
            const { error: fetchUserFromCircleError, data: userExistsInCircle } = await supabaseAdmin.from('circle_members').select('*')
                                                                                    .eq('circle_id', validationData.circle_id).eq('user_id', userData.id).single();
            
            if (fetchUserFromCircleError) {
                throw fetchUserFromCircleError;
            }

            if (!userExistsInCircle) {
                return res.status(404).json({ error: 'User is not a part of circle '});
            }
            createActivityFields.circle_id = validationData.circle_id;
        }

        if (validationData.session_id !== undefined) {
            const { error: fetchUserFromSessionError, data: usersSession } = await supabaseAdmin.from('focus_sessions').select('*')
                                                                                    .eq('id', validationData.session_id).eq('user_id', userData.id).single();
            
            if (fetchUserFromSessionError) {
                throw fetchUserFromSessionError;
            }

            if (!usersSession) {
                return res.status(404).json({ error: 'Session does not belong to User '});
            }
            createActivityFields.session_id = validationData.session_id;
        }

        const { error: createActivityError, data: activity } = await supabaseAdmin
                                                        .from('activities')
                                                        .insert(createActivityFields)
                                                        .select('*')
                                                        .single();

        if (createActivityError || !activity) {
            throw createActivityError || Error('Error when creating activity');
        }

        return res.status(201).json({ activity });
    } catch (error) {
        console.error('CREATE ACTIVITY ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}

async function getActivities(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User '});
        }

        let query = supabaseAdmin
                        .from('activities')
                        .select('*')
                        .eq('user_id', userData.id);

        if (req.query.type) {
            query = query.eq('type', req.query.type);
        }

        if (req.query.circle_id) {
            query = query.eq('circle_id', req.query.circle_id);
        }

        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
        const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

        const { error: fetchActivitiesError, data: activities } = await query
                        .order('created_at', { ascending: false })
                        .range(offset, offset + limit - 1);

        if (fetchActivitiesError) {
            throw fetchActivitiesError;
        }

        if (activities && activities.length === 0) {
            return res.status(200).json({ activities: [] });
        }

        return res.status(200).json({ activities });
    } catch (error) {
        console.error('GET ACTIVITY ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}

export { createActivity, getActivities };

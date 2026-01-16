import type { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";
import { validateCreateSchedulePayload, validateUpdateSchedulePayload } from "../utils/validate";


async function getAppSchedules(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user; 

        if (userData === undefined) {
            return res.status(500).json({ error: 'Could not find User '});
        }

        const { error: appSchedulesFetchError, data: appSchedules } = await supabaseAdmin.from('app_schedules')
                                                                    .select(`*, tracked_apps(*)`).eq('user_id', userData.id);

        if (appSchedulesFetchError) {
            throw appSchedulesFetchError;
        }

        if (!appSchedules || appSchedules.length === 0) {
            return res.status(200).json({ app_schedules: [] });
        }

        return res.status(200).json({ app_schedules: appSchedules });

    } catch (error) {
        console.error('GET APP SCHEDULES ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}

async function createAppSchedule(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user; 

        if (userData === undefined) {
            return res.status(500).json({ error: 'Could not find User '});
        }

        const { error: validationError, data: validationData } = validateCreateSchedulePayload(req.body);

        if (validationError || !validationData) {
            return res.status(400).json({ error: validationError?.message ?? 'Error when validating app schedule payload' });
        }

        const { error: fetchTrackedAppError, data: requestedApp } = await supabaseAdmin.from('tracked_apps')
                                                                    .select('*').eq('id', validationData.app_id).single();
        
        if (fetchTrackedAppError) {
            throw fetchTrackedAppError;
        }

        if (!requestedApp) {
            return res.status(404).json({ error: 'App not found' });
        }

        const { error: createScheduleError, data: createdAppSchedule} = await supabaseAdmin.from('app_schedules')
                                                        .insert({...validationData, user_id: userData.id}).select('id').single();

        if (createScheduleError || !createdAppSchedule) {
            throw createScheduleError || Error('Error when creating app schedule');
        }

        const { error: fetchAppScheduleError, data: appSchedule} = await supabaseAdmin.from('app_schedules').select('*, tracked_apps(*)').eq('id', createdAppSchedule.id).single();
        
        if (fetchAppScheduleError || !appSchedule) {
            throw fetchAppScheduleError || Error('appSchedule could not be fetched');
        }

        return res.status(201).json({ app_schedule: appSchedule });

    } catch (error) {
        console.error('CREATE APP SCHEDULES ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}

async function updateAppSchedule(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User '});
        }

        const { error: validationError, data: validationData } = validateUpdateSchedulePayload(req.body);

        if (validationError || !validationData) {
            return res.status(400).json({ error: validationError?.message ?? 'Error when validating app schedule payload' });
        }

        if (Object.keys(validationData).length === 0) {
            return res.status(400).json({ error: 'At least one field must be provided for an update' });
        }

        const { error: fetchAppScheduleError, data: appSchedule } = await supabaseAdmin.from('app_schedules').select('*')
                                                                    .eq('id', req.params.id).eq('user_id', userData.id).single();
        
        if (fetchAppScheduleError) {
            throw fetchAppScheduleError;
        }

        if (!appSchedule) {
            return res.status(404).json({ error: 'App schedule not found' });
        }

        if (validationData.app_id !== undefined) {
            const { error: fetchTrackedAppError, data: requestedApp } = await supabaseAdmin.from('tracked_apps')
                                                                        .select('*').eq('id', validationData.app_id).single();
            
            if (fetchTrackedAppError) {
                throw fetchTrackedAppError;
            }

            if (!requestedApp) {
                return res.status(404).json({ error: 'App not found' });
            }
        }

        const updateFields: Record<string, any> = {...validationData};

        const { error: updateAppScheduleError } = await supabaseAdmin.from('app_schedules').update(updateFields).eq('id', req.params.id)
                                                .eq('user_id', userData.id);

        if (updateAppScheduleError) {
            throw updateAppScheduleError;
        }

        const { error: fetchUpdatedScheduleError, data: updatedAppSchedule } = await supabaseAdmin.from('app_schedules')
                                                                                .select('*, tracked_apps(*)').eq('id', req.params.id).single();
        
        if (fetchUpdatedScheduleError || !updatedAppSchedule) {
            throw fetchUpdatedScheduleError || Error('Error fetching updated app schedule');
        }

        return res.status(200).json({ app_schedule: updatedAppSchedule })                                                        
    } catch (error) {
        console.error('UPDATE APP SCHEDULES ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}

async function deleteAppSchedule(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User '});
        }

        const { error: fetchAppScheduleError, data: appSchedule } = await supabaseAdmin.from('app_schedules').select('*')
                                                                    .eq('id', req.params.id).eq('user_id', userData.id).single();
        
        if (fetchAppScheduleError) {
            throw fetchAppScheduleError;
        }

        if (!appSchedule) {
            return res.status(404).json({ error: 'App schedule not found' });
        }

        const { error: deleteAppScheduleError } = await supabaseAdmin.from('app_schedules')
                                        .delete().eq('id', req.params.id).eq('user_id', userData.id);

        if (deleteAppScheduleError) {
            throw deleteAppScheduleError;
        }

        return res.status(200).json({ message: 'App schedule deleted successfully!' });
    } catch (error) {
        console.error('DELETE APP SCHEDULES ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}


export { getAppSchedules, createAppSchedule, updateAppSchedule, deleteAppSchedule };
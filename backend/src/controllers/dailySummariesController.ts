import type { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";
import { validateGenerateDailySummaryPayload } from "../utils/validate";

const GENERIC_SERVER_ERROR = 'An unexpected server error has occured. Please try again.';

async function getDailySummaries(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        let query = supabaseAdmin.from('daily_summaries').select('*').eq('user_id', userData.id);

        if (req.query.date) {
            query = query.eq('date', req.query.date);
        }

        if (req.query.start_date) {
            query = query.gte('date', req.query.start_date);
        }

        if (req.query.end_date) {
            query = query.lte('date', req.query.end_date);
        }

        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
        const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

        const { error: fetchDailySummariesError, data: dailySummaries } = await query
                                                                        .order('date', { ascending: false })
                                                                        .range(offset, offset + limit - 1);
        
        if (fetchDailySummariesError) {
            throw fetchDailySummariesError;
        }

        if (!dailySummaries || dailySummaries.length === 0) { 
            return res.status(200).json({ daily_summaries: [] });
        }

        return res.status(200).json({ daily_summaries: dailySummaries });

    } catch (error) {
        console.error('GET DAILY SUMMARIES ERROR: ', error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}

async function generateOrUpdateDailySummary(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        const { error: validationError, data: validationData } = validateGenerateDailySummaryPayload(req.body);

        if (validationError) {
            return res.status(400).json({ error: validationError?.message ?? 'Error when validating daily summary payload' });
        }

        const today = new Date();
        const date = validationData?.date || today.toISOString().split('T')[0];

        const { error: fetchUsageRecordsError, data: usageRecords } = await supabaseAdmin.from('app_usage')
                                                                .select('*, tracked_apps(*)')
                                                                .eq('user_id', userData.id)
                                                                .eq('date', date);
        
        if (fetchUsageRecordsError) {
            throw fetchUsageRecordsError;
        }

        if (!usageRecords) {
            return res.status(500).json({ error: 'Error fetching app usage records' });
        }

        let total_minutes = 0;
        const per_app_data: Record<string, { duration_minutes: number; sessions_count: number; app_name?: string }> = {};

        for (let i = 0; i < usageRecords.length; i++) {
            const record = usageRecords[i];
            const duration = record.duration_minutes || 0;
            const sessions = record.sessions_count || 0;
            
            total_minutes += duration;

            const trackedApp = record.tracked_apps;
            per_app_data[record.app_id] = {
                duration_minutes: duration,
                sessions_count: sessions,
                app_name: trackedApp?.name || undefined
            };
        }

        const { error: upsertError, data: dailySummary } = await supabaseAdmin.from('daily_summaries')
                                                                .upsert({
                                                                    user_id: userData.id,
                                                                    date: date,
                                                                    total_minutes: total_minutes,
                                                                    per_app_data: per_app_data
                                                                }, { onConflict: 'user_id,date' })
                                                                .select()
                                                                .single();

        if (upsertError || !dailySummary) {
            throw upsertError || Error('Error when upserting daily summary');
        }

        return res.status(200).json({ daily_summary: dailySummary });
    } catch (error) {
        console.error('GENERATE OR UPDATE DAILY SUMMARY ERROR: ', error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}


export { getDailySummaries, generateOrUpdateDailySummary };
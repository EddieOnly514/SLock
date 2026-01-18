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

    } catch (error) {
        console.error('GENERATE OR UPDATE DAILY SUMMARY ERROR: ', error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}


export { getDailySummaries, generateOrUpdateDailySummary };
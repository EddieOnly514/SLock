import type { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";

// add filtering later for this function
async function getCatalog(req: Request, res: Response): Promise<Response> {
    try {
        const { error: catalogError, data: catalogData } = await supabaseAdmin.from('tracked_apps').select('*');

        if (catalogError || !catalogData) {
            throw catalogError || Error('Error occured when fetching from database');
        }

        if (catalogData && catalogData.length === 0) {
            return res.status(200).json({ apps: [] });
        }

        return res.status(200).json({ apps: catalogData });
    } catch (error) {
        console.error("ERROR WHEN FETCHING CATALOG: ", error);
        return res.status(500).json({ error: 'An unexpected server error occurred.' });
    }
}

export { getCatalog };


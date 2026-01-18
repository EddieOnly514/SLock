import type { Request, Response } from "express";

async function getDailySummaries(req: Request, res: Response): Promise<Response> {}

async function generateOrUpdateDailySummary(req: Request, res: Response): Promise<Response> {}


export { getDailySummaries, generateOrUpdateDailySummary };
import type { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { validateCreateCirclePayload } from '../utils/validate';

const GENERIC_SERVER_ERROR = 'An unexpected server error has occurred. Please try again.';

async function createCircle(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        const { error: validationError, data: validationData } = validateCreateCirclePayload(req.body);

        if (validationError || !validationData) {
            return res.status(400).json({
                error: validationError?.message ?? 'Error when validating create circle payload',
            });
        }

        const { error: createCircleError, data: newCircle } = await supabaseAdmin
            .from('circles')
            .insert({
                name: validationData.name,
                created_by: userData.id,
            })
            .select()
            .single();

        if (createCircleError || !newCircle) {
            throw createCircleError ?? new Error('Failed to create circle');
        }

        const { error: addMemberError } = await supabaseAdmin.from('circle_members').insert({
            circle_id: newCircle.id,
            user_id: userData.id,
        });

        if (addMemberError) {
            await supabaseAdmin.from('circles').delete().eq('id', newCircle.id);
            throw addMemberError;
        }

        return res.status(201).json({ circle: newCircle });
    } catch (error) {
        console.error('CREATE CIRCLE ERROR: ', error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}


async function getCircles(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        const { error: membershipError, data: memberships } = await supabaseAdmin
            .from('circle_members')
            .select('circle_id')
            .eq('user_id', userData.id);

        if (membershipError) {
            throw membershipError;
        }

        if (!memberships || memberships.length === 0) {
            return res.status(200).json({ circles: [] });
        }

        const circleIds = memberships.map((m) => m.circle_id);

        const { error: circlesError, data: circles } = await supabaseAdmin
            .from('circles')
            .select('*')
            .in('id', circleIds);

        if (circlesError) {
            throw circlesError;
        }

        return res.status(200).json({ circles: circles || [] });
    } catch (error) {
        console.error('GET CIRCLES ERROR: ', error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}

export { createCircle, getCircles };

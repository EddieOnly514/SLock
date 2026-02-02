import type { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { validateCreateCirclePayload, validateUpdateCirclePayload } from '../utils/validate';

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

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getCircle(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        const circleId = req.params.id;

        if (!circleId || typeof circleId !== 'string' || !uuidRegex.test(circleId.trim())) {
            return res.status(400).json({ error: 'Invalid circle ID' });
        }

        const { data: membership } = await supabaseAdmin
            .from('circle_members')
            .select('circle_id')
            .eq('circle_id', circleId)
            .eq('user_id', userData.id)
            .maybeSingle();

        if (!membership) {
            return res.status(403).json({ error: 'You are not a member of this circle' });
        }

        const { error: circleError, data: circle } = await supabaseAdmin
            .from('circles')
            .select('*')
            .eq('id', circleId)
            .maybeSingle();

        if (circleError) {
            throw circleError;
        }

        if (!circle) {
            return res.status(404).json({ error: 'Circle not found' });
        }

        return res.status(200).json({ circle });
    } catch (error) {
        console.error('GET CIRCLE ERROR: ', error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}

async function updateCircle(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        const circleId = req.params.id;

        if (!circleId || typeof circleId !== 'string' || !uuidRegex.test(circleId.trim())) {
            return res.status(400).json({ error: 'Invalid circle ID' });
        }

        const { error: validationError, data: validationData } = validateUpdateCirclePayload(req.body);

        if (validationError || !validationData) {
            return res.status(400).json({
                error: validationError?.message ?? 'Error when validating update circle payload',
            });
        }

        const { error: fetchError, data: circle } = await supabaseAdmin
            .from('circles')
            .select('id, created_by')
            .eq('id', circleId)
            .maybeSingle();

        if (fetchError) {
            throw fetchError;
        }

        if (!circle) {
            return res.status(404).json({ error: 'Circle not found' });
        }

        if (circle.created_by !== userData.id) {
            return res.status(403).json({ error: 'Only the circle creator can update it' });
        }

        const { error: updateError, data: updatedCircle } = await supabaseAdmin
            .from('circles')
            .update({ name: validationData.name })
            .eq('id', circleId)
            .select()
            .single();

        if (updateError || !updatedCircle) {
            throw updateError ?? new Error('Failed to update circle');
        }

        return res.status(200).json({ circle: updatedCircle });
    } catch (error) {
        console.error('UPDATE CIRCLE ERROR: ', error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}

async function deleteCircle(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        const circleId = req.params.id;

        if (!circleId || typeof circleId !== 'string' || !uuidRegex.test(circleId.trim())) {
            return res.status(400).json({ error: 'Invalid circle ID' });
        }

        const { error: fetchError, data: circle } = await supabaseAdmin
            .from('circles')
            .select('id, created_by')
            .eq('id', circleId)
            .maybeSingle();

        if (fetchError) {
            throw fetchError;
        }

        if (!circle) {
            return res.status(404).json({ error: 'Circle not found' });
        }

        if (circle.created_by !== userData.id) {
            return res.status(403).json({ error: 'Only the circle creator can delete it' });
        }

        await supabaseAdmin.from('activities').update({ circle_id: null }).eq('circle_id', circleId);

        const { error: membersError } = await supabaseAdmin
            .from('circle_members')
            .delete()
            .eq('circle_id', circleId);

        if (membersError) {
            throw membersError;
        }

        const { error: deleteError } = await supabaseAdmin.from('circles').delete().eq('id', circleId);

        if (deleteError) {
            throw deleteError;
        }

        return res.status(204).send();
    } catch (error) {
        console.error('DELETE CIRCLE ERROR: ', error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}

export { createCircle, getCircles, getCircle, updateCircle, deleteCircle };

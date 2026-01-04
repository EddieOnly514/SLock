import type { Request, Response } from "express";
import { validateUpdatePayload } from "../utils/validate";
import { supabaseAdmin } from "../config/supabase";

const GENERIC_SERVER_ERROR = 'An unexpected server error occurred.';

async function getUser(req: Request, res: Response): Promise<Response> {
    try {
        //TODO: possibly get rid of the ID since we are not going to need it
        const userData = req.user; 

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' })
        }

        return res.status(200).json({ user: userData });
    } catch (error) {
        console.error("GET USER ERROR: ", error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}

async function updateUser(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(500).json({ error: 'Could not find User' });
        }

        const validationResult = validateUpdatePayload(req.body);

        if (validationResult.error || !validationResult.data) {
            console.error("Update validation error: ", validationResult.error?.message);
            return res.status(400).json({ error: validationResult.error?.message });
        }

        const { username: newUsername, avatar_url: newAvatar_url } = validationResult.data; 
        const updateFields: Record<string, string | null> = {};

        if (newUsername) {
            const { data: fetchedData, error: fetchError } = await supabaseAdmin.from('users')
                                                            .select('username').eq('username', newUsername)
                                                            .neq('id', userData.id);
            
            if (fetchError) {
                throw fetchError;
            }

            if (fetchedData && fetchedData.length > 0) {
                return res.status(400).json({ error: 'Username is already taken'});
            }

            updateFields.username = newUsername;
        }
        
        if (newAvatar_url !== undefined) {
            updateFields.avatar_url = newAvatar_url;
        }

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ error: 'At least one field must be provided for update' });
        }

        const { data: updatedUser, error: updateError } = await supabaseAdmin
                                                            .from('users').update(updateFields)
                                                            .eq('id', userData.id)
                                                            .select('*')
                                                            .single();
        
        if (updateError || !updatedUser) {
            throw updateError || Error('Error when updating user from database');
        }

        return res.status(200).json({ user: updatedUser });

    } catch (error) {
        console.error("UPDATE USER ERROR: ", error);
        return res.status(500).json({ error: GENERIC_SERVER_ERROR });
    }
}




export { getUser, updateUser };

import type { Request, Response } from 'express';
import { validateFriendRequestPayload, validateUpdateFriendPayload } from '../utils/validate';
import { supabaseAdmin } from '../config/supabase';


async function sendFriendRequest(req: Request, res: Response): Promise<Response> {
    try { 
        const userData = req.user;

        if (userData === undefined) {
            return res.status(500).json({ error: 'Could not find User '});
        }

        const { error: validationError, data: validationData } = validateFriendRequestPayload(req.body);

        if (validationError || !validationData) {
            return res.status(400).json({ error: validationError?.message ?? 'Error when validating friend request payload' });
        }

        if (userData.id === validationData.friend_id) {
            return res.status(400).json({ error: 'User can not friend themselves '});
        }

        const { error: fetchFriendError, data: requestedFriend } = await supabaseAdmin.from('users').select('*').eq('id', validationData.friend_id).single();

        if (fetchFriendError) {
            throw fetchFriendError;
        }

        if (!requestedFriend) {
            return res.status(404).json({ error: 'user does not exist '});
        }

        const { error: fetchFriendRequestError, data: existingFriendships } = await supabaseAdmin.from('friends').select('*')
                                                                                .eq('user_id', userData.id).eq('friend_id', validationData.friend_id);
        
        if (fetchFriendRequestError) {
            throw fetchFriendRequestError;
        }

        if (existingFriendships && existingFriendships.length > 0) {
            const friendRequest = existingFriendships[0];
            if (friendRequest.status === "blocked") {
                return res.status(400).json({ error: 'Cannot send friend request to blocked user'});
            } else if (friendRequest.status === "accepted") {
                return res.status(400).json({ error: 'Already friends with user'});
            } else {
                return res.status(400).json({ error: 'friend request already exists'});
            }
        } 

        // sql has a default of pending for the friends table
        const { error: createFriendRequesError, data: createdFriendRequest } = await supabaseAdmin.from('friends')
                                                        .insert({ user_id: userData.id, friend_id: validationData.friend_id })
                                                        .select('id')
                                                        .single();
        
        if (createFriendRequesError || !createdFriendRequest) {
            throw createFriendRequesError || Error('Error when creating friend request');
        }

        // Fetch the created friendship with friend's user info
        const { error: fetchCreatedFriendRequestError, data: friendRequestWithUser } = await supabaseAdmin
                                                        .from('friends')
                                                        .select('*, users!friends_friend_id_fkey(id, username, email, avatar_url, created_at)')
                                                        .eq('id', createdFriendRequest.id)
                                                        .single();

        if (fetchCreatedFriendRequestError || !friendRequestWithUser) {
            throw fetchCreatedFriendRequestError || Error('Failed to retrieve friend request');
        }

        return res.status(201).json({ friend: friendRequestWithUser });
    } catch (error) {
        console.error('SEND FRIEND REQUEST ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}

async function getFriends(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (userData === undefined) {
            return res.status(500).json({ error: 'Could not find User '});
        }

        let query = supabaseAdmin.from('friends')
                        .select('*, users!friends_friend_id_fkey(id, username, email, avatar_url, created_at)')
                        .or(`user_id.eq.${userData.id},friend_id.eq.${userData.id}`);

        if (req.query.status) {
            query = query.eq('status', req.query.status);
        }

        if (req.query.direction) {
            if (req.query.direction === 'sent') {
                query = query.eq('user_id', userData.id);
            } else if (req.query.direction === 'received') {
                query = query.eq('friend_id', userData.id);
            }
        }

        const { error: fetchFriendsError, data: fetchedFriends } = await query;

        if (fetchFriendsError) {
            throw fetchFriendsError;
        }

        if (!fetchedFriends || fetchedFriends.length === 0) {
            return res.status(200).json({ friends: [] });
        }

        return res.status(200).json({ friends: fetchedFriends });
    } catch (error) {
        console.error('GET FRIENDS ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}

async function updateFriendRequest(req: Request, res: Response): Promise<Response> {
    try {
        throw Error('Not Implemented')
    } catch (error) {
        console.error('UPDATE FRIEND REQUEST ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}

async function deleteFriendRequest(req: Request, res: Response): Promise<Response> {
    try {
        throw Error('Not Implemented')
    } catch (error) {
        console.error('DELETE FRIEND REQUEST ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}

export { sendFriendRequest, getFriends ,updateFriendRequest, deleteFriendRequest}
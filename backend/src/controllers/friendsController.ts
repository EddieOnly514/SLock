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
                                                        .select('*');
        
        if (createFriendRequesError || !createdFriendRequest || createdFriendRequest.length === 0) {
            throw createFriendRequesError || Error('Error when creating friend request');
        }

        // Fetch the created friendship with friend's user info
        const { error: fetchCreatedFriendRequestError, data: friendRequestWithUser } = await supabaseAdmin
                                                        .from('friends')
                                                        .select('*, users!friends_friend_id_fkey(id, username, email, avatar_url, created_at)')
                                                        .eq('id', createdFriendRequest[0].id)
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

        // Query friendships where user is either sender or receiver
        // We need to fetch differently based on direction to expand the correct "other" user
        
        let sentQuery = supabaseAdmin
                        .from('friends')
                        .select('*, users!friends_friend_id_fkey(id, username, email, avatar_url, created_at)')
                        .eq('user_id', userData.id);
        
        let receivedQuery = supabaseAdmin
                        .from('friends')
                        .select('*, users!friends_user_id_fkey(id, username, email, avatar_url, created_at)')
                        .eq('friend_id', userData.id);

        // Apply status filter if provided
        if (req.query.status) {
            sentQuery = sentQuery.eq('status', req.query.status);
            receivedQuery = receivedQuery.eq('status', req.query.status);
        }

        // Apply direction filter / execute relevant queries
        let friends: any[] = [];

        if (req.query.direction === 'sent') {
            const { error, data } = await sentQuery;
            if (error) throw error;
            friends = data || [];
        } else if (req.query.direction === 'received') {
             const { error, data } = await receivedQuery;
             if (error) throw error;
             friends = data || [];
        } else {
            // Get both
            const [{ error: sentError, data: sentData }, { error: receivedError, data: receivedData }] = await Promise.all([
                sentQuery,
                receivedQuery
            ]);
            
            if (sentError) throw sentError;
            if (receivedError) throw receivedError;

            friends = [...(sentData || []), ...(receivedData || [])];
        }

        // const { error: fetchFriendsError, data: fetchedFriends } = await query;
        // if (fetchFriendsError) throw fetchFriendsError;
        const fetchedFriends = friends;

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
        const userData = req.user;

        if (userData === undefined) {
            return res.status(500).json({ error: 'Could not find User '});
        }

        const { error: validationError, data: validationData } = validateUpdateFriendPayload(req.body);

        if (validationError || !validationData) {
            return res.status(400).json({ error: validationError?.message ?? 'Error when validating update friend request payload' });
        }

        const { error: fetchedExistingFriendRequestError, data: existingFriendRequest } = await supabaseAdmin
                                                        .from('friends')
                                                        .select('*')
                                                        .eq('id', req.params.id)
                                                        .or(`user_id.eq.${userData.id},friend_id.eq.${userData.id}`)
                                                        .single();

        if (fetchedExistingFriendRequestError) {
            throw fetchedExistingFriendRequestError;
        }

        if (!existingFriendRequest) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        if (validationData.status === 'accepted') {
            if (existingFriendRequest.friend_id !== userData.id) {
                return res.status(403).json({ error: 'Only the recipient can accept a friend request' });
            } 
        }

        if (validationData.status === 'pending') {
            return res.status(400).json({ error: 'Cannot update status to pending' });
        }


        const { error: updateFriendRequestError } = await supabaseAdmin
                                                        .from('friends')
                                                        .update({status: validationData.status})
                                                        .eq('id', req.params.id)
                                                        .eq('user_id', existingFriendRequest.user_id)
                                                        .eq('friend_id', existingFriendRequest.friend_id);

        if (updateFriendRequestError) {
            throw updateFriendRequestError;
        }

        const { error: fetchUpdatedFriendRequestError, data: updatedFriend } = await supabaseAdmin
                                                                                .from('friends')
                                                                                .select('*, users!friends_friend_id_fkey(id, username, email, avatar_url, created_at)')
                                                                                .eq('id', req.params.id)
                                                                                .single();

        if (fetchUpdatedFriendRequestError || !updatedFriend) {
            throw fetchUpdatedFriendRequestError || Error('Could not fetch friend');
        }

        return res.status(200).json({ friend: updatedFriend });
    } catch (error) {
        console.error('UPDATE FRIEND REQUEST ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}

async function deleteFriendRequest(req: Request, res: Response): Promise<Response> {
    try {
        const userData = req.user;

        if (userData === undefined) {
            return res.status(500).json({ error: 'Could not find User '});
        }

        const { error: fetchExistingFriendRequestError, data: existingFriendRequest } = await supabaseAdmin.from('friends').select('*')
                                                                    .eq('id', req.params.id).or(`user_id.eq.${userData.id},friend_id.eq.${userData.id}`).single();
        
        if (fetchExistingFriendRequestError) {
            throw fetchExistingFriendRequestError;
        }

        if (!existingFriendRequest) {
            return res.status(404).json({ error: 'Friend request not found' });
        }

        const { error: deleteFriendRequestError } = await supabaseAdmin.from('friends').delete().eq('id', req.params.id);

        if (deleteFriendRequestError) {
            throw deleteFriendRequestError;
        }

        return res.status(200).json({ message: 'friend request deleted succesfully!'})
    } catch (error) {
        console.error('DELETE FRIEND REQUEST ERROR: ', error);
        return res.status(500).json({ error: 'An unexpected server error has occured' });
    }
}

export { sendFriendRequest, getFriends ,updateFriendRequest, deleteFriendRequest}

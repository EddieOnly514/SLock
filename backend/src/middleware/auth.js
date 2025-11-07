import { supabaseClient } from "../config/supabase.js";

async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';
        const [scheme, token] = authHeader.split(' ');

        if (scheme !== 'Bearer' || !token) {
            return res.status(401).json({ error: 'Missing or invalid Authorization header' });
        }

        const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);

        if (userError || !userData?.user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const { data: profileData, error: profileError } = await supabaseClient.from('users').select('*').eq('id', userData.user.id).single();

        if (profileError) {
            return res.status(500).json({ error: profileError.message });
        }

        req.user = profileData;
        return next();
    } catch (err) {
        console.error('requireAuth error:', err);
        return res.status(500).json({ error: 'Authentication check failed'});
    }
}

export { requireAuth };

import { supabaseClient, supabaseAdmin } from "../config/supabase.js";
import { validateRegisterPayload, validateLoginPayload } from "../utils/validators/auth.js";

async function registerAccount(req, res) {
    try {
        const { data: validationData, error: validationError } = validateRegisterPayload(req.body);

        if (validationError) {
            console.error("Error with register validation: ", validationError.message);
            return res.status(400).json({ error: validationError.message });
        }

        const { email, username, password } = validationData;

        const { data: authData, error: authError } = await supabaseClient.auth.signUp({ email, password, options: { data: { username: username } } } );

        if (authError) {
            console.error('Error with signing in:', authError.message);
            return res.status(400).json({ error: authError.message }); 
        }

        const {error: userError} = await supabaseClient.from('users').update({privacy_preset: 'totals_only'}).eq('id', authData.user.id); 

        if (userError) {
            console.error('Error with inserting user data:', userError.message);
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            return res.status(400).json({ error: userError.message });
        }

        return res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('REGISTER ERROR:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function loginAccount(req, res) {
    try {
        const { data: validationData, error: validationError} = validateLoginPayload(req.body);

        if (validationError) {
            console.error('Error with login validation:', validationError.message);
            return res.status(400).json({ error: validationError.message });
        }

        const { email, password } = validationData;

        const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (loginError) {
            console.error('Error with logging in:', loginError.message);
            return res.status(401).json({ error: loginError.message });
        }

        const { data: userData, error: userError } = await supabaseClient.from('users').select('*').eq('id', loginData.user.id).single();

        if (userError) {
            console.error('Error with retrieving user data:', userError.message);
            return res.status(400).json({ error: userError.message });
        }

        return res.status(200).json({ 
                                    accessToken: loginData.session.access_token, 
                                    refreshToken: loginData.session.refresh_token,
                                    user: userData});
    } catch (error) {
        console.error('LOGIN ERROR: ', error);
        return res.status(500).json({ error: error.message });
    }

}


export { registerAccount, loginAccount };

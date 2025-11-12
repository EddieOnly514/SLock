import { supabaseClient, supabaseAdmin } from "../config/supabase.js";
import { validateRegisterPayload, validateLoginPayload, validateRefreshPayload } from "../utils/validators/auth.js";

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
    } catch (err) {
        console.error('REGISTER ERROR:', err.message);
        return res.status(500).json({ error: 'Registration failed due to server side issue.' });
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
            return res.status(500).json({ error: userError.message });
        }

        return res.status(200).json({ 
                                    accessToken: loginData.session.access_token, 
                                    refreshToken: loginData.session.refresh_token,
                                    user: userData});
    } catch (err) {
        console.error('LOGIN ERROR: ', err.message);
        return res.status(500).json({ error: 'Login failed due to server side issue.' });
    }

}


async function refreshSession(req, res) {
    try {
        const { data: validateData, error: validateError } = validateRefreshPayload(req.body);

        if (validateError) {
            return res.status(400).json({ error: validateError.message });
        }

        const { refreshToken } = validateData;

        const { data: refreshData, error: refreshError} = await supabaseClient.auth.refreshSession({ refresh_token: refreshToken });

        if (refreshError) {
            console.error('Error with refreshing user session:', refreshError.message);
            return res.status(500).json({ error: refreshError.message });
        }
        
        const { data: userData, error: userError } = await supabaseClient.from('users').select('*').eq('id', refreshData.user.id).single();

        if (userError) {
            console.error('Error with retrieving user data after refresh:', userError.message);
            return res.status(500).json({ error: userError.message });
        }

        return res.status(200).json({ 
                                    accessToken: refreshData.session.access_token, 
                                    refreshToken: refreshData.session.refresh_token,
                                    user: userData        
         });

    } catch (err) {
        console.error('REFRESH ERROR: ', err.message);
        return res.status(500).json({ error: 'Refresh session failed due to server side issue.' });
    }
}

async function logoutAccount(req, res) {
    try {
        const { data: validateData, error: validateError } = validateRefreshPayload(req.body)

        if (validateError) {
            console.log("Error when validating token: ", validateError);
            return res.status(400).json({error: validateError});
        }

        const authHeader = req.headers.authorization || '';
        const accessToken = authHeader.split(' ')[1];

        await supabaseClient.auth.setSession({ access_token: accessToken, refresh_token: validateData.refreshToken });

        const { error: signOutError } = await supabaseClient.auth.signOut({ scope: 'global' });

        if (signOutError) {
            console.log("Error when signing out:");
            return res.status(400).json({error: signOutError});
        }

        return res.status(200).json({ message: "Succesfully logged out!" });

    } catch (err) {
        console.error('LOGOUT ERROR: ', err.message);
        return res.status(500).json({ error: 'Logout failed due to server side issue.' });
    }
}


export { registerAccount, loginAccount, refreshSession, logoutAccount };

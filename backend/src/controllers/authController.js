import { supabaseClient, supabaseAdmin } from "../config/supabase.js";
import { validateRegisterPayload } from "../utils/validators/auth.js";

async function registerAccount(req, res) {
    try {
        const { data: validationData, error: validationError } = validateRegisterPayload(req.body);

        if (validationError) {
            console.error("Error with validation: ", validationError.message)
            return res.status(400).json({ error: validationError.message })
        }

        const { email, username, password } = validationData;

        const { data: authData, error: authError } = await supabaseClient.auth.signUp({ email, password, options: { data: { username: username } } } );

        if (authError) {
            console.error('Error with authentication:', authError.message);
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
        console.error('ERROR: ', error);
        return res.status(500).json({ error: error.message });
    }
}

// async function loginAccount(req, res) {}


export { registerAccount };

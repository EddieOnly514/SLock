import { supabase } from "../src/config/supabase.js";

async function testConnection() {
    try {
        const { data, error } = await supabase.from("nonexistent_table").select('*');
        if (error) {
            console.log("Connection Succesful! Although something went wrong with the query.")
            return;
        }
        console.log("Succesfully connected to the Database! Retrieved query:", data);
    } catch (error) {
        console.log("Failed to connect to database due to error:", error);
    } 
}



testConnection();
import AsyncStorage from "@react-native-async-storage/async-storage";

async function saveAccessToken(access_token: string): Promise<void> {
    try {
        await AsyncStorage.setItem('@access_token', access_token);
    } catch (err) {
        console.log("Error saving access token: ", err);
        throw new Error("Failed to save access token")
    }
}

async function getAccessToken(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem('@access_token');
    } catch (err) {
        console.log("Error accessing access token: ", err);
        throw new Error("Failed to retrieve access token")
    }
    
}

async function saveRefreshToken(refresh_token: string): Promise<void> {
    try {
        await AsyncStorage.setItem('@refresh_token', refresh_token);
    } catch (err) {
        console.log("Error saving refresh token: ", err);
        throw new Error("Failed to save refresh token");
    }
}

async function getRefreshToken(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem('@refresh_token');
    } catch (err) {
        console.log("Error accessing refresh token: ", err);
        throw new Error("Failed to access refresh token");
    }
    
}

async function clearTokens(): Promise<void> {
    try {
        await AsyncStorage.multiRemove(['@refresh_token', '@access_token'])
    } catch (err) {
        console.log("Error deleting tokens from storage: ", err);
    }
}


export { 
    saveAccessToken, 
    getAccessToken, 
    saveRefreshToken, 
    getRefreshToken,
    clearTokens
};
import { KeyboardAvoidingView, Platform, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../frontend/src/hooks/useAuth';
import { ScrollView } from 'react-native-gesture-handler';

//FIX UI/UX so it looks better but the logic is there
//Also extend functionality for the user to change other things about themselves (especially the profiile picture)

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, updateUser } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.username) {
            setUsername(user.username);
        }
    }, [user?.username])

    const handleSave = async () => {
        try {
            setLoading(true);
            await updateUser({ username });
            router.back();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update, please try again';
            setError(message);
        } finally {
            setLoading(false);
        }
    }


    return (
    <SafeAreaView>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
                <View>
                    {error ? (<View><Text>{error}</Text></View>) : null}
                    <Input 
                        label="Username"
                        placeholder="Enter edit for Username"
                        value={username}
                        onChangeText={setUsername}/>
                    <Button 
                        title="Save changes"
                        onPress={handleSave} 
                        loading={isLoading}
                        fullWidth/>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>)

}
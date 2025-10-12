import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';

export default function CreateProfileScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectPhoto = () => {
    // TODO: Implement image picker
    console.log('Select photo');
  };

  const handleContinue = async () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    setLoading(true);
    // TODO: Save profile to Firebase
    setTimeout(() => {
      setLoading(false);
      router.push('/onboarding/add-friends');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Your Profile</Text>
          <Text style={styles.subtitle}>
            Set up your identity in the SLock community
          </Text>
        </View>

        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={handleSelectPhoto}
            activeOpacity={0.7}
          >
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>📷</Text>
                <Text style={styles.photoPlaceholderLabel}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSelectPhoto}>
            <Text style={styles.changePhotoText}>
              {profilePhoto ? 'Change Photo' : 'Add Profile Photo'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Username Input */}
        <View style={styles.formSection}>
          <Input
            label="Username"
            placeholder="Choose a unique username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <Text style={styles.usernameHint}>
            This is how your friends will find you
          </Text>
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            fullWidth
            disabled={!username.trim()}
          />
          <TouchableOpacity
            onPress={() => router.push('/onboarding/add-friends')}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.lg,
  },
  header: {
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Colors.text.secondary,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  photoButton: {
    marginBottom: Theme.spacing.md,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: Theme.borderRadius.full,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.neutral[100],
    borderWidth: 2,
    borderColor: Colors.border.medium,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 40,
    marginBottom: Theme.spacing.xs,
  },
  photoPlaceholderLabel: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
  },
  changePhotoText: {
    fontSize: Theme.fontSize.md,
    color: Colors.primary[500],
    fontWeight: Theme.fontWeight.medium,
  },
  formSection: {
    marginBottom: Theme.spacing.xl,
  },
  usernameHint: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: -Theme.spacing.sm,
    marginLeft: Theme.spacing.xs,
  },
  footer: {
    marginTop: 'auto',
    gap: Theme.spacing.md,
  },
  skipText: {
    fontSize: Theme.fontSize.md,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
});

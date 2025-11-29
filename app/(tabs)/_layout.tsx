import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import Colors from '../../constants/Colors';
import Theme from '../../constants/Theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarStyle: {
          backgroundColor: Colors.background.secondary,
          borderTopColor: Colors.border.subtle,
          borderTopWidth: 1,
          paddingTop: 12,
          paddingBottom: 12,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: Theme.fontSize.sm,
          fontWeight: Theme.fontWeight.semibold,
          marginTop: 4,
        },
      }}
    >
      {/* New 3-tab structure: Lock, Friends, Rewards */}
      <Tabs.Screen
        name="lock"
        options={{
          title: 'Lock',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="🔒" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="👥" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="🏆" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <TabIcon icon="⚙️" color={color}/>
          ),
        }}
      />

      {/* Legacy tabs - hidden but kept for compatibility */}
      <Tabs.Screen
        name="social"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="apps"
        options={{
          href: null,
        }}
      />
      
    </Tabs>
  );
}

// Tab icon with glow effect for active state
function TabIcon({ icon, color }: { icon: string; color: string }) {
  const isActive = color === Colors.tabActive;
  return (
    <Text
      style={{
        fontSize: 28,
        opacity: isActive ? 1 : 0.5,
        textShadowColor: isActive ? Colors.glow.primary : 'transparent',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: isActive ? 8 : 0,
      }}
    >
      {icon}
    </Text>
  );
}

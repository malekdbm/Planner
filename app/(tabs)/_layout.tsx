import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '@/theme';

function Icon({ emoji, color }: { emoji: string; color: string }) {
  return <Text style={{ fontSize: 22, color }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 84,
          paddingTop: 6,
          paddingBottom: 24,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Icon emoji="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendrier"
        options={{
          title: 'Calendrier',
          tabBarIcon: ({ color }) => <Icon emoji="📅" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mariage"
        options={{
          title: 'Mariage',
          tabBarIcon: ({ color }) => <Icon emoji="💍" color={color} />,
        }}
      />
      <Tabs.Screen
        name="voyage"
        options={{
          title: 'Lune de miel',
          tabBarIcon: ({ color }) => <Icon emoji="✈️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reglages"
        options={{
          title: 'Réglages',
          tabBarIcon: ({ color }) => <Icon emoji="⚙️" color={color} />,
        }}
      />
    </Tabs>
  );
}

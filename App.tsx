import React, { useState } from 'react';
import { StatusBar, View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import ChatScreen from './src/screens/ChatScreen';
import ForumScreen from './src/screens/ForumScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import EventsScreen from './src/screens/EventsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const COLORS = {
  primary: '#10B981',      // Verde principal (igual ao site)
  primaryDark: '#059669',  // Verde escuro
  secondary: '#F59E0B',    // Laranja/amarelo
  dark: '#1F2937',         // Cinza escuro (igual ao site)
  white: '#FFFFFF',
  gray: '#6B7280',
  lightGray: '#F3F4F6',
};

type TabName = 'chat' | 'forum' | 'events' | 'messages' | 'profile';

interface TabItem {
  name: TabName;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  label: string;
}

const TABS: TabItem[] = [
  { name: 'chat', icon: 'chatbubble-ellipses-outline', iconActive: 'chatbubble-ellipses', label: 'Chat' },
  { name: 'forum', icon: 'newspaper-outline', iconActive: 'newspaper', label: 'Fórum' },
  { name: 'events', icon: 'calendar-outline', iconActive: 'calendar', label: 'Eventos' },
  { name: 'messages', icon: 'mail-outline', iconActive: 'mail', label: 'Mensagens' },
  { name: 'profile', icon: 'person-outline', iconActive: 'person', label: 'Perfil' },
];

function TabBar({ activeTab, setActiveTab }: { activeTab: TabName; setActiveTab: (tab: TabName) => void }) {
  const insets = useSafeAreaInsets();
  // Android navigation bar needs more space
  const bottomPadding = Platform.OS === 'android' ? Math.max(insets.bottom, 48) : Math.max(insets.bottom, 20);
  
  return (
    <View style={[styles.tabBar, { paddingBottom: bottomPadding }]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.name)}
          >
            <View style={[styles.tabIconContainer, isActive && styles.tabIconContainerActive]}>
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={22}
                color={isActive ? COLORS.white : COLORS.gray}
              />
            </View>
            <Text style={[
              styles.tabLabel,
              isActive && styles.tabLabelActive
            ]}>
              {tab.label}
            </Text>
            {tab.name === 'messages' && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainApp() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabName>('chat');
  const insets = useSafeAreaInsets();

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('chat');
  };

  if (!user) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatScreen user={user} />;
      case 'forum':
        return <ForumScreen user={user} />;
      case 'events':
        return <EventsScreen user={user} />;
      case 'messages':
        return <MessagesScreen user={user} />;
      case 'profile':
        return <ProfileScreen user={user} onLogout={handleLogout} />;
      default:
        return <ChatScreen user={user} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} translucent />
      
      {/* Main Content */}
      <View style={[styles.content, { paddingTop: insets.top }]}>
        {renderScreen()}
      </View>

      {/* Tab Bar */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  tabIconContainer: {
    width: 40,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  tabIconContainerActive: {
    backgroundColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: '20%',
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

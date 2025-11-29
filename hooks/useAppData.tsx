import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrackedApp, ScreenTimeData, FocusSession } from '../types';

interface AppDataContextType {
  trackedApps: TrackedApp[];
  screenTimeData: ScreenTimeData[];
  focusSessions: FocusSession[];
  addTrackedApp: (app: TrackedApp) => Promise<void>;
  removeTrackedApp: (appId: string) => Promise<void>;
  toggleAppBlock: (appId: string) => Promise<void>;
  startFocusSession: (appIds: string[], duration: number) => Promise<void>;
  completeFocusSession: (sessionId: string, wasCompleted: boolean) => Promise<void>;
  isLoading: boolean;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [trackedApps, setTrackedApps] = useState<TrackedApp[]>([]);
  const [screenTimeData, setScreenTimeData] = useState<ScreenTimeData[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appsJson, screenTimeJson, sessionsJson] = await Promise.all([
        AsyncStorage.getItem('@trackedApps'),
        AsyncStorage.getItem('@screenTimeData'),
        AsyncStorage.getItem('@focusSessions'),
      ]);

      if (appsJson) setTrackedApps(JSON.parse(appsJson));
      if (screenTimeJson) setScreenTimeData(JSON.parse(screenTimeJson));
      if (sessionsJson) setFocusSessions(JSON.parse(sessionsJson));
    } catch (error) {
      console.error('Error loading app data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTrackedApp = async (app: TrackedApp) => {
    try {
      const updated = [...trackedApps, app];
      await AsyncStorage.setItem('@trackedApps', JSON.stringify(updated));
      setTrackedApps(updated);
    } catch (error) {
      console.error('Error adding tracked app:', error);
    }
  };

  const removeTrackedApp = async (appId: string) => {
    try {
      const updated = trackedApps.filter((app) => app.id !== appId);
      await AsyncStorage.setItem('@trackedApps', JSON.stringify(updated));
      setTrackedApps(updated);
    } catch (error) {
      console.error('Error removing tracked app:', error);
    }
  };

  const toggleAppBlock = async (appId: string) => {
    try {
      const updated = trackedApps.map((app) =>
        app.id === appId ? { ...app, isBlocked: !app.isBlocked } : app
      );
      await AsyncStorage.setItem('@trackedApps', JSON.stringify(updated));
      setTrackedApps(updated);
    } catch (error) {
      console.error('Error toggling app block:', error);
    }
  };

  const startFocusSession = async (appIds: string[], duration: number) => {
    try {
      const newSession: FocusSession = {
        id: Date.now().toString(),
        userId: 'current-user', // TODO: Get from auth context
        appIds,
        startTime: new Date(),
        scheduledDuration: duration,
        wasCompleted: false,
        pointsEarned: 0,
        treeGrowth: 0,
      };

      const updated = [newSession, ...focusSessions];
      await AsyncStorage.setItem('@focusSessions', JSON.stringify(updated));
      setFocusSessions(updated);
    } catch (error) {
      console.error('Error starting focus session:', error);
    }
  };

  const completeFocusSession = async (sessionId: string, wasCompleted: boolean) => {
    try {
      const updated = focusSessions.map((session) => {
        if (session.id === sessionId) {
          const endTime = new Date();
          const actualDuration = Math.floor(
            (endTime.getTime() - new Date(session.startTime).getTime()) / 60000
          );
          const pointsEarned = wasCompleted ? actualDuration * 10 : 0;
          const treeGrowth = wasCompleted ? actualDuration * 0.5 : 0;

          return {
            ...session,
            endTime,
            actualDuration,
            wasCompleted,
            pointsEarned,
            treeGrowth,
          };
        }
        return session;
      });

      await AsyncStorage.setItem('@focusSessions', JSON.stringify(updated));
      setFocusSessions(updated);
    } catch (error) {
      console.error('Error completing focus session:', error);
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        trackedApps,
        screenTimeData,
        focusSessions,
        addTrackedApp,
        removeTrackedApp,
        toggleAppBlock,
        startFocusSession,
        completeFocusSession,
        isLoading,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}

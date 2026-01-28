import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingData {
  // Quiz responses
  lifeSatisfaction?: number; // 0-100
  lifeGoals?: string;
  isChronicallyOnline?: boolean; // Legacy field
  chronicallyOnlineLevel?: string; // New 5-option scale
  socialMediaHours?: number;

  // Personal info
  name?: string;
  gender?: string;
  age?: number;

  // Pricing
  selectedPlan?: 'free' | 'monthly' | 'yearly';
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  resetData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const TOTAL_STEPS = 11;

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState(0);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData({});
    setCurrentStep(0);
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        resetData,
        currentStep,
        setCurrentStep,
        totalSteps: TOTAL_STEPS,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

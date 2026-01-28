import React, { createContext, useContext, useState, useCallback } from 'react';

interface CircleOverlayContextType {
    isVisible: boolean;
    showOverlay: () => void;
    hideOverlay: () => void;
}

const CircleOverlayContext = createContext<CircleOverlayContextType | undefined>(undefined);

export function CircleOverlayProvider({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);

    const showOverlay = useCallback(() => {
        setIsVisible(true);
    }, []);

    const hideOverlay = useCallback(() => {
        setIsVisible(false);
    }, []);

    return (
        <CircleOverlayContext.Provider value={{ isVisible, showOverlay, hideOverlay }}>
            {children}
        </CircleOverlayContext.Provider>
    );
}

export function useCircleOverlay() {
    const context = useContext(CircleOverlayContext);
    if (!context) {
        throw new Error('useCircleOverlay must be used within a CircleOverlayProvider');
    }
    return context;
}

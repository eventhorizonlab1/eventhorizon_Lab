import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CinematicContextType {
    isCinematic: boolean;
    toggleCinematic: () => void;
    isMuted: boolean;
    toggleMute: () => void;
}

const CinematicContext = createContext<CinematicContextType | undefined>(undefined);

export const CinematicProvider = ({ children }: { children: ReactNode }) => {
    const [isCinematic, setIsCinematic] = useState(false);
    // Default to unmuted, but can be changed to true if preferred
    const [isMuted, setIsMuted] = useState(false);

    const toggleCinematic = () => setIsCinematic(prev => !prev);
    const toggleMute = () => setIsMuted(prev => !prev);

    return (
        <CinematicContext.Provider value={{ isCinematic, toggleCinematic, isMuted, toggleMute }}>
            {children}
        </CinematicContext.Provider>
    );
};

export const useCinematic = () => {
    const context = useContext(CinematicContext);
    if (!context) {
        throw new Error('useCinematic must be used within a CinematicProvider');
    }
    return context;
};

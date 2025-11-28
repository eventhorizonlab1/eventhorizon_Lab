import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CinematicContextType {
    isCinematic: boolean;
    setIsCinematic: (value: boolean) => void;
    toggleCinematic: () => void;
}

const CinematicContext = createContext<CinematicContextType | undefined>(undefined);

export const CinematicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isCinematic, setIsCinematic] = useState(false);

    const toggleCinematic = () => {
        setIsCinematic(prev => !prev);
    };

    return (
        <CinematicContext.Provider value={{ isCinematic, setIsCinematic, toggleCinematic }}>
            {children}
        </CinematicContext.Provider>
    );
};

export const useCinematic = (): CinematicContextType => {
    const context = useContext(CinematicContext);
    if (context === undefined) {
        throw new Error('useCinematic must be used within a CinematicProvider');
    }
    return context;
};

'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Định nghĩa kiểu cho đội
interface Team {
    id: string;
    name: string;
    logo: string;
    status: string;
}

// Định nghĩa kiểu cho context
interface TeamsContextType {
    teams: Team | null;
    updateTeams: (newTeams: Team) => void;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

interface TeamsProviderProps {
    children: ReactNode;
}

export const TeamsProvider: React.FC<TeamsProviderProps> = ({ children }) => {
    const [teams, setTeams] = useState<Team | null>();

    const updateTeams = (newTeams: Team) => {
        setTeams(newTeams);
        localStorage.setItem('teams', JSON.stringify(newTeams));
    };

    return (
        <TeamsContext.Provider value={{ teams, updateTeams }}>
            {children}
        </TeamsContext.Provider>
    );
};

export const useTeams = (): TeamsContextType => {
    const context = useContext(TeamsContext);

    if (!context) {
        throw new Error('useTeams must be used within a TeamsProvider');
    }

    return context;
};

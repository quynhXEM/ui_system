// components/CountdownTimer.tsx
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
    initialSeconds?: number;
    isActive: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialSeconds, isActive }) => {
    const [seconds, setSeconds] = useState<number>((initialSeconds ?? 0) * 60);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval!);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isActive, seconds]);

    const reset = () => {
        setSeconds((initialSeconds ?? 0) * 60);
    };

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div>
            <span>{formatTime(seconds)}</span>
        </div>
    );
};

export default CountdownTimer;

import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SLockLogoProps {
    size?: number;
}

export default function SLockLogo({ size = 140 }: SLockLogoProps) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
        >
            <Defs>
                <LinearGradient id="logoGradient" x1="0" y1="0" x2="0" y2="100">
                    <Stop offset="0%" stopColor="#3B82F6" />
                    <Stop offset="50%" stopColor="#14B8A6" />
                    <Stop offset="100%" stopColor="Colors.success[500]" />
                </LinearGradient>
            </Defs>

            <Path
                d="M70 25 C70 15 60 10 50 10 C35 10 25 20 25 32 C25 48 35 52 50 55 C65 58 75 62 75 78 C75 90 65 100 50 100 C40 100 30 95 30 85"
                stroke="url(#logoGradient)"
                strokeWidth={12}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </Svg>
    );
}

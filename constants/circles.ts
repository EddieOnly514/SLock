/**
 * Study Circle Mock Data & Constants
 */

// Commitment level type
export type CommitmentLevel = 'chill' | 'locked_in' | 'hardcore';
export type CircleMemberStatus = 'focused' | 'paused' | 'left';
export type BlockingPreset = 'default' | 'personal' | 'custom';

// Duration presets in minutes
export const DURATION_PRESETS = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '60 min', value: 60 },
    { label: '120 min', value: 120 },
];

// Commitment level configurations
export const COMMITMENT_LEVELS: {
    key: CommitmentLevel;
    label: string;
    icon: string;
    iconColor: string;
    description: string;
}[] = [
        {
            key: 'chill',
            label: 'Chill',
            icon: 'sunny-outline',
            iconColor: '#F59E0B',
            description: 'Warning only when drifting',
        },
        {
            key: 'locked_in',
            label: 'Locked In',
            icon: 'lock-closed',
            iconColor: '#3B82F6',
            description: 'Apps blocked during session',
        },
        {
            key: 'hardcore',
            label: 'Hardcore',
            icon: 'flame',
            iconColor: '#EF4444',
            description: 'Leaving = public shame',
        },
    ];

// Blocking preset options
export const BLOCKING_PRESETS = [
    {
        key: 'default' as const,
        label: 'Default Focus Apps',
        icon: 'star',
        iconColor: '#F59E0B',
        description: 'Recommended apps to block',
    },
    {
        key: 'personal' as const,
        label: 'My Personal List',
        icon: 'list',
        iconColor: '#8B5CF6',
        description: 'Use your saved block list',
    },
    {
        key: 'custom' as const,
        label: 'Custom',
        icon: 'create-outline',
        iconColor: '#10B981',
        description: 'Select specific apps',
    },
];

// Judgy crab messages
export const CRAB_MESSAGES = {
    focused: [
        '🦀 Everyone is locked in!',
        '💪 The circle is strong!',
        '🔥 You\'re all crushing it!',
        '⚡ Peak focus mode activated',
        '🎯 Deep work in progress...',
    ],
    someoneLeft: [
        '👀 Someone left the circle...',
        '🦀 *judging intensifies*',
        '😬 We noticed that...',
        '📉 One less in the circle',
    ],
    someonePaused: [
        '🤔 Someone\'s taking a break...',
        '☕ Brief pause detected',
        '⏸️ Someone stepped away',
    ],
    encouragement: [
        '🦀 Stay strong!',
        '💪 You can do this!',
        '🎯 Keep the focus!',
        '⭐ Almost there!',
    ],
    memberFocused: (name: string) => `${name} is locked in 🦀`,
    memberLeft: (name: string) => `${name} left the circle 😬`,
    memberPaused: (name: string) => `${name} took a break ☕`,
};

// Generate a random invite code
export const generateInviteCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Circle member interface for mock data
export interface CircleMember {
    id: string;
    circleId: string;
    userId: string;
    username: string;
    profilePhotoUrl?: string;
    status: CircleMemberStatus;
    joinedAt: Date;
    leftAt?: Date;
}

// Mock members for testing
export const MOCK_MEMBERS: CircleMember[] = [
    {
        id: 'm1',
        circleId: '1',
        userId: 'user1',
        username: 'Eddie',
        status: 'focused',
        joinedAt: new Date(),
    },
    {
        id: 'm2',
        circleId: '1',
        userId: 'user2',
        username: 'Sarah',
        status: 'focused',
        joinedAt: new Date(),
    },
    {
        id: 'm3',
        circleId: '1',
        userId: 'user3',
        username: 'Mike',
        status: 'paused',
        joinedAt: new Date(),
    },
    {
        id: 'm4',
        circleId: '1',
        userId: 'user4',
        username: 'Lisa',
        status: 'left',
        joinedAt: new Date(),
        leftAt: new Date(),
    },
];

// Theme colors EXACTLY from encodrix brand identity - TopBar logo-bar gradient
export const lightColors = {
    primary: {
        DEFAULT: '#1f5fcc', // Brand blue for CTAs and active states
        light: '#2f7bff',
        dark: '#143f8c',
        bg: '#e6f0ff',
        text: '#f8fafc',
        brand: '#1e3a8a',
        brandGradient: ['#1e3a8a', '#2c5282'], // Header bar gradient
        lightGradient: ['#f7f9fc', '#eef2f8'], // Soft panel background
        splashGradient: ['#0b1220', '#1f5fcc', '#2c5282'],
    },
    secondary: {
        DEFAULT: '#22c55e', // Green accent for success/review chips
        light: '#4ade80',
        dark: '#16a34a',
    },
    background: {
        DEFAULT: '#f5f7fb', // Cool near-white canvas like the dashboard
        light: '#ffffff',
        card: '#ffffff',
        gray: '#eef2f8',
    },
    stats: {
        blue: {
            bg: '#e6f0ff',
            text: '#1f4b99',
        },
        yellow: {
            bg: '#fff4d6',
            text: '#7a4d00',
        },
        green: {
            bg: '#e1f7ec',
            text: '#0f5132',
        },
        orange: {
            bg: '#fff1e5',
            text: '#9a3412',
        },
        purple: {
            bg: '#f3e8ff',
            text: '#5b21b6',
        },
        red: {
            bg: '#ffe4e6',
            text: '#b42318',
        },
    },
    text: {
        primary: '#0f172a',
        secondary: '#4b5563',
        muted: '#6b7280',
    },
    status: {
        active: '#22c55e',
        activeBg: '#e1f7ec',
        pending: '#f59e0b',
        pendingBg: '#fff4d6',
        inProgress: '#2563eb',
        inProgressBg: '#e6f0ff',
        completed: '#7c3aed',
        completedBg: '#f3e8ff',
        rejected: '#e11d48',
        rejectedBg: '#ffe4e6',
    },
    border: {
        DEFAULT: '#e2e8f0',
        light: '#f1f5f9',
    },
    gradient: {
        primary: ['#1e3a8a', '#2c5282'],
        light: ['#f7f9fc', '#eef2f8'],
    },
};

export const darkColors = {
    primary: {
        DEFAULT: '#7aa8ff', // Softer blue accent to avoid dark-mode navy cast
        light: '#9bc0ff',
        dark: '#4f7adf',
        bg: '#1f2a44',
        text: '#e7efff',
        brand: '#7aa8ff',
        brandGradient: ['#12203a', '#1f355c'],
        lightGradient: ['#0b1220', '#1b2a44'],
        splashGradient: ['#020617', '#0b1220', '#1f355c'],
    },
    secondary: {
        DEFAULT: '#22d3ee',
        light: '#67e8f9',
        dark: '#0891b2',
    },
    background: {
        DEFAULT: '#0e1526', // Charcoal base to neutralize blue
        light: '#111a2d',
        card: '#111a2d',
        gray: '#1b2438',
    },
    stats: {
        blue: {
            bg: '#1b2a44',
            text: '#a5bffb',
        },
        yellow: {
            bg: '#3a2a12',
            text: '#fbbf24',
        },
        green: {
            bg: '#0f2a1f',
            text: '#6ee7b7',
        },
        orange: {
            bg: '#3a2116',
            text: '#fda172',
        },
        purple: {
            bg: '#261c3a',
            text: '#c4b5fd',
        },
        red: {
            bg: '#3a1a24',
            text: '#fca5a5',
        },
    },
    text: {
        primary: '#e5e7eb',
        secondary: '#cbd5e1',
        muted: '#9ca3af',
    },
    status: {
        active: '#34d399',
        activeBg: '#0f2a1f',
        pending: '#fbbf24',
        pendingBg: '#3a2a12',
        inProgress: '#93c5fd',
        inProgressBg: '#1b2a44',
        completed: '#c4b5fd',
        completedBg: '#261c3a',
        rejected: '#fca5a5',
        rejectedBg: '#3a1a24',
    },
    border: {
        DEFAULT: '#1f2940',
        light: '#2a3550',
    },
    gradient: {
        primary: ['#12203a', '#1f355c'],
        light: ['#0b1220', '#1b2a44'],
    },
};

export const getColors = (theme: 'light' | 'dark') => {
    return theme === 'dark' ? darkColors : lightColors;
};

// Default export for backward compatibility
export const colors = lightColors;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
};

export const typography = {
    fontFamily: {
        regular: 'Manrope-Regular',
        medium: 'Manrope-Medium',
        semibold: 'Manrope-SemiBold',
        bold: 'Manrope-Bold',
    },
    sizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },
    weights: {
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
};

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
};


// Theme colors EXACTLY from encodrix brand identity - TopBar logo-bar gradient
export const colors = {
    primary: {
        DEFAULT: '#1e3a8a', // Primary button color - from TopBar logo-bar gradient end (#2c5282)
        light: '#3b82f6', // Light blue for accents
        dark: '#1e3a8a', // Dark blue - from TopBar logo-bar gradient start (#1e3a8a)
        bg: '#dbeafe', // Blue-100 background
        text: '#1e40af', // Blue-700 text
        brand: '#2c5282', // Brand text color (.brand-text-primary)
        brandGradient: ['#1e3a8a', '#2c5282'], // Brand gradient (.brand-bg-primary) - EXACT from TopBar logo-bar
        lightGradient: ['#f0f5ff', '#e6edff'], // Light gradient (.brand-bg-light)
        splashGradient: ['#0f172a', '#1e3a8a', '#312e81'], // Splash screen gradient (from-slate-900 via-blue-900 to-indigo-900)
    },
    secondary: {
        DEFAULT: '#3b82f6',
        light: '#60a5fa',
        dark: '#2563eb',
    },
    background: {
        DEFAULT: '#ffffff',
        light: '#ffffff',
        card: '#ffffff',
        gray: '#f5f7fa',
    },
    stats: {
        blue: {
            bg: '#dbeafe',
            text: '#1e40af',
        },
        yellow: {
            bg: '#fef3c7',
            text: '#92400e',
        },
        green: {
            bg: '#dcfce7',
            text: '#166534',
        },
        orange: {
            bg: '#ffedd5',
            text: '#9a3412',
        },
        purple: {
            bg: '#f3e8ff',
            text: '#6b21a8',
        },
        red: {
            bg: '#fee2e2',
            text: '#991b1b',
        },
    },
    text: {
        primary: '#111827',
        secondary: '#6b7280',
        muted: '#9ca3af',
    },
    status: {
        active: '#166534',
        activeBg: '#dcfce7',
        pending: '#92400e',
        pendingBg: '#fef3c7',
        inProgress: '#854d0e',
        inProgressBg: '#fffbeb',
        completed: '#0d9488',
        completedBg: '#f0fdfa',
        rejected: '#b91c1c',
        rejectedBg: '#fee2e2',
    },
    border: {
        DEFAULT: '#e5e7eb',
        light: '#f3f4f6',
    },
    gradient: {
        primary: ['#1e3a8a', '#2c5282'],
        light: ['#f0f5ff', '#e6edff'],
    },
};

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


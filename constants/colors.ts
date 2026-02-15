export interface ThemeColors {
  background: string;
  backgroundGradientStart: string;
  backgroundGradientEnd: string;
  card: string;
  cardShadow: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  accentDark: string;
  positive: string;
  negative: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  inputBg: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
  confidenceHigh: string;
  confidenceMedium: string;
  confidenceLow: string;
  watermark: string;
  overlay: string;
  white: string;
  pillBg: string;
}

export type ThemeKey = 'mintSage' | 'oceanBlue' | 'sunsetWarm';

export const themeNames: Record<ThemeKey, string> = {
  mintSage: 'Mint Sage',
  oceanBlue: 'Ocean Blue',
  sunsetWarm: 'Sunset Warm',
};

const themes: Record<ThemeKey, ThemeColors> = {
  mintSage: {
    background: '#F0F7F4',
    backgroundGradientStart: '#E8F5EE',
    backgroundGradientEnd: '#F5F9F7',
    card: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.06)',
    primary: '#3B9B6E',
    primaryDark: '#2D8A5E',
    primaryLight: '#E0F2E9',
    accent: '#F5D76E',
    accentDark: '#E8C84A',
    positive: '#4CAF50',
    negative: '#E57373',
    text: '#2D3436',
    textSecondary: '#8A9A9D',
    textTertiary: '#B0BEC5',
    border: '#E8EEE9',
    inputBg: '#F7FAF8',
    tint: '#3B9B6E',
    tabIconDefault: '#B0BEC5',
    tabIconSelected: '#3B9B6E',
    confidenceHigh: '#4CAF50',
    confidenceMedium: '#FFC107',
    confidenceLow: '#E57373',
    watermark: 'rgba(59, 155, 110, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    white: '#FFFFFF',
    pillBg: '#EDF5F0',
  },
  oceanBlue: {
    background: '#F0F4FA',
    backgroundGradientStart: '#E4EDF8',
    backgroundGradientEnd: '#F2F6FB',
    card: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.06)',
    primary: '#3B7DD8',
    primaryDark: '#2B6BC0',
    primaryLight: '#E0EDFA',
    accent: '#64D2FF',
    accentDark: '#38A3CC',
    positive: '#34C759',
    negative: '#FF6B6B',
    text: '#1C2D41',
    textSecondary: '#7B8FA0',
    textTertiary: '#A8B8C8',
    border: '#E2EAF0',
    inputBg: '#F5F8FC',
    tint: '#3B7DD8',
    tabIconDefault: '#A8B8C8',
    tabIconSelected: '#3B7DD8',
    confidenceHigh: '#34C759',
    confidenceMedium: '#FFB800',
    confidenceLow: '#FF6B6B',
    watermark: 'rgba(59, 125, 216, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    white: '#FFFFFF',
    pillBg: '#EAF1F9',
  },
  sunsetWarm: {
    background: '#FBF5F0',
    backgroundGradientStart: '#F8EDE4',
    backgroundGradientEnd: '#FDF8F5',
    card: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.06)',
    primary: '#D4764E',
    primaryDark: '#C0633B',
    primaryLight: '#FAEAE2',
    accent: '#F2C94C',
    accentDark: '#D4A837',
    positive: '#6FCF97',
    negative: '#EB5757',
    text: '#3C2A21',
    textSecondary: '#9A8478',
    textTertiary: '#C4B5AB',
    border: '#F0E6DE',
    inputBg: '#FBF7F4',
    tint: '#D4764E',
    tabIconDefault: '#C4B5AB',
    tabIconSelected: '#D4764E',
    confidenceHigh: '#6FCF97',
    confidenceMedium: '#F2C94C',
    confidenceLow: '#EB5757',
    watermark: 'rgba(212, 118, 78, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    white: '#FFFFFF',
    pillBg: '#F5EBE4',
  },
};

export default themes;

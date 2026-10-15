import { Platform } from 'react-native';
import { COLORS } from '../constants/colors';

export const theme = {
  colors: COLORS,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
    h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
    h3: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2 },
    h4: { fontSize: 16, fontWeight: '600' },
    subtitle: { fontSize: 14, fontWeight: '500' },
    body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
    bodyBold: { fontSize: 15, fontWeight: '600', lineHeight: 22 },
    caption: { fontSize: 12, fontWeight: '500' },
    captionBold: { fontSize: 12, fontWeight: '700' },
    button: { fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  },
  shadows: {
    none: {},
    sm: Platform.select({
      ios: {
        shadowColor: COLORS.navy,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
    md: Platform.select({
      ios: {
        shadowColor: COLORS.navy,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
    lg: Platform.select({
      ios: {
        shadowColor: COLORS.navy,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
  },
};


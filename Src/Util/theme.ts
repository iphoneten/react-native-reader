import { useColorScheme } from "react-native";

export const LightTheme = {
  primary: '#339AF0',
  background: '#fff',
  card: '#fff',
  text: '#000',
  border: '#ccc',
  notification: '#339AF0',
}

export const DarkTheme = {
  primary: '#339AF0',
  background: '#000',
  card: '#000',
  text: '#fff',
  border: '#ccc',
  notification: '#339AF0',
}

export type AppTheme = typeof LightTheme;

export function useAppTheme(): AppTheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? DarkTheme : LightTheme;
}
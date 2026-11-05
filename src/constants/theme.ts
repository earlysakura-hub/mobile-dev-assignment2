import { Dimensions } from 'react-native';

export const C = {
  background: '#0e1923',
  header: '#202127',
  panel: '#292d36',
  panelLight: '#373d48',
  card: '#1b3045',
  blue: '#1a9fff',
  softBlue: '#65b6e3',
  text: '#f0f1f2',
  muted: '#a4aab4',
  green: '#75a924',
};
export const DISPLAY_NAME = 'SteamUser'; // Change this if you want a different demo name.
export const SCREEN_WIDTH = Dimensions.get('window').width;

export const formatPrice = (amount: number) => `C$ ${amount.toFixed(2)}`;
export const demoAlert = (_title: string) => {};

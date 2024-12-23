/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Onboarding from './src/screens/onboarding/OnboardingScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import Otp from './src/screens/auth/OtpVerification';
import Details from './src/screens/auth/EnterDetails';
import TabLayout from './src/screens/tabs/TabLayout';
import { Provider, useDispatch, useSelector } from "react-redux"
import { RootState, store } from './src/state/store';
import { AxiosInstance } from './src/config/AxiosInstance';
import { setUser } from './src/state/user/userSlice';
import RootNavigator from './src/navigation/RootNavigation';
import { SocketContextProvider } from './src/context/SocketContext';
import { MenuProvider } from 'react-native-popup-menu';
import { I18nextProvider } from "react-i18next";
import i18n from './src/i18n';
type SectionProps = PropsWithChildren<{
  title: string;
}>;




function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';


  return (
    <SocketContextProvider>
      <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <RootNavigator />
       </I18nextProvider>
      </Provider>
    </SocketContextProvider>

  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

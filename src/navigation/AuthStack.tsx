import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import  { useContext, useEffect, useState } from 'react';
import Onboarding from '../screens/onboarding/OnboardingScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import Otp from '../screens/auth/OtpVerification';
import EnterDetailsScreen from '../screens/auth/EnterDetails';
import { AuthStackParamList, RootStackParamList } from '../types/types';




const Stack = createNativeStackNavigator<AuthStackParamList>();

const AppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='OnboardingScreen' component={Onboarding} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='OtpVerificationScreen' component={Otp} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='EnterDetailsScreen' component={EnterDetailsScreen} options={{ headerShown: false }}></Stack.Screen>
        </Stack.Navigator>
    )
}

export default AppStack

const styles = StyleSheet.create({})
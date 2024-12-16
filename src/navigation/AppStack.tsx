import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabLayout from '../screens/tabs/TabLayout';
import { AppStackParamList, RootStackParamList } from '../types/types';
import Home from '../screens/root/home/HomeScreen'
import FindRide from '../screens/root/home/find-ride/FindRideScreen'
import ConfirmRide from '../screens/root/home/filter-ride/FilterRideScreen'
import FindDestination from '../screens/root/home/find-destination/FindDestinationScreen'
import UserProfile from '../screens/root/home/user-profile/UserProfileScreen';
import SetOnMapScreen from '../screens/root/home/set-on-map/SetOnMapScreen';
import AllAddressScreen from '../screens/root/home/all-address/AllAddressScreen';
import AddNewScreen from '../screens/root/home/add-new-address/AddNewScreen';
import SetAnyAddressScreen from '../screens/root/home/set-any-address/SetAnyAddressScreen';
import SaveNewAddressScreen from '../screens/root/home/save-new-address/SaveNewAddressScreen';
import ScheduleRideScreen from '../screens/root/home/schedule-ride/ScheduleRideScreen';




const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
    return (
        <Stack.Navigator>
             <Stack.Screen name='TabsScreen' component={TabLayout} options={{ headerShown: false, gestureEnabled: false }}></Stack.Screen>
            <Stack.Screen name="HomeScreen" component={Home} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name='FindRideScreen' component={FindRide} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="FilterRideScreen" component={ConfirmRide} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="FindDestinationScreen" component={FindDestination} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="UserProfileScreen" component={UserProfile} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="SetOnMapScreen" component={SetOnMapScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="AllAddressScreen" component={AllAddressScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="AddNewAddressScreen" component={AddNewScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="SetAnyAddressScreen" component={SetAnyAddressScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="SaveNewAddressScreen" component={SaveNewAddressScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="ScheduleRideScreen" component={ScheduleRideScreen} options={{ headerShown: false }}></Stack.Screen>
        </Stack.Navigator>
    )
}

export default AppStack

const styles = StyleSheet.create({})
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
import FindScheduledRideScreen from '../screens/root/home/find-scheduled-ride/FindScheduledRideScreen';
import AcceptedRideScreen from '../screens/root/home/accept-ride/AcceptedRideScreen';
import ChatScreen from '../screens/root/home/chat/ChatScreen';
import BookForFriendScreen from '../screens/root/home/book-for-friend/BookForFriendScreen';
import AddDestinationScreen from '../screens/root/home/add-destination/AddDestinationScreen';
import AddStopScreen from '../screens/root/home/add-stop/AddStopScreen';
import SetStopScreen from '../screens/root/home/set-stop/SetStopScreen';


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
            <Stack.Screen name="FindScheduledRideScreen" component={FindScheduledRideScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="AcceptedRideScreen" component={AcceptedRideScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="BookForFriendScreen" component={BookForFriendScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="AddDestinationScreen" component={AddDestinationScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="AddStopScreen" component={AddStopScreen} options={{ headerShown: false }}></Stack.Screen>
            <Stack.Screen name="SetStopScreen" component={SetStopScreen} options={{ headerShown: false }}></Stack.Screen>

        </Stack.Navigator>
    )
}

export default AppStack

const styles = StyleSheet.create({})
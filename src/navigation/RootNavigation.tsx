
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import Onboarding from '../screens/onboarding/OnboardingScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import Otp from '../screens/auth/OtpVerification';
import Details from '../screens/auth/EnterDetails';
import TabLayout from '../screens/tabs/TabLayout';
import { Provider, useDispatch, useSelector } from "react-redux"
import { RootState, store } from '../state/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosInstance } from '../config/AxiosInstance';
import { setUser } from '../state/user/userSlice';
import EnterDetailsScreen from '../screens/auth/EnterDetails';
import { RootStackParamList } from '../types/types';
import Home from '../screens/root/home/HomeScreen'
import FindRide from '../screens/root/home/find-ride/FindRideScreen'
import ConfirmRide from '../screens/root/home/filter-ride/FilterRideScreen'
import FindDestination from '../screens/root/home/find-destination/FindDestinationScreen'
import { SocketContext } from '../context/SocketContext';
import { ActivityIndicator } from 'react-native';
import colors from '../utils/data/colors';
import UserProfile from '../screens/root/home/user-profile/UserProfileScreen';
import SetOnMapScreen from '../screens/root/home/set-on-map/SetOnMapScreen';
import AllAddressScreen from '../screens/root/home/all-address/AllAddressScreen';
import AddNewScreen from '../screens/root/home/add-new-address/AddNewScreen';
import SetAnyAddressScreen from '../screens/root/home/set-any-address/SetAnyAddressScreen';
import SaveNewAddressScreen from '../screens/root/home/save-new-address/SaveNewAddressScreen';



const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator(): React.JSX.Element {


  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch()

  const [token, setToken] = useState<any>(null)
  const [loading, setLoading] = useState(true);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const getUser = async () => {
      try {
        console.log("user", user)
        const token = await AsyncStorage.getItem("user-token");
        console.log(token)
        setToken(token)
        if (token) {
          const { data } = await AxiosInstance.get(`authentication/user-from-token`);
          if (data.data) {
            console.log("data",data.data)
            setLoading(false);
            dispatch(setUser({ fullName: data.data.name, mobileNumber: data.data.phoneNumber, email: data?.data.email, id: data?.data.id, savedAddresses: data?.data.savedAddresses }))
          }
        }
        setLoading(false)
      } catch (error: any) {
        console.log(error.message)
        setLoading(false)
      }
    }
    getUser();
  }, [])

  useEffect(() => {
    if (socket) {
      socket.connect()
      if(socket.connected){
        console.log("connecteds")
      }
    }
  }, [socket])

  if (loading) {
    return (
      <ActivityIndicator color={colors.primary[500]}></ActivityIndicator>
    )
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
      >
        {
          token ? (<>
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


          </>) : (
            <>
              <Stack.Screen name='OnboardingScreen' component={Onboarding} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name='OtpVerificationScreen' component={Otp} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name='EnterDetailsScreen' component={EnterDetailsScreen} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name='TabsScreen' component={TabLayout} options={{ headerShown: false, gestureEnabled: false }}></Stack.Screen>
            </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default RootNavigator;

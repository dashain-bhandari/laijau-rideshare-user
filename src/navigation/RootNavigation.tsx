
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from "react-redux"
import { RootState, store } from '../state/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosInstance } from '../config/AxiosInstance';
import { setUser } from '../state/user/userSlice';
import { RootStackParamList } from '../types/types';
import { SocketContext } from '../context/SocketContext';
import { ActivityIndicator } from 'react-native';
import colors from '../utils/data/colors';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import SplashScreen from '../screens/SplashScreen';

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
            console.log("data", data.data)
            dispatch(setUser({ fullName: data.data.name, mobileNumber: data.data.phoneNumber, email: data?.data.email, id: data?.data.id, savedAddresses: data?.data.savedAddresses }))
            setLoading(false);
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
      if (socket.connected) {
        console.log("connecteds")
      }
    }
  }, [socket])


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}
      >
        {loading ? (
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
        ) : token ? (
          <Stack.Screen name="AppStackScreen" component={AppStack} />
        ) : (
          <Stack.Screen name="AuthStackScreen" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default RootNavigator;

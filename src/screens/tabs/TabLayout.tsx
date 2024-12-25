import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyTabBar from './TabBar';

import RideScreen from '../root/rides/RideScreen';
import HomeScreen from '../root/home/HomeScreen';
import OfferScreen from '../root/offers/OfferScreen';
import Home from '../root/home/HomeScreen';
import { useTranslation } from 'react-i18next';


export default function TabLayout() {

    const Tabs = createBottomTabNavigator()
    const {t}=useTranslation()
    return (
        <Tabs.Navigator 
        initialRouteName='home'
        tabBar={props => <MyTabBar {...props} />} screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
            <Tabs.Screen
                name="offers"
                options={{
                    title: 'Offers',

                }}
                component={OfferScreen}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',

                }}
                component={Home}
            />
            <Tabs.Screen
                name="ride"
                options={{
                    title: 'Ride',

                }}
                component={RideScreen}
            />

        </Tabs.Navigator>
    );
}

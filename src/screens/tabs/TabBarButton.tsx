import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import  Feather  from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../../utils/data/colors';


const TabBarButton = ({ routeName, isFocused, onPress, onLongPress, label }: { routeName: string, isFocused: boolean, onPress: () => void, onLongPress: () => void, label: any }) => {

    type RouteName = 'home' | 'offers' | 'ride';
    const icon = {
        home: (props: any) => <Entypo name="home" size={24} {...props}></Entypo>,
        offers: (props: any) => <Ionicons name="notifications" size={24}  {...props}></Ionicons>,
        ride: (props: any) => <FontAwesome name="map-marker" size={24}  {...props}></FontAwesome>,
    }
    let IconComponent

    IconComponent = icon[routeName as RouteName] || ((props: any) => <Feather name='help-circle' size={24}></Feather>)

    return (
        <Pressable

            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: "center" }}
        >
            <View  style={{flexDirection:"row",alignItems:"center",gap:1}}>
                <IconComponent
                    color={
                        isFocused ? colors.primary[700] : "#111"
                    }
                ></IconComponent>
                <Text style={{ color: isFocused ? colors.primary[700] : '#222' }}>
                    {label}
                </Text>
            </View>
        </Pressable>
    )
}

export default TabBarButton

const styles = StyleSheet.create({})
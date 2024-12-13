import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { Dispatch, SetStateAction, useState } from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Entypo from '@expo/vector-icons/Entypo';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

export enum IconType {
    MaterialIcon,
    FontAwesomeIcon,
    Ionicons,
    AntDesignIcon,
    MaterialCommunityIcons
}
interface ToggleSwitchProps {
    icon: { type: IconType.MaterialIcon, name: keyof typeof MaterialIcons.glyphMap, size: number; } |
    { type: IconType.MaterialCommunityIcons, name: keyof typeof MaterialCommunityIcons.glyphMap, size: number; } |
    { type: IconType.FontAwesomeIcon, name: keyof typeof FontAwesome.glyphMap, size: number; } |
    { type: IconType.AntDesignIcon, name: keyof typeof AntDesign.glyphMap, size: number; } |
    { type: IconType.Ionicons, name: keyof typeof Ionicons.glyphMap, size: number; };
    toggle: boolean;
    setToggle: ()=>void
}

const ToggleSwitch = ({ icon, toggle, setToggle }: ToggleSwitchProps) => {
    const translate = useSharedValue(0);

    const animatedIconStyle = useAnimatedStyle(() => {
        return ({
            transform: [{
                translateX: withTiming(translate.value, { duration: 300 })
            }],

        })
    })

    return (
        <View style={[styles.container,
        { backgroundColor: toggle ? "#7469B6" : "#ccc" }
        ]}>
            <Animated.View style={[animatedIconStyle, { marginLeft: 5, justifyContent: "center", backgroundColor: "#fff", borderRadius: 20, width: 30, height: 30, alignItems: "center" }]
            }>
                <Pressable onPress={() => {
                    if (translate.value == 0) {
                        translate.value = 20

                    }
                    else {
                        translate.value = 0
                    }
                    setToggle()
                }}>
                    {icon.type === IconType.FontAwesomeIcon && (
                        <FontAwesome name={icon.name} size={icon.size} color={"#555"}/>
                    )}
                    {icon.type === IconType.MaterialIcon && (
                        <MaterialIcons name={icon.name} size={icon.size} color={"#555"} />
                    )}
                    {icon.type === IconType.MaterialCommunityIcons && (
                        <MaterialCommunityIcons name={icon.name} size={icon.size} color={"#555"}/>
                    )}
                    {icon.type === IconType.Ionicons && (
                        <Ionicons name={icon.name} size={icon.size} color={"#555"} />
                    )}
                    {icon.type === IconType.AntDesignIcon && (
                        <AntDesign name={icon.name} size={icon.size} color={"#555"}/>
                    )}
                </Pressable>
            </Animated.View>

        </View>
    )
}

export default ToggleSwitch

const styles = StyleSheet.create({
    container: {

        width: 60,
        height: 36,
        borderRadius: 25,
        flexDirection: "row",
        overflow: 'hidden',
        backgroundColor: "#ccc",
        


        alignItems: "center"
    }
})
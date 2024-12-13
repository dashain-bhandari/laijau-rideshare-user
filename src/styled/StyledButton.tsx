import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

interface ButtonProps{
    title:string
    buttonStyles?:StyleProp<ViewStyle>
    textStyles?:StyleProp<TextStyle>,
    activeOpacity?:number,
    onPress:()=>void,
    disabled?:boolean
}

const StyledButton = ({title,buttonStyles,textStyles,activeOpacity,onPress,disabled}:ButtonProps) => {
    return (
        <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        activeOpacity={activeOpacity??0.5}
         style={[styles.defaultButtonStyle,buttonStyles]}>
            <Text  style={[styles.defaultTextStyle,textStyles]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default StyledButton

const styles = StyleSheet.create({
    defaultButtonStyle:{
        padding:10,
        backgroundColor:"#ccc",
        borderRadius:10,
        width:"100%"
    },
    defaultTextStyle:{
        textAlign:"center",
        
    }
})
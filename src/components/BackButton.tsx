import { TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface BackButtonProps{
  onPressHandler:()=>void
}

const BackButton = ({onPressHandler}:BackButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.backButton} onPress={onPressHandler}>
    <Ionicons name="arrow-back" size={22} color="#555" />
  </TouchableOpacity>
  )
}

export default BackButton



const styles = StyleSheet.create({
    backButton: {
      position: "absolute",
      zIndex: 100,
      backgroundColor: "#fff",
      padding: 5,
      borderRadius: 100,
      top: 50,
      marginLeft: 16,
      borderWidth:1,
      borderColor:"#ddd",
      shadowColor:"#ddd",
      shadowOffset:{
        width:0,
        height:2
      },
      shadowOpacity:0.4,
      shadowRadius:4
  
    }
  })
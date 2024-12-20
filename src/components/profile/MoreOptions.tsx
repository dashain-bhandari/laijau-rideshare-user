import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Fontisto } from '@expo/vector-icons'
import { ProfileStyles } from './ProfileStyles'

const MoreOptions = () => {
  return (
    <View style={ProfileStyles.container}>
     <View>
        <Text style={ProfileStyles.titleStyle}>More</Text>
    </View>
    <View style={ProfileStyles.itemContainer}>
        {/* language */}
        <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={() => {
           
            console.log("hiiii")
        }
        }>
            <View style={{ marginRight: 10 }}>
                <Fontisto name="world" size={24} color="#666" />
            </View>
            <Text>Language</Text>
        </Pressable>

    </View>
    </View>
  )
}

export default MoreOptions

const styles = StyleSheet.create({
   
})
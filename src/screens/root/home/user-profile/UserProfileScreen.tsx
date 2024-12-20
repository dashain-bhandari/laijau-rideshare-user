import { StyleSheet, Dimensions, Button, Alert, View, Text, Pressable } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import Animated from 'react-native-reanimated'
import ProfileInfo from '../../../../components/profile/ProfileInfo';
import SettingsOptions from '../../../../components/profile/SettingsOptions';
import MoreOptions from '../../../../components/profile/MoreOptions';
import { UserProfileScreenProps } from '../../../../types/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get("screen");

const UserProfile = ({ navigation }: UserProfileScreenProps) => {

  const [modalVisible, setModalVisible] = useState(false);


  return (
    <View style={{ flex: 1 }}>

      <View style={{ backgroundColor: "#fff", paddingTop: 70, flexDirection: "row", justifyContent: "center", paddingBottom: 20 }}>
      <Pressable  onPress={()=>{navigation.goBack()}} style={{position:"absolute",zIndex:100,top:70,left:16}}>
      <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
        <Text style={{fontSize:18,fontWeight:"500"}}>Account and Settings</Text>
      </View>
      <Animated.ScrollView
        style={[]}
        contentContainerStyle={{ flex: 1 }}
      >

        {/* profile infooo */}
        <ProfileInfo />

        {/* settings */}
        <SettingsOptions modalVisible={modalVisible} setModalVisible={setModalVisible} />
        <MoreOptions />
      </Animated.ScrollView >

    </View>
  )
}

export default UserProfile

const styles = StyleSheet.create({

})
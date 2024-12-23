import { StyleSheet, Text, View, Image,  } from 'react-native'
import React, { useEffect, useState } from 'react'

import Octicons from '@expo/vector-icons/Octicons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import colors from '../../utils/data/colors';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

const ProfileInfo = () => {
    const {user}=useSelector((state:RootState)=>state.user)
  return (
    <View style={styles.infoContainer}>
    <View style={{backgroundColor:colors.primary[400],width:80,height:80,borderRadius:50,justifyContent:"center",alignItems:"center",flexDirection:"row",marginRight:10}}>
        {/* <Image style={{ width: 100, height: 100 }} resizeMode='contain' source={require("../../assets/images/user.jpg")}></Image> */}
        <Text style={{color:"#fff",fontSize:48}}>{user?.fullName?.slice(0,1)}</Text>
    </View>
    <View style={{ flexDirection: "column", justifyContent: "center" }}>
        <View style={styles.textContainer}>
            <Text style={{ fontWeight: 500, fontSize: 18 }}>{user?.fullName}</Text>
            <Text style={{marginTop:5}}>{user?.mobileNumber}</Text>
        </View>
        <View style={{ backgroundColor: colors.secondary[500], padding: 7, borderRadius: 20, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
            <View style={{ marginRight: 5 }}>
                <Octicons name="thumbsup" size={20} color="white" />
            </View>
            <Text style={{ color: "#fff" }}>rating</Text>
            <EvilIcons name="chevron-right" size={24} color="white" />
        </View>
    </View>
</View>
  )
}

export default ProfileInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    infoContainer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 16
    },
    userAvatar: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 50,
        overflow: "hidden"
    },
    textContainer: {
        marginBottom: 10,

    },
    settingsContainer: {
        marginTop: 10,
        flexDirection: "column",

        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 16
    }
})
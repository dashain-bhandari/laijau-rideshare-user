import { Keyboard, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import MapView from 'react-native-maps'
import AntDesign from '@expo/vector-icons/AntDesign';
import { AddNewAddressScreenProps } from '../../../../types/types';
import { TextInput } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../../../utils/data/colors';
const AddNewScreen = ({ navigation, route }: AddNewAddressScreenProps) => {
  const inputRef = useRef<TextInput>(null);
  const { tag, selectedIcon,addressLatitude,addressName,addressLongitude } = route.params
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0);
  }, [])


  return (
    <Pressable style={{ flex: 1 }} onPress={() => {
      Keyboard.dismiss()
    }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color="#555" />
          </TouchableOpacity>
          <View>
            <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "500", color: "#555" }}>Add new address</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.iconBackground}>
            <FontAwesome name="bookmark" size={20} color="#fff" />
          </View>
          <TextInput ref={inputRef} placeholder='add new address' value={addressName}></TextInput>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate("SetAnyAddressScreen", {
              tag,
              selectedIcon,
              addressLatitude,
              addressLongitude,
              addressName
            })
          }}
          style={styles.setOnMapContainer}>
          <Ionicons name="pin" size={24} color={"#fff"} />
          <Text style={{ color: "#fff" }}>Set on map</Text>
        </TouchableOpacity>
      </SafeAreaView>

    </Pressable>
  )
}

export default AddNewScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,

    paddingBottom: 20,
    borderBottomColor: "#eee",
    borderBottomWidth: 2,


  },
  backButton: {
    position: "absolute",
    left: 16,

  },
  iconBackground: {
    backgroundColor: colors.secondary[300],
    width: 36,
    height: 36,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  inputContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 20
  },
  setOnMapContainer: {
    flexDirection: "row",
    justifyContent: "center", alignItems: "center",
    marginTop: 20,
    backgroundColor: colors.primary[400],
    padding: 10,
    marginHorizontal: 16,
    borderRadius: 10,
    // shadowColor:"#ccc",
    // shadowOffset:{
    //   width:0,
    //   height:0
    // },
    // shadowRadius:4,
    // shadowOpacity:0.2,

  }
})
import { ActivityIndicator, Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { TextInput } from 'react-native'
import { TouchableHighlight } from 'react-native'

import { AxiosInstance } from '../../config/AxiosInstance'
import { useNavigation } from '@react-navigation/native'
import colors from '../../utils/data/colors'
import { HomeScreenNavigation, RegisterScreenProps } from '../../types/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { setUser } from '../../state/user/userSlice'

const { width, height } = Dimensions.get("screen")



const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [number, onChangeNumber] = React.useState('');
  const [code, onChangeCode] = React.useState('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigationHome=useNavigation<HomeScreenNavigation>()
const dispatch=useDispatch()
  const sendVerificationCode = async () => {
    let phoneNumber = `${number}`
    setLoading(true)
    try {
      console.log(number);
      const { data } = await AxiosInstance.get(`/authentication/login-user/${phoneNumber}`);
      console.log(data);

      if (data && data.token) {
        await AsyncStorage.setItem("user-token", data.token)

        let token=await AsyncStorage.getItem("user-token")
      //  token &&  navigationHome.navigate("TabsScreen");
       dispatch(setUser({ fullName: data.data.name, mobileNumber: data.data.phoneNumber, email: data?.data.email, id: data?.data.id, savedAddresses: data?.data.savedAddresses }))

      }
      else {
        navigation.navigate("EnterDetailsScreen", { mobileNumber: phoneNumber });

      }
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flex: 1, flexDirection: "column", paddingHorizontal: 10, marginTop: 30 }} style={{ width: width }}>
        <View style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", paddingHorizontal: 10 }}>
          <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>Add Phone Number </Text>
          <Text style={{ textAlign: "center", marginTop: 10, width: "80%", color: "#555" }}>This will help us verify your phone number. We will send you a verification code.</Text>
        </View>



        <View style={{ flexDirection: "row", gap: 2, marginTop: 8 }}>


          <View style={{ flexGrow: 1 }}>
            <TextInput placeholder='98378883746' style={{ backgroundColor: "#ddd", paddingHorizontal: 10, paddingVertical: 10, borderRadius: 20, borderColor: "#ddd", borderWidth: 1 }}
              onChangeText={onChangeNumber}

              value={number}
              placeholderTextColor={"#888"}
            ></TextInput>
          </View>

        </View>
        <TouchableHighlight style={{ backgroundColor: colors.primary[500], paddingHorizontal: 10, paddingVertical: 10, borderRadius: 20, marginTop: 20 }} onPress={() => {
          // navigation.navigate("/(auth)/otp-verification")
          sendVerificationCode()
        }} underlayColor={"#9DA9A0"}>
          <View>
            {
              loading ? (<View><ActivityIndicator color={"#ccc"}></ActivityIndicator></View>) : (<Text style={{ textAlign: "center", color: "#fff" }}>Next</Text>)
            }
          </View>
        </TouchableHighlight>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})
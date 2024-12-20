import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native'
import { ScrollView } from 'react-native'
import { OtpInput } from "react-native-otp-entry";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosInstance } from '../../config/AxiosInstance';
import colors from '../../utils/data/colors';
import { useNavigation } from '@react-navigation/native';
import { OtpVerificationScreenProps } from '../../types/types';
import { useDispatch } from 'react-redux';
import { setUser } from '../../state/user/userSlice';

const { width } = Dimensions.get("screen");

async function save(key: string, value: string) {
  await AsyncStorage.setItem(key, value);
}
const Otp = ({ route, navigation }: OtpVerificationScreenProps) => {
  const [otp, setOtp] = useState<number>()
  const { email } = route.params;
  const dispatch = useDispatch();
  const verify = async () => {
    try {
      const { data } = await AxiosInstance.post("/authentication/verify-user-email", {
        email,
        otp
      });
      console.log(data);
      if (data && data.token && data.data) {
        save("user-token", data.token);
        // await AsyncStorage.setItem("user", JSON.stringify(data.user))
        dispatch(setUser({ fullName: data.data.name, mobileNumber: data.data.phoneNumber, email: data?.data.email, id: data?.data.id, savedAddresses: data?.data.savedAddresses }))


      }
      else {
        console.log("errorrrr")
      }
    } catch (error: any) {
      console.log(error);

    }

  }
  const resendOtp = async () => {
    try {
      const { data } = await AxiosInstance.post("/authentication/resend-user-otp", {
        email
      });
      console.log(data);
      if (data.status == "error") {
        console.log(data.message);
      }

    } catch (error: any) {
      console.log(error);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flex: 1, flexDirection: "column", paddingHorizontal: 10, marginTop: 30 }} style={{ width: width }}>
        <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
          <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>Verify phone number </Text>
          <Text style={{ textAlign: "center", marginTop: 10, width: "80%", color: "#444" }}>Enter the otp code sent on your phone to proceed.</Text>
        </View>
        <OtpInput
          autoFocus={false}
          numberOfDigits={6}
          focusColor="#d2624d"
          focusStickBlinkingDuration={500}
          onTextChange={(text) => console.log(text)}
          onFilled={(text) => setOtp(parseInt(text))}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
          theme={{
            pinCodeContainerStyle: {
              borderColor: "#ccc"
            },
            containerStyle: {
              marginTop: 20,
              paddingHorizontal: 10
            }
          }}
        />
        <TouchableOpacity activeOpacity={0.5} style={{ marginTop: 20, marginHorizontal: 10, backgroundColor: colors.primary[600], paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10 }} onPress={verify}>
          <Text style={{ color: "#fff", textAlign: "center" }}>Verify</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, justifyContent: "center" }}>
          <Text style={{ textAlign: "center", color: "#444" }}>Didn't recieve the code yet?</Text>
          <TouchableOpacity onPress={resendOtp}>

            <Text style={{ color: colors.secondary[500] }}> Resend code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Otp

const styles = StyleSheet.create({})
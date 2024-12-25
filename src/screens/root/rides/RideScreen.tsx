import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useHeaderHeight } from '@react-navigation/elements';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Entypo from '@expo/vector-icons/Entypo';
import { addDoc, collection, doc, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';

import { Alert } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RootState } from '../../../state/store';
import colors from '../../../utils/data/colors';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigation } from '../../../types/types';
import { AxiosInstance } from '../../../config/AxiosInstance';
import { setRides } from '../../../state/rides/ridesSlice';
import { useFocusEffect } from '@react-navigation/native';
const RideScreen = () => {


  const { user } = useSelector((state: RootState) => state.user)
  const { rides } = useSelector((state: RootState) => state.rides)
  const navigation = useNavigation<HomeScreenNavigation>()
  const dispatch = useDispatch()

  const getAllRides = async () => {
    if (user) {
      try {
        console.log("yoo hiii")
        const { data } = await AxiosInstance.get(`/ride/user/${user?.id}`);
        console.log(data)
        if (data.data) {
          console.log("rides data from db: ", data.data)
          dispatch(setRides(data.data))
        }
      } catch (error: any) {
        console.log("error getting user rides from db:", error.message)
      }
    }

  }

  useFocusEffect(
    useCallback(() => {

      getAllRides();
      // Clean up if needed
      return () => {
        console.log('Screen is unfocused');
      };
    }, [])
  );


  return (

    <View style={{ flex: 1 }}>
      {/* header */}
      <SafeAreaView style={{ flexDirection: "row", justifyContent: "center", backgroundColor: "#fff", borderBottomColor: "#eee", borderBottomWidth: 4, paddingHorizontal: 16, paddingTop: 10 }}>

        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontWeight: "600", fontSize: 18, textAlign: "center" }}>
            My rides
          </Text>
        </View>

      </SafeAreaView>
      <ScrollView style={styles.scrollViewContent}>
        {
          rides && rides?.length > 0 && rides.map((item: any, index: number) => {

            return (

              <Pressable
                key={item?.id}
                onPress={() => navigation.navigate("TripDetailScreen", { item })}
                style={{ flexDirection: "column", paddingHorizontal: 16, borderBottomColor: "#ddd", borderBottomWidth: 1, gap: 10, paddingVertical: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={{ fontWeight: "500" }}>
                    {
                      item?.createdAt?.slice(0, 10) ?? "date here"
                    }
                  </Text>
                  <Text>
                    Rs.
                    {
                      item?.offeredPrice
                    }
                  </Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ width: 30, height: 30, borderRadius: 30, backgroundColor: colors.secondary[200], flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                      <AntDesign name="arrowdown" size={20} color="#fff" />
                    </View>
                    {/* pickup */}
                    <Text>{item?.pickup?.userAddress}</Text>
                  </View>
                  <View>
                    <Entypo name="chevron-right" size={24} color="#333" />
                  </View>
                </View>
                {/* dest */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ width: 30, height: 30, borderRadius: 30, backgroundColor: colors.primary[200], flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                      <Entypo name="location-pin" size={20} color="#fff" />
                    </View>
                    {/* destination */}
                    <Text>{item?.dropoff?.destinationAddress}</Text>
                  </View>

                </View>
                <View>

                </View>
              </Pressable>

            )
          })
        }
      </ScrollView>
    </View>



  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,


    backgroundColor: "#fff"
  },
});

export default RideScreen;

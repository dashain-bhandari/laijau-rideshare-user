import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import colors from '../../../utils/data/colors';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { HomeScreenNavigation } from '../../../types/types';
import { useDispatch, useSelector } from 'react-redux';
import { setBookedForFriend, setVehicleType } from '../../../state/rideRequest/rideRequestSlice';
import { RootState } from '../../../state/store';
const Services = () => {
  const navigation = useNavigation<HomeScreenNavigation>()
  return (
    <View >
      <Text style={{ fontSize: 16 }}>Services</Text>
      {/* bike */}
      <View style={{
        flexDirection: "row",
        marginTop: 10
      }}>
        <Bike navigation={navigation} />
        <Car navigation={navigation} />
        <ForFriend navigation={navigation} />
      </View>
    </View>
  )
}

export default Services

const styles = StyleSheet.create({
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    color: '#fff',
  },
  serviceView: {
    borderRadius: 35,
    width: 70,
    height: 70,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  }
})


const Bike = ({ navigation }: { navigation: HomeScreenNavigation }) => {
  const dispatch = useDispatch()
  const { ongoingRide } = useSelector((state: RootState) => state.ongoingRide)
  return (
    <TouchableOpacity style={{
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20,

    }}
      onPress={() => {

        if (ongoingRide) {
          navigation.navigate("AcceptedRideScreen");
        } else {
          dispatch(setVehicleType("Bike"))
          navigation.navigate("FindDestinationScreen");
        }
      }}
    >
      <LinearGradient
        colors={[colors.primary[200], colors.primary[100]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.serviceView}>
        <FontAwesome5 name="motorcycle" size={36} color={colors.primary[800]} />
      </LinearGradient>
      {/* <View style={{backgroundColor:colors.primary[200],width:75,height:75,flexDirection:"row",justifyContent:"center",alignItems:"center",borderRadius:40}}>
      <FontAwesome5 name="motorcycle" size={36} color={"#555"} />
      </View> */}
      <Text style={{ marginTop: 5 }} >Bike</Text>
    </TouchableOpacity>
  )
}

const Car = ({ navigation }: { navigation: HomeScreenNavigation }) => {
  const dispatch = useDispatch()
  const { ongoingRide } = useSelector((state: RootState) => state.ongoingRide)
  return (
    <TouchableOpacity style={{
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20
    }}
      onPress={() => {
        if (ongoingRide) {
          navigation.navigate("AcceptedRideScreen");
        } else {
          dispatch(setVehicleType("Car"))
          navigation.navigate("FindDestinationScreen")
        }
      }}
    >
      <LinearGradient
        colors={[colors.primary[200], colors.primary[100]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.serviceView}>
        <FontAwesome6 name="car-side" size={36} color={colors.primary[800]} />
      </LinearGradient>
      <Text style={{ marginTop: 5 }}>Car</Text>
    </TouchableOpacity>
  )
}

const ForFriend = ({ navigation }: { navigation: HomeScreenNavigation }) => {
  const dispatch = useDispatch()
  const { bookedForFriend } = useSelector((state: RootState) => state.bookedForFriend)
  return (
    <TouchableOpacity style={{
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}
      onPress={() => {
        // if (bookedForFriend) {
        //   Alert.alert("You have already booked a ride.")
        // } else {
        //   // dispatch(setVehicleType("Car"))
        //   navigation.navigate("FindDestinationScreen")
        // }

        dispatch(setBookedForFriend(true));
        navigation.navigate("BookForFriendScreen")

      }}
    >
      <LinearGradient
        colors={[colors.primary[200], colors.primary[100]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.serviceView}>
        <FontAwesome5 name="user-friends" size={36} color={colors.primary[800]} />

      </LinearGradient>
      <Text style={{ marginTop: 5 }}>Book for friend</Text>
    </TouchableOpacity>
  )
}